
use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, dynamic_router::BOT_DETECTOR, filter_kit};

pub fn register_filter() {
  filter_kit::register_filter(
    "ua::bot", 
    |_this: &str, _x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, _filter_value: &str, operator: &str|  {
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
}