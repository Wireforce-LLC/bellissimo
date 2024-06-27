use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "session_id",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
          let cookies = raw_headers.get_one("cookie").unwrap_or("").to_string();
    
          if cookies.is_empty() {
            return false;
          }
    
          let cookies = cookies.split(";").collect::<Vec<&str>>();
          let cookies_as_map = cookies.iter().map(|x| x.split("=").collect::<Vec<&str>>()).collect::<Vec<Vec<&str>>>();
    
          let php_sessid = cookies_as_map
            .iter()
            .find(|x| x[0] == "PHPSESSID");
    
          if php_sessid.is_none() {
            return false;
          }
    
          return match operator {
            "==" => php_sessid.unwrap()[1] == filter_value,
            "!=" => php_sessid.unwrap()[1] != filter_value,
            "~" => php_sessid.unwrap()[1].to_string().contains(filter_value),
            "in" => filter_value.split(",").collect::<Vec<&str>>().contains(&php_sessid.unwrap()[1]),
    
            _ => false
          };
        }
    );
}