use std::collections::{self, HashMap};
use mongodb::{bson::{doc, Document}, options::AggregateOptions, sync::Collection};
use rocket::http::{ContentType, Status};
use serde::{Deserialize, Serialize};
use crate::mongo_sdk::MongoDatabase;

#[derive(FromForm)]
pub struct DatabaseCollectionsSelector {
  pub database: String
}


#[derive(FromForm)]
pub struct ExploreDatabase {
  pub database: String,
  pub collection: String
}

#[derive(Serialize, Deserialize)]
pub struct CreateTemplate {
    pub name: String,
    pub template: Vec<Document>
}

#[post("/explorer/template/create", data="<data>")]
pub fn create_template(data: String) -> (Status, (ContentType, String)) {
    let body = serde_json::from_str::<CreateTemplate>(&data);

    if body.is_err() {
        return (
            Status::BadRequest, 
            (
                ContentType::JSON, 
                serde_json::json!({
                    "isOk": false,
                    "value": null,
                    "error": "Invalid body"
                }).to_string()
            )
        );
    }

    let collection = MongoDatabase::use_collection::<CreateTemplate>(
        "explorer",
        "templates"
    );

    let template = body.unwrap();

    if collection.count_documents(doc! { "name": &template.name }, None).unwrap() > 0 {
        return (
            Status::Conflict, 
            (
                ContentType::JSON, 
                serde_json::json!({
                    "isOk": false,
                    "value": null,
                    "error": "Template already exists"
                }).to_string()
            )
        );
    }

    let result = collection.insert_one(template, None);

    if result.is_err() {
        return (
            Status::BadRequest, 
            (
                ContentType::JSON, 
                serde_json::json!({
                    "isOk": false,
                    "value": null,
                    "error": result.unwrap_err().to_string()
                }).to_string()
            )
        );
    }

    return (
        Status::Created, 
        (
            ContentType::JSON, 
            serde_json::json!({
                "isOk": true,
                "value": result.unwrap().inserted_id,
                "error": null
            }).to_string()
        )
    );
}

#[get("/explorer/template/list")]
pub fn list_templates() -> (Status, (ContentType, String)) {
  let collection = MongoDatabase::use_collection::<CreateTemplate>(
      "explorer",
      "templates"
  );
  let result = collection.find(doc! {}, None);

  if result.is_err() {
      return (
          Status::BadRequest, 
          (
              ContentType::JSON, 
              serde_json::json!({
                  "isOk": false,
                  "value": null,
                  "error": "Failed to list templates"
              }).to_string()
          )
      );
  }

  let mut templates: Vec<CreateTemplate> = Vec::new();

  for template in result.unwrap() {
      templates.push(template.unwrap());
  }
  
  let value = serde_json::json!({
    "isOk": true,
    "value": templates,
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

#[get("/explorer/databases/list")]
pub fn get_datasets() -> (Status, (ContentType, String)) {
  let databases = MongoDatabase::get_databases();

  let value = serde_json::json!({
    "isOk": true,
    "value": databases,
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

#[get("/explorer/collections/list?<database..>")]
pub fn get_collections(database: DatabaseCollectionsSelector) -> (Status, (ContentType, String)) {
  let collections = MongoDatabase::get_collections(&database.database);

  let value = serde_json::json!({
    "isOk": true,
    "value": collections,
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

#[post("/explorer/explore?<query..>", data="<document>", rank = 5)]
pub fn explore_dataset(document: String, query: ExploreDatabase) -> (Status, (ContentType, String)) {
  let pipeline = serde_json::from_str::<Vec<Document>>(&document);

  if pipeline.is_err() {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON, 
        serde_json::json!({
          "isOk": false,
          "value": null,
          "error": "Invalid documents structure"
        }).to_string()
      )
    );
  }

  let collection = MongoDatabase::use_collection::<HashMap<String, serde_json::Value>>(
    &query.database,
    &query.collection
  );

  let options = AggregateOptions::builder().build();
  let data = collection.aggregate(pipeline.unwrap(), options);

  if data.is_err() {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON, 
        serde_json::json!({
          "isOk": false,
          "value": null,
          "error": data.unwrap_err().to_string()
        }).to_string()
      )
    );
  }

  let mut cursor = data.unwrap();
  let mut vector = Vec::new();
  let mut index = 0;

  while let Some(doc) = cursor.next() {
    index += 1;

    if doc.is_err() {
      continue;
    }

    let doc = doc.unwrap();

    vector.push(doc);

    if index >= 250 {
      break;
    }
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
