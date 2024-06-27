use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "random",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, _filter_value: &str, _operator: &str|  rand::random::<bool>()
    );
}