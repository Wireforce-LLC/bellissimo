use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct RequestRecord {
    pub time: i64,
    pub headers: MyHeaderMap,
}