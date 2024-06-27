#[path = "../dto/asn_record.rs"] mod asn_record;
#[path = "../dto/filter.rs"] mod filter;

use asn_db::{Db, Record};
use chrono::prelude::*;
use elasticsearch::IndexParts;
use isbot::Bots;
use mongodb::bson::doc;
use mongodb::options::FindOneOptions;
use mongodb::sync::Collection;
use nanoid::nanoid;
use redis::Connection;
use rocket::http::{ContentType, HeaderMap, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use serde_json::json;
use tokio::runtime::Handle;
use tokio::task;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::env;
use serde::{Deserialize, Serialize};
use crate::config::CONFIG;
use crate::{filter_kit, guard_kit};
use crate::main_routes::not_found;
use crate::{rdr_kit, resource_kit, database::get_database};
use elasticsearch::{
  Elasticsearch, http::transport::Transport,
};

pub struct XRealIp<'r>(&'r str);
pub struct UserAgent<'r>(&'r str);
pub struct HeadersMap<'r>(&'r HeaderMap<'r>);

// Implement the `FromRequest` trait for `XRealIp`
#[derive(Debug)]
pub enum ImplementationError {}

#[derive(Serialize, Deserialize, Debug)]
pub struct Route {
    pub name: String,
    pub path: String,
    pub params: Option<HashMap<String, String>>,
    pub filter_id: Option<String>,
    pub resource_id: Option<String>,
    pub domain: Option<String>,
}

// Implement the `FromRequest` trait for `XRealIp`
#[rocket::async_trait]
impl<'r> FromRequest<'r> for XRealIp<'r> {
    type Error = ImplementationError;

    // Extract the IP address from the `X-Real-IP` header
    // or `X-Forwarded-For` header
    // or the `CF-Connecting-IP` header
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, ImplementationError> {
      let ip_header = if CONFIG["use_cloudflare_data_priority"].as_bool().unwrap() {
        req
          .headers()
          .get_one("cf-connecting-ip")
          .or_else(|| req.headers().get_one("x-real-ip"))
          .or_else(|| req.headers().get_one("x-forwarded-for"))
      } else {
        req
          .headers()
          .get_one("x-real-ip")
          .or_else(|| req.headers().get_one("x-forwarded-for"))
      };

      if ip_header.is_none() {
        Outcome::Success(XRealIp(""))
      } else {
        Outcome::Success(XRealIp(ip_header.unwrap()))
      }
    }
}

// Implement the `FromRequest` trait for `HeadersMap`
#[rocket::async_trait]
impl<'r> FromRequest<'r> for HeadersMap<'r> {
    type Error = ImplementationError;

    // Extract the request headers
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, ImplementationError> {
        let headers = req.headers();

        Outcome::Success(HeadersMap(headers))
    }
}

// Implement the `FromRequest` trait for `UserAgent`
#[rocket::async_trait]
impl<'r> FromRequest<'r> for UserAgent<'r> {
    type Error = ImplementationError;

    // Extract the User-Agent header
    // `user-agent` header is optional
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, ImplementationError> {
        fn is_valid(_key: &str) -> bool {
            true
        }

        match req.headers().get_one("user-agent") {
            None => Outcome::Success(UserAgent("")),
            Some(key) if is_valid(key) => Outcome::Success(UserAgent(key)),
            Some(_) => Outcome::Success(UserAgent("")),
        }
    }
}

