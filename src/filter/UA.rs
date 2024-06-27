use crate::filter_kit;
use asn_db::Record;
use rocket::http::HeaderMap;

pub fn register_filter() {
    filter_kit::register_filter(
        "ua",
        |
            _this: &str,
            _x_real_ip: &str,
            user_agent: &str,
            _raw_headers: HeaderMap,
            _asn_record: Option<&Record>,
            filter_value: &str,
            operator: &str
        | {
            return match operator {
                "==" => user_agent == filter_value,
                "!=" => user_agent != filter_value,
                ">" => user_agent > filter_value,
                ">=" => user_agent >= filter_value,
                "<" => user_agent < filter_value,
                "<=" => user_agent <= filter_value,
                "~" => user_agent.contains(filter_value),

                _ => false,
            };
        }
    );
}
