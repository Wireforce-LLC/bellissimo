use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::filter_kit;

pub fn register_filter() {
    filter_kit::register_filter(
        "asn::owner",
        |
            _this: &str,
            _x_real_ip: &str,
            _user_agent: &str,
            _raw_headers: HeaderMap,
            asn_record: Option<&Record>,
            filter_value: &str,
            operator: &str
        | {
            return match operator {
                "==" => {
                    match asn_record {
                        Some(record) => record.owner.to_lowercase() == filter_value.to_lowercase(),
                        None => false,
                    }
                }

                "!=" => {
                    match asn_record {
                        Some(record) => record.owner.to_lowercase() != filter_value.to_lowercase(),
                        None => false,
                    }
                }

                "~" => {
                    match asn_record {
                        Some(record) =>
                            record.owner.to_lowercase().contains(&filter_value.to_lowercase()),
                        None => false,
                    }
                }

                _ => false,
            };
        }
    );
}
