use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Click {
    pub time: i64,
    pub ip: String,
    pub cursor_x: Option<i64>,
    pub cursor_y: Option<i64>,
}