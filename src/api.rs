use std::{collections::{HashMap}, fs, path::{Path, PathBuf}};
use mongodb::{bson::{doc}};
use rocket::{FromForm};
use serde::{Serialize, Deserialize};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
pub struct FileOverviewPath {
  pub path: Option<String>,
}

#[derive(FromForm)]
pub struct WriteFileValue {
  pub content: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FSEntity {
  pub path: Option<String>,
  pub is_file: bool
}

#[derive(FromForm)]
pub struct CreateRoute {
  pub name: String,
  pub path: String,
  pub filter_id: String,
  pub resource_id: String,
  pub domain: String
}

#[derive(FromForm)]
pub struct Filter {
  pub name: String,
  pub value: String,
  pub operator: String,
  pub plugin: String,
  pub resource_id: String,
}

#[derive(FromForm)]
pub struct CreateFilter {
  pub name: String,
  pub filter_id: String,
  pub conditions: Vec<Filter>,
}

#[derive(FromForm)]
pub struct CreateResource {
  pub resource_id: String,
  pub driver: String,
  pub file_path: Option<String>,
  pub raw_data: Option<String>,
}

pub mod trivial_checkpoint {
  use mongodb::{bson::doc, sync::Collection};
  use crate::{database::get_database, dynamic_router::Route, filter::Filter, mongo_sdk::MongoDatabase, resource_kit::Resource};

  pub async fn is_route_path_exists(domain: &str, path: &str) -> bool {
    let collection = MongoDatabase::use_async_routes_collection();

    collection
      .count_documents(
        doc! {
          "path": path,
          "domain": domain
        },
        None
      )
      .await
      .expect("Unable to count documents") != 0
  }

  pub async fn is_filter_exists(filter_id: &str) -> bool {
    let collection = MongoDatabase::use_async_filters_collection();
  
    collection.count_documents(
      doc! {
        "filter_id": filter_id
      },
      None
    ).await.expect("Unable to count documents") != 0
  }
  
  pub async fn is_resource_exists(resource_id: &str) -> bool {
    let collection = MongoDatabase::use_async_resources_collection();
  
    collection.count_documents(
      doc! {
        "resource_id": resource_id
      },
      None
    ).await.expect("Unable to count documents")!= 0
  }
  
  pub async fn is_route_exists(name: &str) -> bool {
    let collection = MongoDatabase::use_async_routes_collection();
  
    collection.count_documents(
      doc! {
        "name": name
      },
      None
    ).await.expect("Unable to count documents")!= 0
  }
}

pub mod standard_http_error {
  use rocket::http::{ContentType, Status};

  pub fn route_already_exists(name: &str) -> (Status, (ContentType, String)) {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Route '{}' already exists", name),
          "value": null
        }).to_string()
      )
    );
  }

  pub fn route_with_path_already_exists(name: &str, path: &str) -> (Status,
    (ContentType, String)) {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Route '{}' with path '{}' already exists", name, path),
          "value": null
        }).to_string()
      )
    );
  }


  pub fn filter_not_found(name: &str) -> (Status, (ContentType, String)) {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Filter '{}' not found", name),
          "value": null
        }).to_string()
      )
    );
  }

  pub fn resource_not_found(name: &str) -> (Status, (ContentType, String)) {
    return  (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Resource '{}' not found", name),
          "value": null
        }).to_string()
      )
    );
  }

  pub fn route_not_found(name: &str) -> (Status, (ContentType, String)) {
    return  (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": format!("Route '{}' not found", name),
          "value": null
        }).to_string()
      )
    );
  }

  pub fn filter_already_exists() -> (Status, (ContentType, String)) {
    return (
      rocket::http::Status::BadRequest,
      (
        rocket::http::ContentType::Plain,
        "Filter already exists".to_string()
      )
    )
  }
}
