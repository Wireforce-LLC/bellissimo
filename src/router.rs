#[path = "dto/asn_record.rs"] mod asn_record;
#[path = "dto/filter.rs"] mod filter;
#[path = "dto/route.rs"] mod route;

use asn_db::Db;
use chrono::prelude::*;
use isbot::Bots;
use mongodb::bson::doc;
use mongodb::options::FindOneOptions;
use mongodb::sync::Collection;
use nanoid::nanoid;
use redis::{Client, Connection};
use rocket::http::hyper::header;
use rocket::http::{ContentType, HeaderMap, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::env;

use crate::config::CONFIG;
use crate::{config, rdr_kit, resource_kit, database::get_database};

pub struct XRealIp<'r>(&'r str);
pub struct UserAgent<'r>(&'r str);
pub struct HeadersMap<'r>(&'r HeaderMap<'r>);

// Implement the `FromRequest` trait for `XRealIp`
#[derive(Debug)]
pub enum ImplementationError {}

// Implement the `FromRequest` trait for `XRealIp`
#[rocket::async_trait]
impl<'r> FromRequest<'r> for XRealIp<'r> {
    type Error = ImplementationError;

    // Extract the IP address from the `X-Real-IP` header
    // or `X-Forwarded-For` header
    // or the `CF-Connecting-IP` header
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, ImplementationError> {
        let ip_header = req
            .headers()
            .get_one("cf-connecting-ip")
            .or_else(|| req.headers().get_one("x-forwarded-for"));

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
  pub static ref REDIS_CLIENT: Mutex<Client> = Mutex::new(
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
}

#[get("/<router..>")]
pub async fn router(
  x_real_ip: XRealIp<'_>,
  user_agent: UserAgent<'_>,
  router: PathBuf,
  raw_headers: HeadersMap<'_>,
) -> (Status, (ContentType, String)) {
  let bots = Bots::default();

  let path = Path::new("/").join(router);
  let path_as_string = path
    .into_os_string()
    .into_string()
    .expect("Unable to convert path to string");

  let collection: Collection<route::Route> =
    get_database(String::from("routes")).collection("routes");

  let find_result = collection
    .find_one(
      doc! {
        "path": &path_as_string
      },
      FindOneOptions::builder().build(),
    )
    .expect("Unable to find result")
    .or(None);

  if find_result.is_none() {
    return (
      Status::NotFound,
      (
        ContentType::Plain,
        config::CONFIG["not_found_message"].to_string(),
      ),
    );
  }

  let result_route = find_result.unwrap();

  if result_route.filter_id.is_none() {
    if CONFIG["is_allow_debug_throw"].as_bool().unwrap() {
      return (
        Status::InternalServerError,
        (
          ContentType::HTML,
          include_str!("../containers/content_error.html").to_string(),
        ),
      ); 
    } else {
      return (
        Status::NoContent,
        (
          ContentType::Plain,
          String::new()
        ),
      ); 
    }
  }

  let collection: Collection<filter::Filter> =
    get_database(String::from("filters")).collection("filters");

  let filter = collection
    .find_one(
      doc! {
        "filter_id": result_route.filter_id.clone().unwrap()
      },
      FindOneOptions::builder().build(),
    )
    .expect("Unable to find filter")
    .expect("Filter not found");

  let mut meta = HashMap::new();

  meta.insert("ip".to_string(), x_real_ip.0.to_string());
  meta.insert("user-agent".to_string(), user_agent.0.to_string());
  meta.insert("utc-time".to_string(), Utc::now().to_string());
  
  for h in raw_headers.0.clone().iter() {
    meta.insert("http-header-".to_string() + h.name().to_string().to_lowercase().as_str(), h.value().to_string());
  }

  let request_id = nanoid!();
  let asn_record = DATABASE
    .as_ref()
    .lookup(x_real_ip.0.parse().unwrap_or("0.0.0.0".parse().unwrap()));

  // Redirect::temporary(raw_data);

  let now = Utc::now();

  let collection: Collection<asn_record::AsnRecord> =
      get_database(String::from("requests")).collection("asn_records");

  let mut headers: HashMap<String, String> = HashMap::new();

  for raw_header in raw_headers.0.iter() {
    headers.insert(
      raw_header.name().to_string(),
      raw_header.value().to_string(),
    );
  }

  if let Some(result_record) = asn_record {
      collection
          .insert_one(
              asn_record::AsnRecord {
                  asn_name: Some(result_record.owner.clone()),
                  asn_country_code: Some(result_record.country.clone()),
                  asn_description: Some(String::new()),
                  request_id: request_id,
                  time: now.timestamp_micros(),
                  asn_number: Some(u32::from(result_record.as_number)),
                  is_ua_bot: Some(BOT_DETECTOR.is_bot(user_agent.0)),
                  headers: Some(headers),
              },
              None,
          )
          .unwrap();
  } else {
      collection
          .insert_one(
              asn_record::AsnRecord {
                  asn_name: None,
                  asn_country_code: None,
                  asn_description: None,
                  request_id: request_id,
                  time: now.timestamp_micros(),
                  asn_number: None,
                  is_ua_bot: Some(BOT_DETECTOR.is_bot(user_agent.0)),
                  headers: Some(headers),
              },
              None,
          )
          .unwrap();
  }

  for condition in filter.conditions {
      let resource = resource_kit::require_resource(
          condition
              .resource_id
              .expect("Unable to get resource")
              .as_str(),
      );

      // ip plugin
      if condition.plugin == "ip" {
          if condition.value == x_real_ip.0 {
              return rdr_kit::render_resource_for_http(resource, meta).await;
          }
      }

      // asn plugin
      if condition.plugin == "asn" || condition.plugin == "asn::owner" {
          if !asn_record.is_none() {
              let result_record = asn_record.expect("Unable to get asn record").clone();

              if condition.value.to_lowercase() == result_record.owner.to_lowercase() {
                  return rdr_kit::render_resource_for_http(resource, meta).await;
              }
          }
      }

      // user-agent plugin
      if condition.plugin == "user_agent" {
          if condition.value.to_lowercase() == user_agent.0.to_lowercase() {
              return rdr_kit::render_resource_for_http(resource, meta).await;
          }
      }

      // bot plugin
      if condition.plugin == "bot" {
          if bots.is_bot(&user_agent.0) {
              return rdr_kit::render_resource_for_http(resource, meta).await;
          }
      }
  }

  if !result_route.resource_id.is_none() {
      let resource = resource_kit::require_resource(result_route.resource_id.unwrap().as_str());
      return rdr_kit::render_resource_for_http(resource, meta).await;
  }

  return (
      Status::NotFound,
      (
          ContentType::Plain,
          config::CONFIG["not_found_message"].to_string(),
      ),
  );
}
