use crate::{config::CONFIG, plugin};

use std::{collections::HashMap, sync::Mutex};
use asn_db::Record;
use rocket::http::HeaderMap;

lazy_static! {
  // Filter methods
  pub static ref FILTERS_METHODS: Mutex<HashMap<String, fn(this: &str, x_real_ip:&str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool>> = Mutex::new(HashMap::new());
}

pub fn register_filter(name: &str, function: fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool) {
  FILTERS_METHODS
    .lock()
    .unwrap()
    .insert(String::from(name), function);
}

pub fn is_filter(name: &str) -> bool {
  return FILTERS_METHODS
    .lock()
    .unwrap()
    .contains_key(name);
}

pub fn get_all_filters() -> HashMap<String, fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool> {
  return FILTERS_METHODS
    .lock()
    .unwrap()
    .clone();
}

pub fn get_filter(name: &str) -> fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool {
  return FILTERS_METHODS
    .lock()
    .unwrap()
    .get(name)
    .unwrap()
    .clone();
}

pub fn ext_filter_v8(
  this: &str,
  x_real_ip: &str, 
  user_agent: &str, 
  raw_headers: HeaderMap,
  asn_record: Option<&Record>, 
  filter_value: &str, 
  operator: &str
) -> bool {
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

  meta.insert("public".to_string(), CONFIG["http_server_serve_uri_path"].as_str().unwrap().to_string());
  meta.insert("static".to_string(), CONFIG["http_server_serve_uri_path"].as_str().unwrap().to_string());

  let output = plugin::call_plugin(this, meta).parse::<bool>().unwrap_or(false);

  return output;
}
