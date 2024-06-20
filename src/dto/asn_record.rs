use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RouteWay {
    pub name: String,
    pub use_this_way: bool,
}


#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AsnRecord {
    pub request_id: String,
    pub time: i64,
    pub asn_name: Option<String>,
    pub asn_number: Option<u32>,
    pub asn_description: Option<String>,
    pub asn_country_code: Option<String>,
    pub is_ua_bot: Option<bool>,
    pub headers: Option<HashMap<String, String>>,
    pub query: Option<HashMap<String, String>>,
    pub route_way: Option<Vec<RouteWay>>,
}