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