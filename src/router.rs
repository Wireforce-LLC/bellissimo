#[path = "dto/asn_record.rs"] mod asn_record;
#[path = "dto/filter.rs"] mod filter;

use asn_db::{Db, Record};
use chrono::prelude::*;
use elasticsearch::IndexParts;
use isbot::Bots;
use mongodb::bson::doc;
use mongodb::options::FindOneOptions;
use mongodb::sync::Collection;
use nanoid::nanoid;
use redis::{Connection};
use rocket::futures::FutureExt;
use rocket::http::{ContentType, HeaderMap, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use serde_json::json;
use tokio::runtime::Handle;
use tokio::task;
use uaparser::{Parser, UserAgentParser};
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::net::IpAddr;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::env;
use serde::{Deserialize, Serialize};
use crate::config::CONFIG;
use crate::not_found;
use crate::p_kit::{self, get_all_runtime_plugins};
use crate::{config, rdr_kit, resource_kit, database::get_database};
use elasticsearch::{
  Elasticsearch, Error,
  http::transport::Transport,
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
    Db::form_tsv(BufReader::new(File::open("ip2asn-v4.tsv").unwrap())).unwrap()
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

  pub static ref ELASTIC: Mutex<Elasticsearch> = Mutex::new(
    Elasticsearch::new(Transport::single_node(&env::var("ELASTIC_URI").unwrap_or("http://127.0.0.1:9200".to_string()).as_str()).unwrap())
  );
}

lazy_static! {
  pub static ref FILTERS_METHODS: Mutex<HashMap<String, fn(this: &str, x_real_ip:&str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool>> = Mutex::new(HashMap::new());
}

fn register_plugin(name: &str, function: fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool) {
  FILTERS_METHODS
    .lock()
    .unwrap()
    .insert(String::from(name), function);
}

fn get_plugin(name: &str) -> fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool {
  return FILTERS_METHODS
    .lock()
    .unwrap()
    .get(name)
    .unwrap()
    .clone();
}

fn filter_v8(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool {
  // return get_plugin("filter")(x_real_ip, user_agent, raw_headers);

  let mut meta = HashMap::<String, String>::new();

  meta.insert("x_real_ip".to_string(), x_real_ip.to_string());
  meta.insert("user_agent".to_string(), user_agent.to_string());

  for value in raw_headers.iter() {
    meta.insert("header-".to_string() + value.name.as_str(), value.value.into_owned());
  }

  if let Some(record) = asn_record {
    meta.insert("asn_country".to_string(), record.country.to_string());
    meta.insert("asn_owner".to_string(), record.owner.to_string());
    meta.insert("asn_as_number".to_string(), record.as_number.to_string());
    meta.insert("asn_ip".to_string(), record.ip.to_string());
  }

  meta.insert("operator".to_string(), operator.to_string());
  meta.insert("filter_value".to_string(), filter_value.to_string());
  meta.insert("this".to_string(), this.to_string());

  let output = p_kit::call_plugin(this, meta).parse::<bool>().unwrap_or(false);

  return output;
}

pub fn register_default_filter_plugins() {
  register_plugin(
    "asn::groups",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      if asn_record.is_none() {
        return false;
      }

      if operator != "in" {
        return false;
      }

      let record = asn_record.unwrap();
      let owner = record.owner.to_lowercase();
      let constains = filter_value.to_lowercase();
      let constains = constains.split(",").collect::<Vec<&str>>();

      let asn_raw = include_str!("../containers/asn_owners_group.json");
      let asn_owners_groups: HashMap<&str, Vec<&str>> = serde_json::from_str(asn_raw).unwrap();
      
      for value in constains {
        let default_value = Vec::new();
        let known_asn = &asn_owners_groups.get(&value).unwrap_or(&default_value);

        for asn in known_asn.iter() {
          if owner.to_lowercase().contains(&asn.to_lowercase()) {
            return true;
          }
        }
      }

      return false;
    }
  );

  register_plugin(
    "ua",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => user_agent == filter_value,
        "!=" => user_agent != filter_value,
        ">" => user_agent > filter_value,
        ">=" => user_agent >= filter_value,
        "<" => user_agent < filter_value,
        "<=" => user_agent <= filter_value,
        "~" => user_agent.contains(filter_value),

        _ => false
      };
    }
  );

  register_plugin(
    "asn::owner",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => {
          match asn_record {
            Some(record) => record.owner.to_lowercase() == filter_value.to_lowercase(),
            None => false
          }
        }

        "!=" => {
          match asn_record {
            Some(record) => record.owner.to_lowercase() != filter_value.to_lowercase(),
            None => false
          }
        }

        "~" => {
          match asn_record {
            Some(record) => record.owner.to_lowercase().contains(&filter_value.to_lowercase()),
            None => false
          }
        }
 
        _ => false
      };
    }
  );

  register_plugin(
    "asn::country_code",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let cuntry_code = asn_record.unwrap().country.clone().to_uppercase();

      return match operator {
        "==" => cuntry_code == filter_value,
        "!=" => cuntry_code != filter_value,
        "~" => cuntry_code.contains(filter_value),
        "in" => filter_value.split(",").collect::<Vec<&str>>().contains(&cuntry_code.as_str()),

        _ => false
      };
    }
  );

  register_plugin(
    "ip::country_code",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let cuntry_code = if raw_headers.get_one("cf-ipcountry").is_some() && CONFIG["use_cloudflare_data_priority"].as_bool().unwrap() {
        Some(raw_headers.get_one("cf-ipcountry").unwrap().to_string().to_uppercase())
      } else { 
        Some(asn_record.unwrap().country.clone().to_uppercase())
      };

      return match operator {
        "==" => cuntry_code.unwrap() == filter_value,
        "!=" => cuntry_code.unwrap() != filter_value,
        "~" => cuntry_code.unwrap().contains(filter_value),
        "in" => filter_value.split(",").collect::<Vec<&str>>().contains(&cuntry_code.unwrap().as_str()),

        _ => false
      };
    }
  );

  register_plugin(
    "referrer",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => raw_headers.get_one("referer").unwrap_or("") == filter_value,
        "!=" => raw_headers.get_one("referer").unwrap_or("") != filter_value,
        "~" => raw_headers.get_one("referer").unwrap_or("").to_string().contains(filter_value),

        _ => false
      };
    }
  );

  register_plugin(
    "session_id",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let cookies = raw_headers.get_one("cookie").unwrap_or("").to_string();

      if cookies.is_empty() {
        return false;
      }

      let cookies = cookies.split(";").collect::<Vec<&str>>();
      let cookies_as_map = cookies.iter().map(|x| x.split("=").collect::<Vec<&str>>()).collect::<Vec<Vec<&str>>>();

      let php_sessid = cookies_as_map
        .iter()
        .find(|x| x[0] == "PHPSESSID");

      if php_sessid.is_none() {
        return false;
      }

      return match operator {
        "==" => php_sessid.unwrap()[1] == filter_value,
        "!=" => php_sessid.unwrap()[1] != filter_value,
        "~" => php_sessid.unwrap()[1].to_string().contains(filter_value),
        "in" => filter_value.split(",").collect::<Vec<&str>>().contains(&php_sessid.unwrap()[1]),

        _ => false
      };
    }
  );

  register_plugin(
    "ip",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let real_ip = x_real_ip.parse::<IpAddr>();

      if real_ip.is_err() {
        return false;
      }

      return match operator {
          "==" => real_ip.unwrap() == filter_value.parse::<IpAddr>().unwrap(),
          "!=" => real_ip.unwrap() != filter_value.parse::<IpAddr>().unwrap(),
          ">" => real_ip.unwrap() > filter_value.parse::<IpAddr>().unwrap(),
          ">=" => real_ip.unwrap() >= filter_value.parse::<IpAddr>().unwrap(),
          "<" => real_ip.unwrap() < filter_value.parse::<IpAddr>().unwrap(),
          "<=" => real_ip.unwrap() <= filter_value.parse::<IpAddr>().unwrap(),
          "~" => real_ip.unwrap().to_string().contains(filter_value),

          _ => false
      }
    }
  );

  register_plugin(
    "ua::bot", 
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => {
          return BOT_DETECTOR.is_bot(user_agent);
        }

        "!=" => {
          return !BOT_DETECTOR.is_bot(user_agent);
        }

        _ => false
      } 
    }
  );

  register_plugin(
    "cookie::string",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {

      return match operator {
        "==" => {
          return raw_headers
            .get_one("cookie")
            .unwrap_or("") == filter_value;
        }

        "!=" => {
          return raw_headers
            .get_one("cookie")
            .unwrap_or("") != filter_value;
        }

        "~" => {  
          return raw_headers
            .get_one("cookie")
            .unwrap_or("")
            .contains(filter_value);
        }

        _ => false
      }
    }
  );

  register_plugin(
    "random",
    |this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  rand::random::<bool>()
  );

  register_plugin(
    "ua::os::family",
    |this: &str, x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, _operator: &str| {
      if user_agent.is_empty() {
        return false;
      }
      
      let ua_parser = UserAgentParser::from_bytes(include_bytes!("../containers/user_agent_parser.bin")).expect("Parser creation failed");
      let client: uaparser::Client = ua_parser.parse(&user_agent);

      client.os.family == filter_value
    }
  );

  for plugin in get_all_runtime_plugins() {
    if &plugin.attach_at == "plugin_filter" && &plugin.engine == "v8" {
      register_plugin(
        &plugin.name, 
        filter_v8
      )
    }
  }
}

