use asn_db::Record;
use rocket::http::HeaderMap;
use crate::filter_kit;

pub fn register_filter() {
    filter_kit::register_filter(
        "request::query_bind",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
            let query = raw_headers.get_one("request-uri").unwrap_or("");

            if query.is_empty() || !query.contains("?") {
                return if operator == "==" { 
                  false
                } else {
                  true
                };
            }

            let query = query.split("?").collect::<Vec<&str>>();
            let query = query.last().unwrap().to_owned().to_lowercase();

            let contains = query.contains(format!("&{}=", filter_value.to_lowercase().as_str()).as_str()) || query.starts_with(format!("{}=", filter_value).as_str());

            return match operator {
                "==" =>  contains,
                "!=" => !contains,
                "~" => query.contains(filter_value.to_lowercase().as_str()),

                _ => false
            }
        }
    );
}