lazy_static! {
  // Define a static reference to a thread-safe mutex
  // containing a tuple of two strings
  pub static ref REQUEST_CACHE_STORAGE: Arc<Mutex<(String, String)>> = Arc::new(Mutex::new((String::new(), String::new())));

  // Define a static reference to a thread-safe Arc with a
  // default instance of Bots struct
  pub static ref BOT_DETECTOR: Arc<Bots> = Arc::new(Bots::default());

  // Define a static reference to a thread-safe Arc
  // with a Db instance created from a TSV file
  pub static ref DATABASE: Arc<Db> = Arc::new(
    Db::form_tsv(BufReader::new(File::open("containers/ip2asn-v4.tsv").unwrap())).unwrap()
  );

  // Define a static reference to a mutex
  // containing a Redis client
  pub static ref REDIS_CLIENT: Mutex<redis::Client> = Mutex::new(
    redis::Client::open(env::var("REDIS_URI").unwrap_or("redis://127.0.0.1/".to_string()))
      .expect("Unable to create redis client")
  );

  // Define a static reference to a mutex
  // containing a Redis connection
  pub static ref REDIS: Mutex<Connection> = Mutex::new(
    redis::Client::open(env::var("REDIS_URI").unwrap_or("redis://127.0.0.1/".to_string()))
      .expect("Unable to create redis client")
      .get_connection()
      .expect("Unable to get redis connection")
  );

  // Define elastic search client
  pub static ref ELASTIC: Mutex<Elasticsearch> = Mutex::new(
    Elasticsearch::new(Transport::single_node(&env::var("ELASTIC_URI").unwrap_or("http://127.0.0.1:9200".to_string()).as_str()).unwrap())
  );
}


fn async_register_request_info(
  asn_record: Option<&Record>,
  raw_headers: HeaderMap,
  user_agent: String,
  query: HashMap<String, String>,
  route_way: Option<Vec<asn_record::RouteWay>>,
  route_name: Option<String>,
  resource_id: Option<String>,
) -> String {
  let now = Utc::now();
  let mut headers: HashMap<String, String> = HashMap::new();

  for raw_header in raw_headers.iter() {
    headers.insert(
      raw_header.name().to_string(),
      raw_header.value().to_string(),
    );
  }
  
  let request_id = if raw_headers.get_one("request-id").is_some() { 
    raw_headers.get_one("request-id").unwrap().to_string()
  } else {
    nanoid!()
  };

  let return_request_id = request_id.clone();

  let collection: Collection<asn_record::AsnRecord> =
    get_database(String::from("requests"))
    .collection("asn_records");

  if let Some(result_record) = asn_record {
    let is_allow_write_record = raw_headers
      .get_one("cf-ipcountry")
      .is_some() && 
        CONFIG["use_cloudflare_data_priority"]
          .as_bool()
          .unwrap();

    let cuntry_code = if is_allow_write_record {
      Some(raw_headers.get_one("cf-ipcountry").unwrap().to_string().to_uppercase())
    } else { 
      Some(result_record.country.clone().to_uppercase())
    };

    task::block_in_place(move || {
      Handle::current().block_on(async move {
        let insert_data = asn_record::AsnRecord {
          asn_name: Some(result_record.owner.clone()),
          asn_country_code: cuntry_code.clone(),
          asn_description: Some(String::new()),
          request_id: request_id.clone(),
          time: now.timestamp_micros(),
          asn_number: Some(u32::from(result_record.as_number)),
          is_ua_bot: Some(BOT_DETECTOR.is_bot(user_agent.as_str())),
          headers: Some(headers.clone()),
          query: Some(query),
          route_way: route_way,
          route_name: route_name,
          resource_id: resource_id,
        };
    
        let insert_json_raw = json!(insert_data);

        if CONFIG["is_save_requests_in_mongodb"].as_bool().unwrap() {
          collection
            .insert_one(
              insert_data,
              None,
            )
            .unwrap();
        }

        if CONFIG["is_save_requests_in_elastic"].as_bool().unwrap() {
          ELASTIC
            .lock()
            .unwrap()
            .index(IndexParts::IndexId("requests", &request_id))
            .body(insert_json_raw.to_owned())
            .send()
            .await
            .unwrap();
        }
      })
    });
  } else {
    task::block_in_place(move || {
      Handle::current().block_on(async move {
        let insert_data = asn_record::AsnRecord {
          asn_name: None,
          asn_country_code: None,
          asn_description: None,
          request_id: request_id.clone(),
          time: now.timestamp_micros(),
          asn_number: None,
          is_ua_bot: Some(BOT_DETECTOR.is_bot(user_agent.as_str())),
          headers: Some(headers),
          query: Some(query),
          route_way: route_way,
          route_name: route_name,
          resource_id: resource_id,
        };
    
        let insert_json_raw = json!(insert_data);

        if CONFIG["is_save_requests_in_mongodb"].as_bool().unwrap() {
          collection
            .insert_one(
              insert_data,
              None,
            )
            .unwrap();
        }

        if CONFIG["is_save_requests_in_elastic"].as_bool().unwrap() {
          ELASTIC
            .lock()
            .unwrap()
            .index(IndexParts::IndexId("requests", &request_id))
            .body(insert_json_raw.to_owned())
            .send()
            .await
            .unwrap();
        }
      })
    });
  };

  return return_request_id;
}

