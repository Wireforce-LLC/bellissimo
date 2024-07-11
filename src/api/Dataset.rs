
use std::collections::HashMap;

use mongodb::{bson::doc, sync::Collection};
use rocket::http::{ContentType, Status};
use crate::{background_service::User, database::get_database, dataset_sdk::{Dataset, DatasetCursorFilter}};

#[derive(FromForm)]
pub struct DatasetSelectFilter {
  pub limit: Option<i64>,
  pub skip: Option<u64>
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

  Dataset::create_dataset(&name);

  return (Status::Created, (ContentType::JSON, String::new()));
}

#[get("/dataset/list")]
pub fn get_all_datasets() -> (Status, (ContentType, String)) {
  let datasets = Dataset::get_datasets_list();

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": datasets
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


#[get("/dataset/<dataset_name>?<dataset_select_filter..>")]
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