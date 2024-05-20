#[path = "dto/route.rs"] mod route;
#[path = "dto/asn_record.rs"] mod asn_record;
#[path = "dto/resource.rs"] mod resource;
#[path = "dto/filter.rs"] mod filter;
#[path = "database.rs"] mod database;
#[path = "dto/json_router.rs"] mod json_router;

use isbot::Bots;
use mongodb::options::{FindOneOptions};
use nanoid::nanoid;
use redis::{Client, Commands, Connection, FromRedisValue};
use rocket::http::{ContentType, Header, Status};
use rocket::request::{FromRequest, Outcome};
use rocket::response::{self, Redirect, Responder};
use rocket::{Request};
use std::any::{self, Any};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time;
use mongodb::bson::doc;
use mongodb::sync::Collection;
use std::io::BufReader;
use std::fs::File;
use asn_db::{Db};
use chrono::prelude::*;

use self::database::get_database;
use self::resource::Resource;
use std::env;

lazy_static! {
  pub static ref REQUEST_CACHE_STORAGE: Arc<Mutex<(String, String)>> = Arc::new(Mutex::new((String::new(), String::new())));
  
  pub static ref DATABASE: Arc<Db> = Arc::new(
    Db::form_tsv(BufReader::new(File::open("ip2asn-v4.tsv").unwrap())).unwrap()
  );

  pub static ref REDIS_CLIENT: Mutex<Client> = Mutex::new(
    redis::Client::open(env::var("REDIS_URI").unwrap_or("redis://127.0.0.1/".to_string()))
      .expect("Unable to create redis client")
  );

  pub static ref REDIS: Mutex<Connection> = Mutex::new(
    redis::Client::open(env::var("REDIS_URI").unwrap_or("redis://127.0.0.1/".to_string()))
      .expect("Unable to create redis client")
      .get_connection()
      .expect("Unable to get redis connection")
  );
}

struct XRealIp<'r>(&'r str);
struct UserAgent<'r>(&'r str);

/**
 * X-Real-IP header error 
 */
#[derive(Debug)]
enum XRealError {}

/**
 * User agent error
 */
#[derive(Debug)]
enum UserAgentError {}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for XRealIp<'r> {
  type Error = XRealError;

  async fn from_request(req: &'r Request<'_>) -> Outcome<Self, XRealError> {
    fn is_valid(_key: &str) -> bool {true}

    match req.headers().get_one("x-real-ip") {
      None => Outcome::Success(XRealIp("")),
      Some(key) if is_valid(key) => Outcome::Success(XRealIp(key)),
      Some(_) => Outcome::Success(XRealIp("")),
    }
  }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for UserAgent<'r> {
  type Error = UserAgentError;

  async fn from_request(req: &'r Request<'_>) -> Outcome<Self, UserAgentError> {
    fn is_valid(_key: &str) -> bool {true}

    match req.headers().get_one("user-agent") {
      None => Outcome::Success(UserAgent("")),
      Some(key) if is_valid(key) => Outcome::Success(UserAgent(key)),
      Some(_) => Outcome::Success(UserAgent("")),
    }
  }
}

pub async fn get_website_content(url: &str) -> reqwest::Response {
  let res: reqwest::Response = reqwest::Client::new()
    .get(url)
    .header(
      "User-Agent", 
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
      // fake_useragent::UserAgents::new().random().to_string()
    )
    .header(
      "Referer", 
      "https://google.com"
    )
    .header(
      "Origin", 
      "https://google.com"
    )
    .send()
    .await
    .unwrap();

  return res;
}

/**
 * Get resource
 */
fn require_resource(resource_id: &str) -> Resource {
  let collection: Collection<resource::Resource> = get_database(String::from("resources"))
    .collection("resources");
  
  let resource = collection
    .find_one(
      doc! {
        "resource_id": resource_id
      },
      FindOneOptions::builder().build()
    )
    .expect("Unable to find resource")
    .expect("Resource not found");

  return resource;
}

/**
 * Get resource raw data
 */
