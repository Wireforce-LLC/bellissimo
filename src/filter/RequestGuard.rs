use asn_db::Record;
use rocket::http::HeaderMap;
use crate::{config::CONFIG, filter_kit, guard_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "request_guard",
        |_this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, _filter_value: &str, operator: &str| {
          if asn_record.is_none() {
            return false;
          }
    
          let score: guard_kit::GuardScore = guard_kit::rate_traffic(
            guard_kit::TrafficRequest {
              asn_record: asn_record.unwrap().to_owned(),
              headers: raw_headers,
              user_agent: user_agent.to_string(),
              ip: x_real_ip.to_string(),
              request_id: None,
              resource_id: None
            }
          );
          
          return match operator {
            "==" => score.score > CONFIG["score_kit_value"].as_integer().unwrap_or(65) as i8,
            "!=" => score.score <= CONFIG["score_kit_value"].as_integer().unwrap_or(65) as i8,
    
            _ => false
          }
        }
    );
}