use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "traffic::tor",
        |_this: &str, _x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
          let ip = raw_headers.get_one("cf-ipcountry");
    
          if ip.is_none() {
            return false;
          }
    
          return match operator {
            "==" => ip.unwrap().to_lowercase() == "t1",
            "!=" => ip.unwrap().to_lowercase() != "t1",
    
            _ => false
          }
        }
    );
}