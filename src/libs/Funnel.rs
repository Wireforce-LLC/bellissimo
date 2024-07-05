use std::collections::HashMap;

use chrono::Duration;
use mongodb::{
    bson::{doc, Document},
    sync::Collection,
};
use serde::{Deserialize, Serialize};

use crate::{
    api_funnel::funnel_by_clicks_to_schemas, click::Click, click_sdk, mongo_sdk::MongoDatabase,
};

#[derive(FromForm)]
pub struct FunnelStandardFilter {
    pub start_time: Option<u32>,
    pub end_time: Option<u32>,
    pub limit: Option<u32>,
    pub skip: Option<u32>,
}

#[derive(FromForm)]
pub struct FunnelByClicksFilter {
    pub hide_short_schemas: Option<bool>,
}

#[derive(Default)]
pub struct Funnel {}

#[derive(Default, Serialize, Deserialize)]
pub struct FunnelRow {
    pub schema: Vec<String>,
    pub count: i32,
}

#[derive(Default, Serialize, Deserialize)]
pub struct FunnelCountDateIterRow {
    pub name: String,
    pub count: i32
}

#[derive(Default, Serialize, Deserialize)]
pub struct FunnelCountDateRow {
    pub date: String,
    pub counts: Vec<FunnelCountDateIterRow>,
}

impl Funnel {
    pub fn funnel_by_clicks(
        filter: FunnelStandardFilter,
        specific_filter: FunnelByClicksFilter,
    ) -> Vec<FunnelRow> {
        let collection: Collection<Click> = MongoDatabase::use_collection("requests", "clicks");
        let mut sequence_counts: HashMap<Vec<String>, i32> = HashMap::new();

        let start_time: i64 = Duration::days(30).num_seconds();

        // Агрегация данных по IP-адресу (пользователю)
        let pipeline: Vec<Document> = vec![
            doc! {
                "$match": {
                    "time": {
                      "$gte": filter.start_time.unwrap_or((click_sdk::Click::now() - start_time) as u32),
                      "$lte": filter.end_time.unwrap_or(click_sdk::Click::now() as u32),
                    }
                }
            },
            doc! {
                "$group": {
                    "_id": "$ip",
                    "events": { "$push": "$name" }
                }
            },
            doc! {
                "$limit": filter.limit.unwrap_or(512),
            },
            doc! {
                "$skip": filter.skip.unwrap_or(0),
            },
        ];

        let cursor = collection.aggregate(pipeline, None);
        let cursor = cursor.unwrap();

        for user_data in cursor {
            if user_data.is_err() {
                continue;
            }

            let events = user_data.unwrap();

            let events = events.get("events");

            if events.is_none() {
                continue;
            }

            let events = events.unwrap().as_array().unwrap();
            let events: Vec<String> = events
                .iter()
                .map(|x| {
                    if x.as_str().is_none() {
                        return "".to_string();
                    }

                    return x.as_str().unwrap().to_string();
                })
                .filter(|x| !x.is_empty())
                .collect();

            let mut sequence: Vec<String> = Vec::new();

            for event in events {
                if sequence.is_empty() || *sequence.last().unwrap() != event {
                    sequence.push(event);
                }
            }

            let sequence_vec = sequence.clone();

            *sequence_counts.entry(sequence_vec).or_insert(0) += 1;
        }

        let mut result: Vec<FunnelRow> = Vec::new();
        for (sequence, &count) in &sequence_counts {
            if count < 3 {
                continue;
            }

            if specific_filter.hide_short_schemas.is_some() {
                if specific_filter.hide_short_schemas.unwrap() {
                    if sequence.len() < 2 {
                        continue;
                    }
                }
            }

            result.push(FunnelRow {
                schema: sequence.to_owned(),
                count: count,
            });
        }

        result.sort_by(|x, y| y.count.cmp(&x.count));

        return result;
    }

    pub fn funnel_by_date(
        filter: FunnelStandardFilter,
    ) -> Vec<FunnelCountDateRow> {
        let collection: Collection<Click> = MongoDatabase::use_collection("requests", "clicks");
        let start_time: i64 = Duration::days(30).num_seconds();

        let mut pipeline = vec![
            doc! {
                "$match": {
                    "time": {
                      "$gte": filter.start_time.unwrap_or((click_sdk::Click::now() - start_time) as u32),
                      "$lte": filter.end_time.unwrap_or(click_sdk::Click::now() as u32),
                    }
                }
            },
            doc! {
                "$skip": filter.skip.unwrap_or(0),
            },
            doc! {
                "$addFields": {
                    "date": { "$dateToString": { "format": "%Y-%m-%d", "date": { "$toDate": { "$multiply": ["$time", 1000] } } }}
                }
            },
            doc! {
                "$group": {
                    "_id": { "date": "$date", "name": "$name" },
                    "count": { "$sum": 1 }
                }
            },
            doc! {
                "$group": {
                    "_id": "$_id.date",
                    "counts": {
                        "$push": {
                            "name": "$_id.name",
                            "count": "$count"
                        }
                    }
                }
            },
            doc! {
                "$project": {
                    "_id": 0,
                    "date": "$_id",
                    "counts": "$counts"
                }
            },
            doc! {
                "$limit": filter.limit.unwrap_or(6),
            },
            doc! {
                "$sort": {
                  "date": -1
                }
            }
        ];

        let cursor = collection.aggregate(pipeline, None);
        
        let mut cursor = cursor.unwrap();
        let mut counts: Vec<FunnelCountDateRow> = Vec::new();

        while let Some(result) = cursor.next() {
            if result.is_err() {
                continue;
            }

            let result = result.unwrap();

            let iters = result
                .get("counts")
                .unwrap()
                .as_array()
                .unwrap()
                .into_iter()
                .filter_map(|x| {
                    let x = x.as_document().unwrap();
                    
                    if x.get("name").is_none() || x.get("count").is_none() {
                        return None;
                    }

                    if x.get("name").unwrap().as_str().is_none() {
                        return None;
                    }

                    let name = x.get("name").unwrap().as_str().unwrap();
                    let count = x.get("count").unwrap().as_i32().unwrap();

                    if count < 3 {
                        return None;
                    }

                    let record = FunnelCountDateIterRow {
                        name: name.to_string(),
                        count: count
                    };

                    Some(record)
                })
                .collect();

            counts.push(FunnelCountDateRow {
                date: result.get("date").unwrap().as_str().unwrap().to_string(),
                counts: iters
            });
        }

        counts.sort_by(|x, y| x.date.cmp(&y.date));

        return counts;
    }
}
