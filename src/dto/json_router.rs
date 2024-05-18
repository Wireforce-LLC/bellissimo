use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct json_router <T: Serialize> {
    pub value: T
}