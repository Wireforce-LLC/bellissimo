use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit, ipsum_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "traffic::ipsum",
        |_this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
          let is_ipsum = ipsum_kit::search_ip_in_ipsum_registries(x_real_ip, true);
    
          if is_ipsum.is_none() {
            return false;
          }
    
          return match operator {
            "==" => true,
    
            _ => false
          }
        }
    );

    filter_kit::register_filter(
        "traffic::ipsum_full",
        |_this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
          let is_ipsum = ipsum_kit::search_ip_in_ipsum_registries(x_real_ip, false);
    
          if is_ipsum.is_none() {
            return false;
          }
    
          return match operator {
            "==" => true,
    
            _ => false
          }
        }
    );
}