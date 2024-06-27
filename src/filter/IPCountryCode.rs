use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "ip::country_code",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
          let cuntry_code = if raw_headers.get_one("cf-ipcountry").is_some() && CONFIG["use_cloudflare_data_priority"].as_bool().unwrap() {
            Some(raw_headers.get_one("cf-ipcountry").unwrap().to_string().to_uppercase())
          } else { 
            Some(asn_record.unwrap().country.clone().to_uppercase())
          };
    
          return match operator {
            "==" => cuntry_code.unwrap().to_uppercase() == filter_value.to_uppercase(),
            "!=" => cuntry_code.unwrap().to_uppercase() != filter_value.to_uppercase(),
            "~" => cuntry_code.unwrap().to_uppercase().contains(&filter_value.to_uppercase()),
            "in" => filter_value.to_uppercase().split(",").collect::<Vec<&str>>().contains(&cuntry_code.unwrap().to_uppercase().as_str()),
    
            _ => false
          };
        }
      );
}