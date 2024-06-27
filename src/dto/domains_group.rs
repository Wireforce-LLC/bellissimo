use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DomainsGroupedBySource {
    pub host: String,
    pub source: String,
    pub count_request: usize,
}