fn create_meta_dataset_for_template(
  client_ip: &str,
  domain: Option<&str>,
  user_agent: &str,
  raw_headers: HeaderMap,
  query: HashMap<String, String>,
  resource: &resource_kit::Resource
) -> HashMap<String, String> {
  let mut meta = HashMap::new();

  meta.insert("ip".to_string(), client_ip.to_string());
  meta.insert("client-ip".to_string(), client_ip.to_string());

  meta.insert("user-agent".to_string(), user_agent.to_string());
  meta.insert("utc-time".to_string(), Utc::now().to_string());

  meta.insert("nanoid".to_string(), nanoid!(16));
  meta.insert("is_bellisimo".to_string(), "true".to_string());

  meta.insert("domain".to_string(), domain.unwrap_or("localhost").to_string());
  
  if resource.file_path.is_some() {
    let root = resource.file_path.clone().unwrap();
    let root = Path::new(&root);
    let root = root.parent().unwrap();
    let root = root.to_str().unwrap().split('/').collect::<Vec<&str>>();
    
    let pwd = Path::new(CONFIG["http_server_serve_uri_path"].as_str().unwrap());

    let public = pwd
      .join(root.last().unwrap())
      .into_os_string()
      .into_string()
      .unwrap();

    meta.insert("public".to_string(), public.clone());
    meta.insert("static".to_string(), public.clone());
  }  

  if CONFIG["ext_apply_http_query"].as_bool().unwrap() &&  !query.is_empty() {  
    query.iter().for_each(|(k, v)| {
      meta.insert(k.to_string(), v.to_string());
    });
  }


  if CONFIG["ext_apply_http_headers"].as_bool().unwrap() && !raw_headers.is_empty() {
    for h in raw_headers.iter() {
      meta.insert("http-header-".to_string() + h.name().to_string().to_lowercase().as_str(), h.value().to_string());
    }  
  }
  
  return meta;
}

fn receive_path(router: PathBuf) -> String {
  if router == PathBuf::new() {
    Path::new("/").join("index")
  } else {
    Path::new("/").join(router)
  }
    .into_os_string()
    .into_string()
    .expect("Unable to convert path to string")
    .to_owned()
}

fn get_router_by_path_and_domain(
  path: &str,
  domain: Option<&str>
) -> Option<Route> {
  let collection: Collection<Route> =
    get_database(String::from("routes")).collection("routes");

  let mut find_result = collection
    .find_one(
      doc! {
        "path": path,
        "domain": domain
      },
      FindOneOptions::builder().build(),
    )
    .unwrap()
    .or(None);

  if find_result.is_none() {
    find_result = collection
      .find_one(
        doc! {
          "path": path,
          "$or": [
            {"domain": "any"},
            {"domain": "*"},
            {"domain": ""},
            {"domain": null},
            {"domain": "ANY"},
            {"domain": "everyone"},
          ]
        },
        FindOneOptions::builder().build(),
      )
      .unwrap()
      .or(None);
  }

  return find_result;
}

