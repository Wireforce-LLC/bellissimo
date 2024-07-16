use serde::{Deserialize, Serialize};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Click {
    pub time: i64,
    pub ip: String,
    pub cursor_x: Option<i64>,
    pub cursor_y: Option<i64>,
    pub name: Option<String>,
}

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ReceiveClick {
    pub cursor_x: Option<i64>,
    pub cursor_y: Option<i64>,
    pub name: Option<String>,
    pub namespace: Option<String>,
}