fn async_register_request_info(
  asn_record: Option<&Record>,
  raw_headers: HeaderMap,
  user_agent: String,
  query: HashMap<String, String>,
  route_way: Option<Vec<asn_record::RouteWay>>
) {
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
          route_way: route_way
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

        ELASTIC
          .lock()
          .unwrap()
          .index(IndexParts::IndexId("requests", &request_id))
          .body(insert_json_raw.to_owned())
          .send()
          .await
          .unwrap();
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
          route_way: route_way
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

        ELASTIC
          .lock()
          .unwrap()
          .index(IndexParts::IndexId("requests", &request_id))
          .body(insert_json_raw.to_owned())
          .send()
          .await
          .unwrap();
      })
    });
  } 
}

fn create_meta_dataset_for_template(
  client_ip: &str,
  domain: Option<&str>,
  user_agent: &str,
  raw_headers: HeaderMap
) -> HashMap<String, String> {
  let mut meta = HashMap::new();

  meta.insert("ip".to_string(), client_ip.to_string());
  meta.insert("client-ip".to_string(), client_ip.to_string());

  meta.insert("user-agent".to_string(), user_agent.to_string());
  meta.insert("utc-time".to_string(), Utc::now().to_string());

  meta.insert("nanoid".to_string(), nanoid!(16));

  meta.insert("domain".to_string(), domain.unwrap_or("localhost").to_string());
  
  for h in raw_headers.iter() {
    meta.insert("http-header-".to_string() + h.name().to_string().to_lowercase().as_str(), h.value().to_string());
  }

  return meta;
}

