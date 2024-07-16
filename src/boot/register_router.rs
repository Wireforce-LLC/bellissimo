use asn_db::{Db, Record};
use isbot::Bots;
use mongodb::bson::doc;
use mongodb::options::FindOneOptions;
use mongodb::sync::Collection;
use redis::Connection;
use rocket::http::{ContentType, HeaderMap, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use uaparser::{Parser, UserAgentParser};
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::{Path, PathBuf};
use std::sync::{Mutex};
use std::env;
use serde::{Deserialize, Serialize};
use crate::config::CONFIG;
use crate::mongo_sdk::MongoDatabase;
use crate::resource_kit::Resource;
use crate::statistica_sdk::{Converter, Statistica};
use crate::{asn_record, filter, filter_kit, guard_kit};
use crate::main_routes::not_found;
use crate::{rdr_kit, resource_kit};

struct RouterBody<'a> {
  x_real_ip: XRealIp<'a>,
  user_agent: UserAgent<'a>,
  router: PathBuf,
  raw_headers: HeadersMap<'a>,
  query: HashMap<String, String>,
  http_method: Option<String>,
  data: Option<String>
}

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
  // default instance of Bots struct
  pub static ref BOT_DETECTOR: Bots = Bots::default();

  // a Db instance created from a TSV file
  pub static ref DATABASE: Db = Db::form_tsv(BufReader::new(File::open("./containers/ip2asn-v4.tsv").unwrap())).unwrap();

  // Define a static reference to a mutex
  // containing a Redis client
  pub static ref REDIS_CLIENT: Mutex<redis::Client> = Mutex::new(
    redis::Client::open(env::var("REDIS_URI").unwrap_or("redis://127.0.0.1/".to_string()))
      .expect("Unable to create redis client")
  );

  pub static ref UA_PARSER: UserAgentParser = UserAgentParser
    ::from_bytes(include_bytes!("../../containers/user_agent_parser.bin"))
    .expect("Parser creation failed");

  // Define a static reference to a mutex
  // containing a Redis connection
  pub static ref REDIS: Mutex<Connection> = Mutex::new(
    redis::Client::open(env::var("REDIS_URI").unwrap_or("redis://127.0.0.1/".to_string()))
      .expect("Unable to create redis client")
      .get_connection()
      .expect("Unable to get redis connection")
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
  let (request_id, request) = Converter::convert_params_to_asn_record_struct(
    &user_agent, 
    asn_record, 
    raw_headers, 
    query,
    route_way, 
    route_name, 
    resource_id
  );
 
  Statistica::register_request(
    &request_id,
    &request,
  );

  return request_id;
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
  let collection = MongoDatabase::use_routes_collection();

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

#[post("/<router..>?<query..>", rank=15, data="<data>")]
pub async fn router_post(
  x_real_ip: XRealIp<'_>,
  user_agent: UserAgent<'_>,
  router: PathBuf,
  raw_headers: HeadersMap<'_>,
  query: HashMap<String, String>,
  data: String,
) -> Option<(Status, (ContentType, String))> {
  return router_caller(
    RouterBody {
      x_real_ip,
      user_agent,
      router,
      raw_headers,
      query,
      http_method: Some(String::from("POST")),
      data: Some(data)
    }
  ).await;
}

#[post("/<router..>?<query..>", rank=15, data="<data>")]
pub async fn router_put(
  x_real_ip: XRealIp<'_>,
  user_agent: UserAgent<'_>,
  router: PathBuf,
  raw_headers: HeadersMap<'_>,
  query: HashMap<String, String>,
  data: String,
) -> Option<(Status, (ContentType, String))> {
  return router_caller(
    RouterBody {
      x_real_ip,
      user_agent,
      router,
      raw_headers,
      query,
      http_method: Some(String::from("PUT")),
      data: Some(data)
    }
  ).await;
}

#[get("/<router..>?<query..>", rank=15)]
pub async fn router_get(
  x_real_ip: XRealIp<'_>,
  user_agent: UserAgent<'_>,
  router: PathBuf,
  raw_headers: HeadersMap<'_>,
  query: HashMap<String, String>,
) -> Option<(Status, (ContentType, String))> {
  return router_caller(
    RouterBody {
      x_real_ip,
      user_agent,
      router,
      raw_headers,
      query,
      http_method: Some(String::from("GET")),
      data: None,
    }
  ).await;
}

async fn router_caller(
  body: RouterBody<'_>,
) -> Option<(Status, (ContentType, String))> {
  let path_as_string = receive_path(body.router);
  let domain = body.raw_headers.0.get_one("host");
  let find_result = get_router_by_path_and_domain(&path_as_string, domain);
  let request_method = body.http_method.unwrap_or("GET".to_string());

  let collection = MongoDatabase::use_collection::<filter::Filter>("filters", "filters");

  if find_result.is_none() {
    return Some(not_found());
  }

  let route = find_result.unwrap();

  if route.resource_id.is_none() || route.filter_id.is_none() {
    return Some(not_found());
  }

  let filter = collection
    .find_one(
      doc! {
        "filter_id": &route.filter_id.clone().unwrap()
      },
      None,
    )
    .expect("Unable to find filter")
    .expect("Filter not found");

  let asn_record = DATABASE.lookup(body.x_real_ip.0.parse().unwrap_or("0.0.0.0".parse().unwrap()));

  let mut filter_break: Option<Resource> = None;
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
      &body.x_real_ip.0.to_owned(),
      &body.user_agent.0.to_owned(),
      body.raw_headers.0.to_owned(),
      asn_record,
      &condition.value.as_str(),
      &condition.operator.as_str()
    );
    
    let way = asn_record::RouteWay {
      name: condition.name,
      use_this_way: result
    };

    route_way.push(way);

    // if filter break
    if result {
      filter_break = Some(resource);
      // filter_break = Some(out);

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
    body.raw_headers.0.to_owned(),
    body.user_agent.0.to_owned(),
    body.query.clone(),
    Some(route_way),
    Some(route.name),
    register_resource_id,
  );

  let mut meta = Converter::convert_params_to_meta_for_request(
    &body.x_real_ip.0.to_owned(),
    domain,
    &body.user_agent.0.to_owned(),
    body.raw_headers.0.to_owned(),
    body.query.clone()
  );

  meta.insert(
    "http-method".to_string(), 
    request_method.clone()
  );

  if body.data.is_some() {
    meta.insert("http-body".to_string(), body.data.unwrap());
  }

  if route.params.is_some() {
    let params = route.params.clone().unwrap();
    meta.extend(params);
  }

  if asn_record.is_some() {
    let score = guard_kit::rate_traffic(
      guard_kit::TrafficRequest {
        asn_record: asn_record.unwrap().to_owned(),
        ip: body.x_real_ip.0.to_owned(),
        user_agent: body.user_agent.0.to_owned(),
        headers: body.raw_headers.0.to_owned(),
        request_id: Some(request_id),
        resource_id: None
      }
    );

    let collection = MongoDatabase::use_guards_collection();

    collection
      .insert_one(
        score,
        None
      )
      .unwrap();
  }

  if filter_break.is_some() {
    let resource = filter_break.unwrap();
    let files_link_meta = Converter::convert_params_to_meta_file_links(&resource);

    meta.extend(files_link_meta);

    let closure = rdr_kit::render_resource_for_http(
      resource, 
      meta
    );

    let out = closure.await;
  
    return Some(out);
  }
  
  let resource_id = route.resource_id.unwrap();
  let resource = resource_kit::require_resource(resource_id.as_str());

  let files_link_meta = Converter::convert_params_to_meta_file_links(&resource);

  meta.extend(files_link_meta);

  return Some(rdr_kit::render_resource_for_http(resource, meta).await);
}