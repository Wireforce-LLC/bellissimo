use asn_db::Record;
use rocket::http::HeaderMap;
use uaparser::{Parser, UserAgentParser};
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "ua::device::family",
        |_this: &str, _x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
          if user_agent.is_empty() {
            return false;
          }
          
          let ua_parser = UserAgentParser::from_bytes(include_bytes!("../../containers/user_agent_parser.bin")).expect("Parser creation failed");
          let client: uaparser::Client = ua_parser.parse(&user_agent);
    
          return match operator {
            "==" => {
              return client.device.family.to_lowercase() == filter_value.to_lowercase()
            }
    
            "!=" => {
              return client.device.family.to_lowercase() != filter_value.to_lowercase()
            }
    
            "~" => {
              return client.device.family.to_lowercase().contains(filter_value.to_lowercase().as_str())
            }
    
            _ => false
          }
        }
    );
}