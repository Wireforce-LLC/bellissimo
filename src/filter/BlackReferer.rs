use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "bad_referer",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, _filter_value: &str, operator: &str| {
            let black_ref = include_str!("../../containers/black_referer.txt");

            if let Some(referer) = raw_headers.get_one("referer") {
                return match operator {
                    "==" => black_ref.to_lowercase().contains(&referer.to_lowercase()),
                    "!=" =>!black_ref.to_lowercase().contains(&referer.to_lowercase()),
                    
                    _ => false,
                }
            }

            return false
        }
    );
}