use std::collections::HashMap;

use mongodb::{bson::Document, options::FindOptions, results::InsertOneResult};

use crate::mongo_sdk::MongoDatabase;

pub struct Dataset {}

pub struct DatasetCursorFilter {
    pub limit: i64,
    pub skip: u64,
    // pub sort: Option<HashMap<String, i32>>,
}

impl Dataset {
    pub fn new() -> Dataset {
        Dataset {}
    }

    pub fn get_datasets_list() -> Vec<String> {
        MongoDatabase::get_collection_names("datasets")
    }

    pub fn is_dataset(name: &str) -> bool {
        MongoDatabase::collection_exists("datasets", name)
    }

    pub fn create_dataset(name: &str) -> Result<(), &str> {
        if name.is_empty() {
            return Result::Err("Dataset name cannot be empty");
        }

        if name.contains(" ") {
            return Result::Err("Dataset name cannot contain spaces");
        }

        MongoDatabase::create_collections(vec![(name, "datasets")]);

        return Ok(())
    }

    pub fn insert_into_dataset(name: &str, data: HashMap<String, serde_json::Value>) -> Result<InsertOneResult, mongodb::error::Error> {
        MongoDatabase::use_collection::<HashMap<String, serde_json::Value>>("datasets", name)
           .insert_one(data, None)
    }

    pub fn get_dataset_data(name: &str, doc: Document, cursor: DatasetCursorFilter) -> Result<Vec<HashMap<String, serde_json::Value>>, &str> {
        let options = FindOptions::builder()
            .limit(cursor.limit)
            .skip(cursor.skip)
            .build();
        
        let mut dataset = MongoDatabase::use_collection::<HashMap<String, serde_json::Value>>("datasets", name)
            .find(doc, options)
            .expect("Failed to find dataset");
        
        let mut result: Vec<HashMap<String, serde_json::Value>> = vec![];

        while let Some(doc) = dataset.next() {
            result.push(doc.expect("Unable to get document"));
        }

        if result.is_empty() {
            return Result::Err("No data found in dataset");
        }

        return Ok(result);
    }

    // pub fn 
}