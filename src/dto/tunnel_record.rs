use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct TunnelRequest {
    pub resource_id: String,
    pub url: String,
}