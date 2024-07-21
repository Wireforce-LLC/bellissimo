use std::collections::HashMap;

use mongodb::{bson::Document, options::FindOptions, results::InsertOneResult};

use crate::{http_over_sdk::HttpOver, mongo_sdk::MongoDatabase};

pub struct Dataset {}

pub struct DatasetCursorFilter {
    pub limit: i64,
    pub skip: u64,
    // pub sort: Option<HashMap<String, i32>>,
}

pub fn init_func() {
    HttpOver::register(
        "get_datesets_list",
        "Get the list of datasets",
        |params: HashMap<String, String>| {
            let mut result_with_serde = HashMap::new();

            let result = Dataset::get_datasets_list();

            if result.is_empty() {
                return Ok(None);
            }

            result_with_serde.insert("datasets".to_string(), serde_json::to_value(result).unwrap());

            Ok(Some(result_with_serde))
        },
    ).unwrap();

    HttpOver::register(
        "create_dataset",
        "Create a new dataset",
        |params: HashMap<String, String>| {
            if !params.contains_key("name") {
                return Err("Missing 'name' parameter".to_string());
            }

            let name = params.get("name").unwrap();

            let result = Dataset::create_dataset(name);

            if result.is_err() {
                return Err(result.err().unwrap());
            }

            Ok(None)
        },
    ).unwrap();

    HttpOver::register(
        "is_dataset",
        "Check if a dataset exists",
        |params: HashMap<String, String>| {
            if !params.contains_key("name") {
                return Err("Missing 'name' parameter".to_string());
            }

            let name = params.get("name").unwrap();

            let result = Dataset::is_dataset(name);

            let result_with_serde = HashMap::from([
                ("is_dataset".to_string(), serde_json::to_value(result).unwrap())
            ]);

            Ok(Some(result_with_serde))
        },
    ).unwrap();

    HttpOver::register(
        "write_data_into_dataset",
        "Write data into a dataset",
        |params: HashMap<String, String>| {
            if !params.contains_key("dataset_name") {
                return Err("Missing 'dataset_name' parameter".to_string());
            }

            if !params.contains_key("data") {
                return Err("Missing 'data' parameter".to_string());
            }

            let dataset_name = params.get("dataset_name").unwrap();
            let data = params.get("data").unwrap();

            let data = serde_json::from_str::<HashMap<String, serde_json::Value>>(data);

            if data.is_err() {
                return Err(data.unwrap_err().to_string());
            }

            let data = data.unwrap();

            if data.keys().len() == 0 {
                return Err("Data cannot be empty".to_string());
            }

            let result = Dataset::sync_insert_into_dataset(dataset_name, data);

            if result.is_err() {
                return Err(result.unwrap_err().to_string());
            }

            Ok(None)
        },
    ).unwrap();

}

impl Dataset {
    pub fn get_datasets_list() -> Vec<String> {
        MongoDatabase::get_collection_names("datasets")
    }

    pub async fn size_of_dataset(dataset: &str) -> u64 {
        MongoDatabase::use_async_collection::<HashMap<String, serde_json::Value>>("datasets", dataset)
           .count_documents(None, None)
           .await
           .expect("Failed to get dataset size")
    }

    /**
     * Gets the last document of the specified type.
     * @param name
     * @return
     */
    pub async fn last_document_of_type(name: &str) -> Option<HashMap<String, serde_json::Value>> {
        MongoDatabase::use_async_collection::<HashMap<String, serde_json::Value>>("datasets", name)
           .find_one(None, None)
           .await
           .expect("Failed to get last document")
    }

    pub fn is_dataset(name: &str) -> bool {
        MongoDatabase::collection_exists(name, "datasets")
    }

    pub fn create_dataset(name: &str) -> Result<(), String> {
        if name.is_empty() {
            return Result::Err("Dataset name cannot be empty".to_string());
        }

        if name.contains(" ") {
            return Result::Err("Dataset name cannot contain spaces".to_string());
        }

        if !name
            .as_bytes()
            .iter()
            .all(|x| x.is_ascii_lowercase() || *x == b'_' || x.is_ascii_digit())
        {
            return Result::Err("Dataset name must be alphanumeric or _ or digits".to_string());
        }

        if Self::is_dataset(name) {
            return Result::Err("Dataset already exists".to_string());
        }

        let result = MongoDatabase
            ::use_database("datasets")
            .create_collection(&name, None);

        if result.is_err() {
            return Result::Err("Failed to create dataset".to_string());
        }

        return Ok(())
    }

    pub async fn insert_into_dataset(name: &str, data: HashMap<String, serde_json::Value>) -> Result<InsertOneResult, mongodb::error::Error> {
        MongoDatabase::use_async_collection::<HashMap<String, serde_json::Value>>("datasets", name)
           .insert_one(data, None)
           .await
    }

    /**
     * Sync insert into dataset
     * @param name
     */
    pub fn sync_insert_into_dataset(name: &str, data: HashMap<String, serde_json::Value>) -> Result<InsertOneResult, mongodb::error::Error> {
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