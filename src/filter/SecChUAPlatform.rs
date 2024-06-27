use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "sec::ch-ua-platform",
        |_this: &str, _x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
          let sec_header = raw_headers.get_one("sec-ch-ua-platform");
    
          if sec_header.is_none() {
            return false;
          }  
    
          return match operator {
            "==" => sec_header.unwrap().to_lowercase() == filter_value.to_lowercase(),
            "!=" => sec_header.unwrap().to_lowercase() != filter_value.to_lowercase(),
            "in" => sec_header.unwrap().to_lowercase().contains(filter_value.to_lowercase().as_str()),
            "~" => sec_header.unwrap().to_lowercase().contains(filter_value.to_lowercase().as_str()),
            
            _ => false
          }
        }
    );    
}