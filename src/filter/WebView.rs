use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::{config::CONFIG, filter_kit};

pub fn register_filter() {
    filter_kit::register_filter(
        "is_webview",
        |_this: &str, _x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, _filter_value: &str, _operator: &str| {
            let sec_ua = raw_headers.get_one("sec-ch-ua");

            if sec_ua.is_some() {
                let sec_ua = sec_ua.unwrap();
                let sec_ua = sec_ua.to_lowercase();

                if sec_ua.contains("webview") {
                    return true;
                }
            }

            if user_agent.contains("webview") {
                return true;
            }

            // ios Facebook Application
            if user_agent.to_uppercase().contains("FBAN") || user_agent.to_uppercase().contains("FBDV") || user_agent.to_uppercase().contains("FBAV") {
                return true;
            }

            if user_agent.contains("wv") {
                return true;
            }

            return false;
        }
    );
}