use std::path::PathBuf;
use mongodb::bson::doc;
use rocket::{form::Form, http::{ContentType, Status}};
use crate::{api::{standard_http_error, trivial_checkpoint}, dynamic_router::Route, mongo_sdk::MongoDatabase};

use crate::api::CreateRoute;

#[post("/route/create", data = "<input>")]
pub async fn create_new_route(input: Form<CreateRoute>) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_resource_exists(&input.resource_id).await {
    return standard_http_error::resource_not_found(&input.resource_id);
  }

  if !trivial_checkpoint::is_filter_exists(&input.filter_id).await {
    return standard_http_error::filter_not_found(&input.filter_id);
  }

  if trivial_checkpoint::is_route_path_exists(&input.domain, &input.path).await {
    return standard_http_error::route_with_path_already_exists(&input.domain, &input.path);
  }

  if trivial_checkpoint::is_route_exists(&input.name).await {
    return standard_http_error::route_already_exists(&input.name);
  }
 
  let collection = MongoDatabase::use_routes_collection();

  let doc: Route = Route {
    path: input.path.to_string(),
    name: input.name.to_string(),
    params: None,
    filter_id: Some(input.filter_id.to_string()),
    resource_id: Some(input.resource_id.to_string()),
    domain: Some(input.domain.to_string()),
  };

  let result = collection
    .insert_one(doc, None)
    .expect("Failed to insert route");

  let value = serde_json::json!({
    "isOk": true,
    "value": result.inserted_id,
    "error": null
  });

  let result = value.to_string();

  return (
    Status::Created, 
    (
      ContentType::JSON,
      result
    )
  );
}

#[get("/route/list")]
pub fn get_all_routes() -> (Status, (ContentType, String))  {
  let collection = MongoDatabase::use_routes_collection();

  let mut result = collection
    .find(doc! {}, None)
    .expect("Failed to find routes");
  
  let mut vector: Vec<Route> = Vec::new();

  while let Some(doc) = result.next() {
    vector.push(doc.expect("Unable to get document"));
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": vector,
    "error": null
  });

  let result = value.to_string();

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      result
    )
  );
}

#[get("/route/<name..>")]
pub async fn get_route_by_name(name: PathBuf) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_route_exists(name.display().to_string().as_str()).await {
    return standard_http_error::route_not_found(name.display().to_string().as_str());
  }

  let collection = MongoDatabase::use_routes_collection();

  let result = collection
    .find_one(
      doc! {
        "name": name.display().to_string()
      },
      None
    )
    .expect("Failed to find route");

  let value = serde_json::json!({
    "isOk": true,
    "value": result.unwrap(),
    "error": null
  });

  let result = value.to_string();

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      result
    )
  );
}

#[delete("/route/<name..>")]
pub async fn delete_route_by_name(name: PathBuf) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_route_exists(name.display().to_string().as_str()).await {
    return standard_http_error::route_not_found(name.display().to_string().as_str());
  }

  let collection = MongoDatabase::use_routes_collection();

  let result = collection
    .delete_one(
      doc! {
        "name": name.display().to_string()
      },
      None
    )
    .expect("Failed to delete route");

  let value = serde_json::json!({
    "isOk": true,
    "value": result.deleted_count,
    "error": null
  });

  let result = value.to_string();

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      result
    )
  );
}