fn require_resource_raw(res: &Resource) -> (char, Option<String>) {
  if res.raw_content.is_none() && res.file_path.is_none() {
    return ('b', None);
  }

  if !res.raw_content.is_none() && !res.file_path.is_none() {
    return ('a', None);
  }

  let raw_data = if !res.raw_content.is_none() {
    res.raw_content.clone().unwrap()
  } else {
    std::fs::read_to_string(res.file_path.clone().unwrap()).expect("Unable to read file")
  };

  return ('p', Option::from(raw_data));
}


fn check_conflict_in_resource_links(result_id: &char) -> Option<(Status, (ContentType, std::string::String))> {
  match result_id {
    'b' => return Option::from((
      Status::Conflict,
      (
        ContentType::Plain,
        "Both raw content and file path are set".to_string()
      )
    )),
    'a' => return Option::from((
      Status::Conflict,
      (
        ContentType::Plain,
        "Both raw content and file path are empty".to_string()
      )
    )),
    _ => return None
  }
}

async fn render_resource(
  resource: &Resource, 
  raw_data: &str
) -> (Status, (ContentType, String)) {
  match resource.driver.as_ref() {
    "redirect::meta" => {
      if !resource.file_path.is_none() {
        return (
          Status::InternalServerError,
          (
            ContentType::Plain,
            "File path is set but driver is set to redirect::meta".to_string()
          )
        );
      }

      let uri = resource.raw_content.clone().unwrap();

      return (
        Status::Ok,
        (
          ContentType::HTML,
          "
          <!DOCTYPE html>
          <html>
          <body>
            <meta http-equiv='refresh' content='2;URL=*'>
            <p>You are being redirected to <a href='*'>*</a>.</p>
          </body>
          </html>
          ".replace("*", &uri)
        )
      )
      
    }

    "redirect::javascript" => {
      if !resource.file_path.is_none() {
        return (
          Status::InternalServerError,
          (
            ContentType::Plain,
            "File path is set but driver is set to redirect::javascript".to_string()
          )
        );
      }

      let uri = resource.raw_content.clone().unwrap();

      return (
        Status::Ok,
        (
          ContentType::HTML,
          "
          <!DOCTYPE html>
          <html>
          <body>
            <p>You are being redirected to <a href='*'>*</a>.</p>
            <script>
              setTimeout(function (){
                window.location.replace('*');
              }, 1000)
            </script>
          </body>
          </html>
          ".replace("*", &uri)
        )
      )
      
    }

    "html_proxy" => {
      if !resource.file_path.is_none() {
        return (
          Status::InternalServerError,
          (
            ContentType::Plain,
            "File path is set but driver is set to proxy".to_string()
          )
        );
      }

      let key_path = resource.raw_content.clone().unwrap();
      let mut mem_cache = REQUEST_CACHE_STORAGE.as_ref().lock().unwrap();
      
      if false && key_path == mem_cache.0 {
        return (
          Status::Ok,
          (
            ContentType::HTML,
            mem_cache.1.to_string()
          )
        );
      }

      let result: Option<String> = REDIS
        .lock()
        .expect("Unable to lock redis")
        .get("proxy_cache/*".replace("*", &key_path))
        .expect("Unable to get redis result");

      if result.is_none() {
        return (
          Status::NoContent,
          (
            ContentType::HTML,
            String::new()
          )
        );
      }

      mem_cache.0 = key_path;
      mem_cache.1 = result.clone().expect("Unable to get redis result");

      return (
        Status::Ok,
        (
          ContentType::HTML,
          result.expect("Unable to render resource")
        )
      );
    }

    "json" => {      
      let json_raw_string = "{\"value\": *}".replace("*", raw_data);

      let _: serde::de::IgnoredAny = serde_json::from_str(json_raw_string.clone().as_str())
        .expect("Unable to deserialize json");

      return (
        Status::Ok,
        (
          ContentType::JSON,
          json_raw_string.clone().to_string()
        )
      );
    }

    "redirect" => {
      return (
        Status::TemporaryRedirect,
        (
          ContentType::Plain,
          raw_data.to_string()
        )
      );
    }

    _ => {
      return (
        Status::NoContent,
        (
          ContentType::Plain,
          "".to_string()
        )
      );
    }
  }
}

