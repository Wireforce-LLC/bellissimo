use asn_db::Record;
use redis::Commands;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, dynamic_router::REDIS, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "is_ddos",
        |_this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
          if x_real_ip.is_empty() {
            return false;
          }
    
          if x_real_ip == "127.0.0.1" {
            return false;
          }
    
          let mut conn = REDIS.lock().unwrap();
    
          let count_connections = conn.get("ddos:".to_owned() + x_real_ip).unwrap_or(0);
        
          let _: () = redis::pipe()
            .cmd("SETEX")
            .arg("ddos:".to_owned() + x_real_ip)
            .arg(60)
            .arg(count_connections + 1)
            .query(&mut conn)
            .expect("Unable to set redis result");
    
          if count_connections >= CONFIG["ddos_limit"].as_integer().unwrap_or(12) {
            return true;
          }
    
          return false;
        }
    );
}