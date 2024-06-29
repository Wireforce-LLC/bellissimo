use asn_db::Record;
use rand::Rng;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "random",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
            let mut rng = rand::thread_rng();
            let val = rng.gen_range(0..100);

            return val > filter_value.parse::<i32>().unwrap_or(50)
        }
    );
}