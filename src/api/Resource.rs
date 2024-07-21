use std::{collections::HashMap, fs, path::{Path, PathBuf}};
use mongodb::{bson::{doc, document}, sync::Collection};
use rocket::{form::Form, http::{ContentType, Status}};
use crate::{api::{standard_http_error, trivial_checkpoint, CreateResource}, mongo_sdk::MongoDatabase, resource_kit::Resource};


#[get("/resource/<id..>")]
pub async fn get_resource_by_id(id: PathBuf) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_resource_exists(id.display().to_string().as_str()).await {
    return standard_http_error::resource_not_found(id.display().to_string().as_str());
  }

  let collection = MongoDatabase::use_resources_collection();

  let result = collection
    .find_one(
      doc! {
        "resource_id": id.display().to_string()
      },
      None
    )
    .expect("Failed to find resource");

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

#[put("/resource/<id..>", data = "<input>")]
pub async fn update_resource_by_id(id: PathBuf, input: Form<CreateResource>) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_resource_exists(id.display().to_string().as_str()).await {
    return standard_http_error::resource_not_found(id.display().to_string().as_str());
  }

  let collection = MongoDatabase::use_resources_collection();

  let result = collection
    .update_one(
      doc! {
        "resource_id": id.display().to_string()
      },
      doc! {
        "$set": {
          "driver": input.driver.clone(),
          "resource_id": input.resource_id.clone(),
          "raw_content": input.raw_data.clone(),
          "file_path": input.file_path.clone(),
        }
      },
      None
    )
    .expect("Failed to update resource");

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

#[delete("/resource/<id..>")]
pub async fn delete_resource_by_id(id: PathBuf) -> (Status, (ContentType, String)) {
  if !trivial_checkpoint::is_resource_exists(id.display().to_string().as_str()).await {
    return standard_http_error::resource_not_found(id.display().to_string().as_str());
  }

    let collection = MongoDatabase::use_resources_collection();


  let result = collection
    .delete_one(
      doc! {
        "resource_id": id.display().to_string()
      },
      None
    )
    .expect("Failed to delete resource");

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

#[get("/resource/list")]
pub fn get_all_resources() -> (Status, (ContentType, String))  {
    let collection = MongoDatabase::use_resources_collection();


  let mut result = collection
    .find(doc! {}, None)
    .expect("Failed to find resources");
  
  let mut vector: Vec<Resource> = Vec::new();

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

#[get("/resource/driver/list")]
pub fn get_all_drivers_for_resources() -> (Status, (ContentType, String))  {
  let mut vector = vec![
    "html",
    "json",
    "proxy::html",
    "file::javascript",
    "file::css",
    "file::plain",
    "redirect::meta",
    "redirect::javascript",
    "php",
    "http_status_page",
    "webmanifest"
  ];

  // let plugins = get_all_runtime_plugins();

  // for plugin in plugins.iter() {
  //   let name = &plugin.name;
    
  //   if &plugin.attach_at != "render_driver" {
  //     continue;
  //   }

  //   vector.push(name.as_str());
  // }

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

#[post("/resource/params/<name..>", data="<input>")]
pub async fn set_route_params(name: PathBuf, input: Form<HashMap<String, String>>) -> (Status, (ContentType, String)) {
  let name = name.display().to_string();
  
  if !trivial_checkpoint::is_route_exists(&name).await {
    return standard_http_error::route_not_found(&name);
  }

  let collection = MongoDatabase::use_routes_collection();

  let route_name = name.clone();
  let params = input.into_inner();

  let mut document = document::Document::new();

  for (key, value) in params.iter() {
    document.insert(key, value);
  }

  let result = collection.update_one(
    doc! {
      "name": route_name
    },
    doc! {
      "$set": {
        "params": document
      }
    },
    None
  );

  let value = serde_json::json!({
    "isOk": true,
    "value": result.unwrap().modified_count,
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

#[post("/resource/create", data = "<input>")]
pub fn create_new_resource(input: Form<CreateResource>) -> (Status, (ContentType, String)) {
    let collection = MongoDatabase::use_resources_collection();

  let resource_count = collection.count_documents(doc! {
    "resource_id": &input.resource_id.clone()
  }, None).expect("Unable to count documents");

  if input.file_path.is_some() && input.raw_data.is_some() {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "You are trying to set 2 types of data at the same time: raw and a link to a file",
          "value": null
        }).to_string()
      )
    );
  }

  if input.file_path.is_none() && input.raw_data.is_none() {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Both content parameters of content were not set",
          "value": null
        }).to_string()
      )
    );
  }

  if input.file_path.is_some() {
    let path = input.file_path.clone().unwrap().to_string();
    
    if !Path::new(path.as_str()).exists() {
      return (
        Status::BadRequest, 
        (
          ContentType::JSON,
          serde_json::json!({
            "isOk": false,
            "error": "File path not found",
            "value": null
          }).to_string()
        )
      );
    }
  }

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

  let doc: Resource = Resource {
    driver: input.driver.clone(),
    resource_id: input.resource_id.clone(),
    raw_content: input.raw_data.clone(),
    file_path: if input.file_path.is_some() {
      let path = input.file_path.clone().unwrap().to_string();
      let some = fs::canonicalize(path).unwrap().display().to_string();

      Some(some)
    } else {
      None
    }
  };

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

