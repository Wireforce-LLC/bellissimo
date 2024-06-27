use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "referrer",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
          return match operator {
            "==" => raw_headers.get_one("referer").unwrap_or("") == filter_value,
            "!=" => raw_headers.get_one("referer").unwrap_or("") != filter_value,
            "~" => raw_headers.get_one("referer").unwrap_or("").to_string().contains(filter_value),
    
            _ => false
          };
        }
    );    
}