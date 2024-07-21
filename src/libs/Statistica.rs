use std::collections::HashMap;

use crate::asn_record::AsnRecord;
use crate::config::CONFIG;
use crate::http_over_sdk::HttpOver;
use crate::mongo_sdk::MongoDatabase;
use chrono::{Duration, Utc};
use mongodb::bson::{doc, Bson};
use tokio::runtime::Handle;
use tokio::task;

pub struct Converter {}

pub struct Statistica {}


pub fn init_func() {
    HttpOver::register(
        "assign_requests_by_ip",
        "Assign requests by IP address within a certain window",
        |params: HashMap<String, String>| {
            if !params.contains_key("ip") {
                return Err("Missing 'ip' parameter".to_string());
            }

            if !params.contains_key("window_days") {
                return Err("Missing 'window_days' parameter".to_string());
            }

            if !params.contains_key("key") {
                return Err("Missing 'key' parameter".to_string());
            }

            let key = params.get("key").unwrap();

            if !vec!["headers", "query"].contains(&key.as_str()) {
                return Err("Invalid 'key' parameter. Must be 'headers' or 'query'".to_string());
            }

            let ip = params.get("ip").unwrap();
            let window_days = params.get("window_days").unwrap().parse::<i64>();

            if window_days.is_err() {
                return Err("Invalid 'window_days' parameter. Must be an integer wrapped as string. Example: 30".to_string());
            }

            let window_days = window_days.unwrap();

            let mut result_with_serde = HashMap::new();
            let result = Statistica::statistica_aggregate_requests_by_key(ip, key, window_days);

            if result.is_err() {
                return Err(result.err().unwrap());
            }

            let result = result.unwrap();

            if result.is_none() {
                return Ok(None);
            }

            let result = result.unwrap();

            for (key, value) in result {
                result_with_serde.insert(key, serde_json::to_value(&value).unwrap());
            }

            Ok(Option::from(result_with_serde))
        }
    ).unwrap();

    HttpOver::register(
        "get_requests_by_country",
        "Get requests by country within a certain window",
        |params: HashMap<String, String>| {
            if !params.contains_key("window_days") {
                return Err("Missing 'window_days' parameter".to_string());
            }

            let window_days = params.get("window_days").unwrap().parse::<i64>();

            if window_days.is_err() {
                return Err("Invalid 'window_days' parameter. Must be an integer wrapped as string. Example: 30".to_string());
            }

            let window_days = window_days.unwrap();

            let mut result_with_serde = HashMap::new();
            let result = Statistica::statistica_aggregate_requests_by_country(window_days);

            if result.is_err() {
                return Err(result.err().unwrap());
            }

            let result = result.unwrap();

            if result.is_none() {
                return Ok(None);
            }

            let result = result.unwrap();

            for (key, value) in result {
                result_with_serde.insert(key, serde_json::to_value(&value).unwrap());
            }

            Ok(Option::from(result_with_serde))
        }
    ).unwrap();
}

impl Statistica {
    fn statistica_aggregate_requests_by_country(window_days: i64) -> Result<Option<HashMap<String, String>>, String> {
        let start_time: i64 = Duration::days(window_days).num_microseconds().unwrap();

        let mut result = HashMap::new();
        let collection = MongoDatabase::use_requests_collection();

        let pipeline = vec![
            doc! {
                "$match": doc! {
                    "time": {
                      "$gte": Utc::now().timestamp_micros() - start_time,
                      "$lte": Utc::now().timestamp_micros()
                    }
                }
            },
            doc! {
                "$group": doc! {
                    "_id": "$headers.cf-ipcountry",
                    "count": { "$sum": 1 }
                }
            }
        ];

        let cursor = collection.aggregate(pipeline, None);
        let cursor = cursor.unwrap();

        for user_data in cursor {
            if user_data.is_err() {
                continue;
            }

            let user_data = user_data.unwrap();

            if user_data.get("count").is_none() {
                continue;
            }

            let count = user_data.get("count").unwrap();
            let country = user_data.get("_id").unwrap();

            let key = country.as_str();

            if key.is_none() {
                continue;
            }

            result.insert(
                key.unwrap().to_string(), 
                count.as_i32().unwrap_or(0).to_string()
            );
        }

        Ok(Option::from(result))
    }

    /**
     * Aggregates requests by key
     */
    fn statistica_aggregate_requests_by_key(ip: &str, key: &str, window_days: i64) -> Result<Option<HashMap<String, String>>, String> {
        let supported_keys = vec!["headers", "query"];

        if !supported_keys.contains(&key) {
            return Err(format!("Unsupported key: {}", key));
        }

        let start_time: i64 = Duration::days(window_days).num_microseconds().unwrap();

        let mut result = HashMap::new();
        let collection = MongoDatabase::use_requests_collection();

        let pipeline = vec![
            doc! {
                "$match": doc! {
                    "headers.cf-connecting-ip": ip,
                }
            },
            doc! {
                "$match": doc! {
                    "time": {
                      "$gte": Utc::now().timestamp_micros() - start_time,
                      "$lte": Utc::now().timestamp_micros()
                    }
                }
            },
            doc! {
                "$replaceRoot": doc! {
                    "newRoot": format!("${}", key)
                }
            },
            doc! {
                "$group": doc! {
                    "_id": Bson::Null,
                    "mergedDocuments": doc! {
                        "$push": "$$ROOT"
                    }
                }
            },
            doc! {
                "$project": doc! {
                    "_id": 0,
                    "mergedDocument": doc! {
                        "$reduce": doc! {
                            "input": "$mergedDocuments",
                            "initialValue": doc! {},
                            "in": doc! {
                                "$mergeObjects": [
                                    "$$value",
                                    "$$this"
                                ]
                            }
                        }
                    }
                }
            },
        ];

        let out = collection.aggregate(pipeline, None);

        if out.is_err() {
            return Err(format!("Failed to aggregate requests: {}", out.unwrap_err()));
        }

        let out = out.unwrap();

        for document in out {
            if document.is_err() {
                continue;
            }

            let document = document.unwrap();
            let document = document.get("mergedDocument");

            if document.is_none() {
                continue;
            }

            let document = document.unwrap();
            let document = document.as_document().unwrap();
            let document = document.clone();
            let keys = document.keys();

            for key in keys {
                let value = document.get(key).unwrap().as_str().unwrap();
                result.insert(key.to_string(), value.to_string());
            }
        }

        return Ok(Some(result));
    }
}


impl Statistica {
    pub fn register_request(request_id: &str, insert_data: &AsnRecord) {
        task::block_in_place(move || {
            Handle::current().block_on(async move {
                let collection = MongoDatabase::use_requests_collection();

                if CONFIG["is_save_requests_in_mongodb"].as_bool().unwrap() {
                    collection.insert_one(insert_data, None).unwrap();
                }
            })
        });
    }
}