#[get("/<router..>")]
pub async fn router(
  x_real_ip: XRealIp<'_>,
  user_agent: UserAgent<'_>,  
  router: PathBuf
) -> (Status, (ContentType, String)) {  
  let bots = Bots::default();
  // let geoip = geoip2::Reader:

  let request_id = nanoid!();
  let asn_record = DATABASE
    .as_ref()
    .lookup(x_real_ip.0.parse().unwrap_or("0.0.0.0".parse().unwrap()));

  // Redirect::temporary(raw_data);

  if x_real_ip.0 != "" {
    if !asn_record.is_none() {
      let now = Utc::now();

      let collection: Collection<asn_record::AsnRecord> = get_database(String::from("requests"))
        .collection("asn_records");

      let result_record = asn_record.unwrap().clone();

      collection.insert_one(asn_record::AsnRecord {
        asn_name: String::from(result_record.owner),
        asn_country_code: String::from(result_record.country),
        asn_description: String::new(),
        request_id: request_id.clone(),
        time: now.timestamp_micros(),
        asn_number: u32::from(result_record.as_number)
      }, None)
        .unwrap();
    }
  }

  let path = Path::new("/").join(router);
  let path_as_string = path.into_os_string().into_string().expect("Unable to convert path to string");

  let collection: Collection<route::Route> = database::get_database(String::from("routes"))
    .collection("routes");

  let find_result = collection
    .find_one(doc! {
      "path": &path_as_string
    }, FindOneOptions::builder().build())
    .expect("Unable to find result")
    .or(None);

  if find_result.is_none() {
    return (
      Status::NotFound,
      (
        ContentType::Plain,
        "Not found".to_string()
      )
    );
  }

  let result_route = find_result.unwrap();

  // if result_route.resource_id.is_none() {
  //   return (
  //     Status::NoContent,
  //     (
  //       ContentType::Plain,
  //       "".to_string()
  //     )
  //   );
  // }

  if result_route.filter_id.is_none() {
    return (
      Status::NoContent,
      (
        ContentType::Plain,
        "".to_string()
      )
    );
  }

  let collection: Collection<filter::Filter> = get_database(String::from("filters")).collection("filters");
  let filter = collection
    .find_one(
      doc! {
        "filter_id": result_route.filter_id.clone().unwrap()
      },
      FindOneOptions::builder().build()
    )
    .expect("Unable to find filter")
    .expect("Filter not found");

  for condition in filter.conditions {
    let resource = require_resource(condition.resource_id.unwrap().as_str());
    let (result_id, resource_raw) = require_resource_raw(&resource);
    let check_conflict = check_conflict_in_resource_links(&result_id);
    let raw_data_for_render = resource_raw.as_ref().unwrap().as_str();

    if !check_conflict.is_none() {
      return check_conflict.clone().unwrap();
    }
    
    // ip plugin
    if condition.plugin == "ip" {
      if condition.value == x_real_ip.0 {
        return render_resource(&resource, raw_data_for_render).await;
      }
    }

    // asn plugin
    if condition.plugin == "asn" || condition.plugin == "asn::owner" {
      if !asn_record.is_none() {
        let result_record = asn_record
          .expect("Unable to get asn record")
          .clone();

        if condition.value.to_lowercase() == result_record.owner.to_lowercase() {
          return render_resource(&resource, raw_data_for_render).await;
        }
      }
    }
  
    // user-agent plugin
    if condition.plugin == "user_agent" {
      if condition.value.to_lowercase() == user_agent.0.to_lowercase() {
        return render_resource(&resource, raw_data_for_render).await;
      }
    }

    // bot plugin
    if condition.plugin == "bot" {
      if bots.is_bot(&user_agent.0) {
        return render_resource(&resource, raw_data_for_render).await;
      }
    }
  }

  if !result_route.resource_id.is_none() {
    let resource = require_resource(result_route.resource_id.unwrap().as_str());
    let (result_id, resource_raw) = require_resource_raw(&resource);
    let _ = check_conflict_in_resource_links(&result_id);
    let raw_data_for_render = resource_raw.as_ref().unwrap().as_str();

    return render_resource(&resource, raw_data_for_render).await;
  }

  return (
    Status::NotFound,
    (
      ContentType::Plain,
      "Not Found".to_string()
    )
  );
}  