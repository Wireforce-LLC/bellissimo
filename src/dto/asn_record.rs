use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct AsnRecord {
    pub request_id: String,
    pub time: i64,
    pub asn_name: Option<String>,
    pub asn_number: Option<u32>,
    pub asn_description: Option<String>,
    pub asn_country_code: Option<String>,
    pub is_ua_bot: Option<bool>,
    pub headers: Option<HashMap<String, String>>,
}