#[get("/<router..>?<query..>", rank=15)]
pub async fn router(
  x_real_ip: XRealIp<'_>,
  user_agent: UserAgent<'_>,
  router: PathBuf,
  raw_headers: HeadersMap<'_>,
  query: HashMap<String, String>,
) -> Option<(Status, (ContentType, String))> {
  let path_as_string = receive_path(router);
  let domain = raw_headers.0.get_one("host");
  let find_result = get_router_by_path_and_domain(&path_as_string, domain);
  
  if find_result.is_none() {
    return Some(not_found());
  }

  let route = find_result.unwrap();

  if route.resource_id.is_none() || route.filter_id.is_none() {
    return Some(not_found());
  }

  let collection: Collection<filter::Filter> =
    get_database(String::from("filters")).collection("filters");

  let filter = collection
    .find_one(
      doc! {
        "filter_id": &route.filter_id.clone().unwrap()
      },
      None,
    )
    .expect("Unable to find filter")
    .expect("Filter not found");

  // memory-leak?
  let asn_database = DATABASE.to_owned();
  let asn_record = asn_database.lookup(x_real_ip.0.parse().unwrap_or("0.0.0.0".parse().unwrap()));

  let mut filter_break: Option<(Status, (ContentType, String))> = None;
  let mut route_way: Vec<asn_record::RouteWay> = vec![];

  // Filter
  'filter: for condition in filter.conditions {
    let resource_id = condition
      .resource_id
      .expect("Unable to get resource");
    
    let resource = resource_kit::require_resource(resource_id.as_str());

    if condition.plugin.is_empty() {
      continue;
    }

    let plugin = filter_kit::get_filter(&condition.plugin);

    let result = plugin(
      &condition.plugin,
      &x_real_ip.0.to_owned(),
      &user_agent.0.to_owned(),
      raw_headers.0.to_owned(),
      asn_record,
      &condition.value.as_str(),
      &condition.operator.as_str()
    );
    
    let way = asn_record::RouteWay {
      name: condition.name,
      use_this_way: result
    };

    route_way.push(way);

    if result {
      let mut meta = create_meta_dataset_for_template(
        &x_real_ip.0.to_owned(),
        domain,
        &user_agent.0.to_owned(),
        raw_headers.0.to_owned(),
        query.clone(),
        &resource
      );

      if route.params.is_some() {
        let params = route.params.clone().unwrap();
        meta.extend(params);
      }

      let closure = rdr_kit::render_resource_for_http(resource, meta);
      let out = closure.await;
     
      filter_break = Some(out);

      break 'filter;
    }
  }

  route_way
    .push(asn_record::RouteWay {
      name: String::from("default"),
      use_this_way: filter_break.is_none()
    });

  let register_resource_id = if filter_break.is_none() {
    route.resource_id.clone()
  } else {
    None
  };

  let request_id = async_register_request_info(
    asn_record,
    raw_headers.0.to_owned(),
    user_agent.0.to_owned(),
    query.clone(),
    Some(route_way),
    Some(route.name),
    register_resource_id,
  );

  if asn_record.is_some() {
    let score = guard_kit::rate_traffic(
      guard_kit::TrafficRequest {
        asn_record: asn_record.unwrap().to_owned(),
        ip: x_real_ip.0.to_owned(),
        user_agent: user_agent.0.to_owned(),
        headers: raw_headers.0.to_owned(),
        request_id: Some(request_id),
        resource_id: None
      }
    );

    let collection: Collection<guard_kit::GuardScore> = get_database(String::from("requests")).collection("guard");

    collection
      .insert_one(
        score,
        None
      )
      .unwrap();
  }

  if filter_break.is_some() {
    return Some(filter_break.unwrap());
  }
  
  let resource_id = route.resource_id.unwrap();
    let resource = resource_kit::require_resource(resource_id.as_str());

    let mut meta: HashMap<String, String> = create_meta_dataset_for_template(
      &x_real_ip.0.to_owned(),
      domain,
      &user_agent.0.to_owned(),
      raw_headers.0.to_owned(),
      query.clone(),
      &resource
    );

    if route.params.is_some() {
      let params = route.params.clone().unwrap();
      meta.extend(params);
    }

    return Some(rdr_kit::render_resource_for_http(resource, meta).await);
}
