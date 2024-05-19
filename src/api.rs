#[path = "dto/route.rs"] mod route;
#[path = "dto/filter.rs"] mod filter;
#[path = "dto/resource.rs"] mod resource;

use std::{collections, ptr::{self, null}};

use mongodb::{bson::doc, sync::Collection};
use rocket::{form::Form, http::{ext::IntoCollection, ContentType, Status}, FromForm};

use crate::{database::{self, get_database}, json_router::json_router};

#[derive(FromForm)]
pub struct CreateRoute {
  pub name: String,
  pub path: String,
  pub filter_id: Option<String>,
  pub resource_id: Option<String>,
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
  pub raw_data: Option<String>
}



#[post("/route/create", data = "<input>")]
pub fn create_new_route(input: Form<CreateRoute>) -> (Status, (ContentType, String)) {
  let collection: Collection<filter::Filter> = get_database(String::from("filters"))
    .collection("filters");

  let filter_count = collection.count_documents(doc! {
    "filter_id": input.filter_id.clone()
  }, None).expect("Unable to count documents");

  if filter_count == 0 {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Filter not found",
          "value": null
        }).to_string()
      )
    );
  }

  let collection: Collection<resource::Resource> = get_database(String::from("resources"))
    .collection("resources");

  let reource_count = collection.count_documents(doc! {
    "resource_id": input.resource_id.clone()
  }, None).expect("Unable to count documents");

  if reource_count == 0 {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Resource not found",
          "value": null
        }).to_string()
      )
    );
  }

  let collection: Collection<route::Route> = get_database(String::from("routes"))
    .collection("routes");

  let doc: route::Route = route::Route {
    path: input.path.clone(),
    name: input.name.clone(),
    params: None,
    filter_id: input.filter_id.clone(),
    resource_id: input.resource_id.clone()
  };

  if collection.count_documents(doc! {
    "path": input.path.clone()
  }, None).expect("Unable to count documents") > 0 {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Route with the same path already exists",
          "value": null
        }).to_string()
      )
    );
  }

  if collection.count_documents(doc! {
    "name": input.name.clone()
  }, None).expect("Unable to count documents") > 0 {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Route with the same name already exists",
          "value": null
        }).to_string()
      )
    );
  }

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

#[post("/filter/create", data = "<input>")]
pub fn create_new_filter(input: Form<CreateFilter>) -> (Status, (ContentType, String)) {
  let collection: Collection<filter::Filter> = get_database(String::from("filters"))
    .collection("filters");

  let filter_count = collection.count_documents(doc! {
    "filter_id": &input.filter_id.clone()
  }, None).expect("Unable to count documents");

  if filter_count != 0 {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Filter already exists",
          "value": null
        }).to_string()
      )
    );
  }

  let collection: Collection<resource::Resource> = get_database(String::from("resources"))
    .collection("resources");

  let mut conditions = Vec::new();

  for condition in &input.conditions {
    let reource_count = collection.count_documents(doc! {
      "resource_id": &condition.resource_id
    }, None).expect("Unable to count documents");

    if reource_count == 0 {
      return (
        Status::Conflict, 
        (
          ContentType::JSON,
          serde_json::json!({
            "isOk": false,
            "error": "Resource not found",
            "value": null
          }).to_string()
        )
      );
    }

    conditions.push(filter::Condition {
      name: condition.name.clone(),
      resource_id: Option::Some(condition.resource_id.clone()),
      operator: condition.operator.clone(),
      value: condition.value.clone(),
      plugin: condition.plugin.clone()
    });
  }

  let doc: filter::Filter = filter::Filter {
    name: input.name.clone(),
    filter_id: input.filter_id.clone(),
    conditions: conditions
  };

  let collection: Collection<filter::Filter> = get_database(String::from("filters"))
    .collection("filters");

  let result = collection
    .insert_one(doc, None)
    .expect("Failed to insert filter");

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

#[post("/resource/create", data = "<input>")]
pub fn create_new_resource(input: Form<CreateResource>) -> (Status, (ContentType, String)) {
  let collection: Collection<resource::Resource> = get_database(String::from("resources"))
    .collection("resources");

  let resource_count = collection.count_documents(doc! {
    "resource_id": &input.resource_id.clone()
  }, None).expect("Unable to count documents");

  if resource_count != 0 {
    return (
      Status::Conflict, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Resource already exists",
          "value": null
        }).to_string()
      )
    );
  }

  // let collection: Collection<resource::Resource> = get_database(String::from("resources"))
  // .collection("resources");

  let doc: resource::Resource = resource::Resource {
    driver: input.driver.clone(),
    resource_id: input.resource_id.clone(),
    raw_content: input.raw_data.clone(),
    file_path: input.file_path.clone(),
  };

  // let collection: Collection<filter::Filter> = get_database(String::from("filters"))
  //   .collection("filters");

  let result = collection
    .insert_one(doc, None)
    .expect("Failed to insert filter");

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
  let collection: Collection<route::Route> = get_database(String::from("routes"))
    .collection("routes");

  let mut result = collection
    .find(doc! {}, None)
    .expect("Failed to find routes");
  

  let mut vector: Vec<route::Route> = Vec::new();

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

#[get("/filter/list")]
pub fn get_all_filters() -> (Status, (ContentType, String))  {
  let collection: Collection<filter::Filter> = get_database(String::from("filters"))
    .collection("filters");

  let mut result = collection
    .find(doc! {}, None)
    .expect("Failed to find filters");
  

  let mut vector: Vec<filter::Filter> = Vec::new();

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

#[get("/resource/list")]
pub fn get_all_resources() -> (Status, (ContentType, String))  {
  let collection: Collection<resource::Resource> = get_database(String::from("resources"))
    .collection("resources");

  let mut result = collection
    .find(doc! {}, None)
    .expect("Failed to find resources");
  
  let mut vector: Vec<resource::Resource> = Vec::new();

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