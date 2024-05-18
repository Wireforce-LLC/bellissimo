use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Route {
    pub name: String,
    pub path: String,
    pub params: Option<HashMap<String, String>>,
    pub filter_id: Option<String>,
    pub resource_id: Option<String>,
}