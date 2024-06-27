use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{ config::CONFIG, filter_kit };

pub fn register_filter() {
    filter_kit::register_filter(
        "is_advertising_campaign",
        |
            _this: &str,
            _x_real_ip: &str,
            _user_agent: &str,
            raw_headers: HeaderMap,
            _asn_record: Option<&Record>,
            _filter_value: &str,
            _operator: &str
        | {
            let request_uri = raw_headers.get_one("request-uri");

            if request_uri.is_none() {
               return false;
            }

            let request_uri = request_uri.unwrap();

            return request_uri.contains("utm_term") && 
              request_uri.contains("utm_source") && 
              request_uri.contains("utm_medium") && 
              request_uri.contains("utm_content");
        }
    );
}
