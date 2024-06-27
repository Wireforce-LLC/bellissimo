use asn_db::Record;
use rocket::http::HeaderMap;
use std::{collections::HashMap, net::IpAddr};
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "ip",
        |_this: &str, x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
          let real_ip = x_real_ip.parse::<IpAddr>();
    
          if real_ip.is_err() {
            return false;
          }
    
          return match operator {
              "==" => real_ip.unwrap() == filter_value.parse::<IpAddr>().unwrap(),
              "!=" => real_ip.unwrap() != filter_value.parse::<IpAddr>().unwrap(),
              ">" => real_ip.unwrap() > filter_value.parse::<IpAddr>().unwrap(),
              ">=" => real_ip.unwrap() >= filter_value.parse::<IpAddr>().unwrap(),
              "<" => real_ip.unwrap() < filter_value.parse::<IpAddr>().unwrap(),
              "<=" => real_ip.unwrap() <= filter_value.parse::<IpAddr>().unwrap(),
              "~" => real_ip.unwrap().to_string().contains(filter_value),
    
              _ => false
          }
        }
    );    
}