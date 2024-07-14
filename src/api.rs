use std::{collections::{HashMap}, fs, path::{Path, PathBuf}};
use chrono::{DateTime, Duration, TimeZone, Utc};
use mongodb::{bson::{doc, document}, options::FindOptions, sync::Collection};
use rocket::{http::{ContentType, Status}, FromForm};
use serde::{Serialize, Deserialize};
use crate::{database::get_database, dynamic_router::Route, resource_kit::Resource};


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
  use crate::{database::get_database, dynamic_router::Route, filter::Filter, resource_kit::Resource};

  pub fn is_route_path_exists(domain: &str, path: &str) -> bool {
    let collection: Collection<Route> = get_database(String::from("routes"))
     .collection("routes");

    collection.count_documents(
      doc! {
        "path": path,
        "domain": domain
      },
      None
    ).expect("Unable to count documents") != 0
  }

  pub fn is_filter_exists(filter_id: &str) -> bool {
    let collection: Collection<Filter> = get_database(String::from("filters"))
      .collection("filters");
  
    collection.count_documents(
      doc! {
        "filter_id": filter_id
      },
      None
    ).expect("Unable to count documents") != 0
  }
  
  pub fn is_resource_exists(resource_id: &str) -> bool {
    let collection: Collection<Resource> = get_database(String::from("resources"))
     .collection("resources");
  
    collection.count_documents(
      doc! {
        "resource_id": resource_id
      },
      None
    ).expect("Unable to count documents")!= 0
  }
  
  pub fn is_route_exists(name: &str) -> bool {
    let collection: Collection<Route> = get_database(String::from("routes"))
     .collection("routes");
  
    collection.count_documents(
      doc! {
        "name": name
      },
      None
    ).expect("Unable to count documents")!= 0
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
