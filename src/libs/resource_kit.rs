use crate::mongo_sdk::MongoDatabase;
use serde::{Deserialize, Serialize};
use mongodb::bson::doc;

#[derive(Serialize, Deserialize, Debug)]
pub struct Resource {
  pub resource_id: String,
  pub driver: String,
  pub raw_content: Option<String>,
  pub file_path: Option<String>,
}

pub fn get_resource(resource_id: &str) -> Option<Resource> {
  let collection = MongoDatabase::use_resources_collection();
  
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
  let collection = MongoDatabase::use_resources_collection();

  let resources: Vec<Resource> = collection
    .find(None, None)
    .expect("Unable to find resources")
    .map(|res| res.unwrap().into())
    .collect();

  return resources;
}

pub fn is_resource_exist(resource_id: &str) -> bool {
  let collection = MongoDatabase::use_resources_collection();

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

pub async fn async_require_resource(resource_id: &str) -> Resource {
  let collection = MongoDatabase::use_async_resources_collection();

  let resource: Resource = collection
    .find_one(
      doc! {
        "resource_id": resource_id
      },
      None,
    )
    .await
    .expect("Unable to find resource")
    .expect("Resource not found")
    .into();

  return resource;
}

// Get resource
pub fn require_resource(resource_id: &str) -> Resource {
  let collection = MongoDatabase::use_resources_collection();

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