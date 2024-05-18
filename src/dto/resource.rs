use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Resource {
    pub resource_id: String,
    pub driver: String,
    pub raw_content: Option<String>,
    pub file_path: Option<String>,
}