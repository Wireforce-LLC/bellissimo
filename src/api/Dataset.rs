use std::collections::HashMap;
use chrono::Utc;
use mongodb::bson::doc;
use rocket::http::{ContentType, Status};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use crate::dataset_sdk::{Dataset, DatasetCursorFilter};

#[derive(FromForm)]
pub struct DatasetSelectFilter {
  pub limit: Option<i64>,
  pub skip: Option<u64>
}


#[derive(Serialize, Deserialize, Debug)]
pub struct DatasetInfo {
  pub name: String,
  pub size_of_dataset: u64,
}


#[post("/dataset/create", data="<data>")]
pub fn create_dataset(data: String) -> (Status, (ContentType, String)) {
  let data: HashMap<String, String> = serde_json::from_str(&data).unwrap();

  if !data.contains_key("name") {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Missing required field 'name'"
        }).to_string()
      )
    )
  }

  let name = data.get("name").unwrap();

  if name.is_empty() {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Dataset name cannot be empty"
        }).to_string()
      )
    )
  }

  if name.contains(" ") {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Dataset name cannot contain spaces"
        }).to_string()
      )
    )
  }

  // special case
  if !name.chars().all(|c| ((c.is_alphanumeric()  && c.is_lowercase()) || c == '_')) {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Dataset name can only contain alphanumeric characters and underscores and only lowercase"
        }).to_string()
      )
    )
  }

  if Dataset::is_dataset(&name) {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Dataset '{}' already exists", name),
          "value": null
        }).to_string()
      )
    )
  }

  let _ = Dataset::create_dataset(&name);

  return (Status::Created, (ContentType::JSON, String::new()));
}

#[get("/dataset/list", rank = 3)]
pub fn get_all_datasets() -> (Status, (ContentType, String)) {
  let mut result = Vec::new();

  let datasets = Dataset::get_datasets_list();

  for dataset in datasets {
    result.push(DatasetInfo {
      size_of_dataset: Dataset::size_of_dataset(&dataset),
      name: dataset,
    });
  }

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": result
      }).to_string()
    )
  );
}
 
#[post("/dataset/write/<dataset_name>", data="<data>")]
pub fn write_data_into_dataset(dataset_name: String, data: String) -> (Status, (ContentType, String)) {
  if !Dataset::is_dataset(&dataset_name) {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Dataset '{}' not found", dataset_name),
          "value": null
        }).to_string()
      )
    );
  }

  let data = serde_json::from_str(&data);

  match data {
    Ok(data) => {
      let mut data: HashMap<String, serde_json::Value> = data;

      data.insert("time".to_string(), Value::from(Utc::now().timestamp_micros()));

      let result = Dataset::insert_into_dataset(&dataset_name, data);

      match result {
        Ok(insert_result) => {
          return (Status::Created, (ContentType::JSON, serde_json::json!({
            "isOk": true,
            "value": insert_result.inserted_id,
            "err": null
          }).to_string()));
        }

        Err(err) => {
          return (Status::InternalServerError, (ContentType::JSON, serde_json::json!({
            "isOk": false,
            "value": null,
            "error": err.to_string()
          }).to_string()));
        }
      }
    }

    Err(err) => {
      return (Status::InternalServerError, (ContentType::JSON, serde_json::json!({
        "isOk": false,
        "value": null,
        "error": err.to_string()
      }).to_string()));
    }
  }
}
 
#[get("/dataset/write/<dataset_name>?<data..>")]
pub fn write_get_data_into_dataset(dataset_name: String, data: HashMap<String, String>) -> (Status, (ContentType, String)) {
  if !Dataset::is_dataset(&dataset_name) {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Dataset '{}' not found", dataset_name),
          "value": null
        }).to_string()
      )
    );
  }

  let mut data: HashMap<String, serde_json::Value> = data.into_iter().map(|(k, v)| (k, Value::from(v))).collect();

  data.insert("time".to_string(), Value::from(Utc::now().timestamp_micros()));

  let result = Dataset::insert_into_dataset(&dataset_name, data);

  match result {
    Ok(insert_result) => {
      return (Status::Created, (ContentType::JSON, serde_json::json!({
        "isOk": true,
        "value": insert_result.inserted_id,
        "err": null
      }).to_string()));
    }

    Err(err) => {
      return (Status::InternalServerError, (ContentType::JSON, serde_json::json!({
        "isOk": false,
        "value": null,
        "error": err.to_string()
      }).to_string()));
    }
  }
}
 

#[get("/dataset/<dataset_name>?<dataset_select_filter..>", rank = 4)]
pub fn get_dataset_data_by_id(dataset_name: String, dataset_select_filter: DatasetSelectFilter) -> (Status, (ContentType, String)) {
  let data = Dataset::get_dataset_data(&dataset_name, doc! {}, DatasetCursorFilter {
    limit: dataset_select_filter.limit.unwrap_or(32),
    skip: dataset_select_filter.skip.unwrap_or(0)
  });

  match data {
    Ok(data) => {
      return (Status::Ok, (ContentType::JSON, serde_json::to_string(&data).unwrap()));
    }

    Err(err) => {
      return (Status::InternalServerError, (ContentType::JSON, serde_json::json!({
        "isOk": false,
        "value": null,
        "error": err
      }).to_string()));
    }
  }
}