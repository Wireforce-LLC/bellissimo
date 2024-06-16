use crate::database::get_database;

use serde::{Deserialize, Serialize};
use mongodb::{bson::doc, sync::Collection};

#[derive(Serialize, Deserialize, Debug)]
pub struct Resource {
  pub resource_id: String,
  pub driver: String,
  pub raw_content: Option<String>,
  pub file_path: Option<String>,
}

pub fn get_resource(resource_id: &str) -> Option<Resource> {
  let collection: Collection<Resource> =
    get_database(String::from("resources")).collection("resources");

  let resource: Option<Resource> = collection
    .find_one(
      doc! {
        "resource_id": resource_id
      },
      None,
    )
    .expect("Unable to find resource")
    .expect("Resource not found")
    .into();

  return resource;
}

pub fn get_resources() -> Vec<Resource> {
  let collection: Collection<Resource> =
    get_database(String::from("resources")).collection("resources"); 

  let resources: Vec<Resource> = collection
    .find(None, None)
    .expect("Unable to find resources")
    .map(|res| res.unwrap().into())
    .collect();

  return resources;
}

pub fn is_resource_exist(resource_id: &str) -> bool {
  let collection: Collection<Resource> =
    get_database(String::from("resources")).collection("resources");

  let is_resource = collection
    .find_one(
      doc! {
        "resource_id": resource_id
      },
      None,
    )
    .expect("Unable to find resource")
    .is_some();

  return is_resource;
}

// Get resource
pub fn require_resource(resource_id: &str) -> Resource {
  let collection: Collection<Resource> =
    get_database(String::from("resources")).collection("resources");

  let resource: Resource = collection
    .find_one(
      doc! {
        "resource_id": resource_id
      },
      None,
    )
    .expect("Unable to find resource")
    .expect("Resource not found")
    .into();

  return resource;
}