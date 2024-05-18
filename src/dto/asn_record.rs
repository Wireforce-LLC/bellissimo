use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct AsnRecord {
    pub request_id: String,
    pub time: i64,
    pub asn_name: String,
    pub asn_number: u32,
    pub asn_description: String,
    pub asn_country_code: String
}