#[get("/<router..>?<query..>")]
pub async fn router(
  x_real_ip: XRealIp<'_>,
  user_agent: UserAgent<'_>,
  router: PathBuf,
  raw_headers: HeadersMap<'_>,
  query: HashMap<String, String>,
) -> (Status, (ContentType, String)) {
  let path = if router == PathBuf::new() {
    Path::new("/").join("index")
  } else {
    Path::new("/").join(router)
  };

  let path_as_string = path
    .into_os_string()
    .into_string()
    .expect("Unable to convert path to string");

  let domain = raw_headers.0.get_one("host");
 
  let collection: Collection<Route> =
    get_database(String::from("routes")).collection("routes");

  let find_result = collection
    .find_one(
      doc! {
        "path": &path_as_string,
        // "domain": domain
      },
      FindOneOptions::builder().build(),
    )
    .expect("Unable to find result")
    .or(None);

  if find_result.is_none() {
    return not_found();
  }

  let result_route = find_result.unwrap();

  if result_route.filter_id.is_none() {
    return not_found();
  }

  let collection: Collection<filter::Filter> =
    get_database(String::from("filters")).collection("filters");

  let filter = collection
    .find_one(
      doc! {
        "filter_id": result_route.filter_id.clone().unwrap()
      },
      None,
    )
    .expect("Unable to find filter")
    .expect("Filter not found");

  // memory-leak?
  let asn_database = DATABASE.to_owned();
  let asn_record = asn_database.lookup(x_real_ip.0.parse().unwrap_or("0.0.0.0".parse().unwrap())).to_owned();

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

    let plugin = get_plugin(&condition.plugin);

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
      let meta = create_meta_dataset_for_template(
        &x_real_ip.0.to_owned(),
        domain,
        &user_agent.0.to_owned(),
        raw_headers.0.to_owned()
      );

      let closure = rdr_kit::render_resource_for_http(resource, meta);
      let out = closure.await;
     
      filter_break = Some(out);

      break 'filter;
    }
  }

  route_way
    .push(asn_record::RouteWay {
      name: "default".to_string(),
      use_this_way: filter_break.is_none()
    });
  
  async_register_request_info(
    asn_record,
    raw_headers.0.to_owned(),
    user_agent.0.to_owned(),
    query,
    Some(route_way)
  );

  if filter_break.is_some() {
    return filter_break.unwrap();
  }

  if !result_route.resource_id.is_none() {
    let meta = create_meta_dataset_for_template(
      &x_real_ip.0.to_owned(),
      domain,
      &user_agent.0.to_owned(),
      raw_headers.0.to_owned()
    );

    let resource = resource_kit::require_resource(result_route.resource_id.unwrap().as_str());
    
    return rdr_kit::render_resource_for_http(resource, meta).await;
  }

  return not_found()
}
