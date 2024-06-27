use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};
use uaparser::{Parser, UserAgentParser};

pub fn register_filter() {
  filter_kit::register_filter(
    "ua::device::brand",
    |_this: &str, _x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
      if user_agent.is_empty() {
        return false;
      }
      
      let ua_parser = UserAgentParser::from_bytes(include_bytes!("../../containers/user_agent_parser.bin")).expect("Parser creation failed");
      let client: uaparser::Client = ua_parser.parse(&user_agent); 
      let brand = client.device.brand;

      if brand.is_none() {
        return false;
      }

      let brand = brand.unwrap().to_lowercase();
      
      return match operator {
        "==" => {
          return brand == filter_value.to_lowercase()
        }

        "!=" => {
          return brand != filter_value.to_lowercase()
        }

        "~" => {
          return brand.contains(filter_value.to_lowercase().as_str())
        }

        _ => false
      }
    }
  );
}