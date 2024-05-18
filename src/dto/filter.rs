use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Condition {
    pub name: String,
    pub value: String,
    pub operator: String,
    pub plugin: String,
    pub resource_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Filter {
    pub name: String,
    pub filter_id: String,
    pub conditions: Vec<Condition>,
}