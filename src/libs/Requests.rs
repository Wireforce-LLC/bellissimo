use std::collections::HashMap;

use mongodb::bson::{doc, Bson};

use crate::asn_record::AsnRecord;

pub struct Request {}

impl Request {
    pub fn aggregate_requests_by_header(ip: &str) -> Option<HashMap<String, String>> {
        Self::aggregate_requests_by_key(ip, "headers")
    }

    pub fn aggregate_requests_by_query(ip: &str) -> Option<HashMap<String, String>> {
        Self::aggregate_requests_by_key(ip, "query")
    }

    pub fn aggregate_requests_by_key(ip: &str, key: &str) -> Option<HashMap<String, String>> {
        let mut result = HashMap::new();
        let collection =
            crate::mongo_sdk::MongoDatabase::use_collection::<AsnRecord>("requests", "asn_records");

        let pipeline = vec![
            doc! {
                "$match": doc! {
                    "headers.cf-connecting-ip": ip
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
            println!("{}", out.unwrap_err());
            return None;
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

        return Some(result);
    }
}
