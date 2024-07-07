use std::path::PathBuf;
use mongodb::{bson::doc, sync::Collection};
use rocket::{form::Form, http::{ContentType, Status}};
use crate::{api::{standard_http_error, trivial_checkpoint, CreateFilter}, database::get_database,  filter::{Condition, Filter}, filter_kit::get_all_registred_filters_names};

#[post("/filter/create", data = "<input>")]
pub fn create_new_filter(input: Form<CreateFilter>) -> (Status, (ContentType, String)) {
  if trivial_checkpoint::is_filter_exists(&input.filter_id.clone()) {
    return standard_http_error::filter_already_exists();
  }

  let mut conditions = Vec::new();

  for condition in &input.conditions {
    if !trivial_checkpoint::is_resource_exists(&condition.resource_id) {
      return standard_http_error::resource_not_found(&condition.resource_id);
    }

    conditions.push(Condition {
      name: condition.name.clone(),
      resource_id: Option::Some(condition.resource_id.clone()),
      operator: condition.operator.clone(),
      value: condition.value.clone(),
      plugin: condition.plugin.clone()
    });
  }

  let doc: Filter = Filter {
    name: input.name.clone(),
    filter_id: input.filter_id.clone(),
    conditions: conditions
  };

  let collection: Collection<Filter> = get_database(String::from("filters"))
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

#[get("/filter/list")]
pub fn get_all_filters() -> (Status, (ContentType, String))  {
  let collection: Collection<Filter> = get_database(String::from("filters"))
    .collection("filters");

  let mut result = collection
    .find(doc! {}, None)
    .expect("Failed to find filters");
  

  let mut vector: Vec<Filter> = Vec::new();

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

#[get("/filter/<id..>")]
pub fn get_filter_by_id(id: PathBuf) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_filter_exists(id.display().to_string().as_str()) {
    return standard_http_error::filter_not_found(id.display().to_string().as_str());
  }

  let collection: Collection<Filter> = get_database(String::from("filters"))
    .collection("filters");

  let result = collection
    .find_one(
      doc! {
        "filter_id": id.display().to_string()
      },
      None
    )
    .expect("Failed to find filter");

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

#[put("/filter/update", data = "<filter>")]
pub fn update_filter_by_id(filter: Form<CreateFilter>) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_filter_exists(&filter.filter_id.as_str()) {
    return standard_http_error::filter_not_found(&filter.filter_id.as_str());
  }

  let mut conditions = Vec::new();

  for condition in &filter.conditions {
    if !trivial_checkpoint::is_resource_exists(&condition.resource_id.as_str()) {
      return standard_http_error::resource_not_found(&condition.resource_id.as_str());
    }

    conditions.push(doc! {
      "name": condition.name.clone(),
      "resource_id": Option::Some(condition.resource_id.clone()),
      "operator": condition.operator.clone(),
      "value": condition.value.clone(),
      "plugin": condition.plugin.clone()
    });
  }

  let collection: Collection<Filter> = get_database(String::from("filters")).collection("filters");

  let result = collection
    .update_one(
      doc! {
        "filter_id": filter.filter_id.as_str()
      },
      doc! {
        "$set": {
          "conditions": conditions
        }
      },
      None
    )
    .expect("Failed to update filter");

  let value = serde_json::json!({
    "isOk": true,
    "value": result.modified_count,
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

#[delete("/filter/<id..>")]
pub fn delete_filter_by_id(id: PathBuf) -> (Status, (ContentType, String)) {
  if trivial_checkpoint::is_filter_exists(id.display().to_string().as_str()) {
    return standard_http_error::filter_not_found(id.display().to_string().as_str());
  }

  let collection: Collection<Filter> = get_database(String::from("filters"))
    .collection("filters");

  let result = collection
    .delete_one(
      doc! {
        "filter_id": id.display().to_string()
      },
      None
    )
    .expect("Failed to delete filter");

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

#[get("/filter/plugin/list")]
pub fn get_all_plugins_for_filters() -> (Status, (ContentType, String))  {
  let vector: Vec<String> = get_all_registred_filters_names();

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
