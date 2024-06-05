#[path = "dto/filter.rs"] mod filter;
#[path = "dto/resource.rs"] mod resource;
#[path = "dto/asn_record.rs"] mod asn_record;
#[path = "dto/postback_payout_postback.rs"] mod postback_payout_postback;

use std::{fs, path::{Path, PathBuf}};
use mongodb::{bson::doc, options::FindOptions, sync::Collection};
use rocket::{form::Form, http::{ContentType, Status}, FromForm};
use serde::{Serialize, Deserialize};
use crate::{config::CONFIG, database::get_database, p_kit::{get_all_runtime_plugins, PluginRuntimeManifest, PLUGINS_RUNTIME}, resource_kit::Resource, router::Route};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
pub struct FileOverviewPath {
  pub path: Option<String>,
}

#[derive(FromForm)]
pub struct CreateRoute {
  pub name: String,
  pub path: String,
  pub filter_id: Option<String>,
  pub resource_id: Option<String>,
  pub domain: Option<String>
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

  let collection: Collection<Resource> = get_database(String::from("resources"))
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

  let collection: Collection<Route> = get_database(String::from("routes"))
    .collection("routes");

  let doc: Route = Route {
    path: input.path.clone(),
    name: input.name.clone(),
    params: None,
    filter_id: input.filter_id.clone(),
    resource_id: input.resource_id.clone(),
    domain: input.domain.clone(),
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

  let collection: Collection<Resource> = get_database(String::from("resources"))
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
  let collection: Collection<Resource> = get_database(String::from("resources"))
    .collection("resources");

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
    if !Path::new(&"./public/*".replace("*", input.file_path.as_ref().unwrap().as_str())).exists() {
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

  // let collection: Collection<Resource> = get_database(String::from("resources"))
  // .collection("resources");

  let doc: Resource = Resource {
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
  let collection: Collection<Route> = get_database(String::from("routes"))
    .collection("routes");

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

#[get("/resource/<id..>")]
pub fn get_resource_by_id(id: PathBuf) -> (Status, (ContentType, String)) {

  let collection: Collection<Resource> = get_database(String::from("resources"))
    .collection("resources");

  let result = collection
    .find_one(
      doc! {
        "resource_id": id.display().to_string()
      },
      None
    )
    .expect("Failed to find resource");

  if result.is_none() {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Resource not found",
          "value": null
        }).to_string()
      )
    )
  } else {
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
}

#[delete("/resource/<id..>")]
pub fn delete_resource_by_id(id: PathBuf) -> (Status, (ContentType, String)) {
  let collection: Collection<Resource> = get_database(String::from("resources"))
    .collection("resources");

  if collection.count_documents(
    doc! {
      "resource_id": id.display().to_string()
    },
    None
  ).expect("Unable to count documents") == 0 {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Resource not found",
          "value": null
        }).to_string()
      )
    )
  }

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
  let collection: Collection<Resource> = get_database(String::from("resources"))
    .collection("resources");

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

#[get("/file/read?<path..>")]
pub fn get_file(path: FileOverviewPath) -> (Status, (ContentType, String))  {
  let uri = path.path.unwrap_or("/".to_string());

  if uri.contains("..") {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Server can't handle .. for navigation",
          "value": null
        }).to_string()
      )
    )
  }

  let path = fs::canonicalize(
    &format!(
      "{}/{}",
      CONFIG["http_server_serve_path"].as_str().unwrap(),
      &uri
    )
  )
    .unwrap()
    .display()
    .to_string();

  let content = fs::read_to_string(path);

  if content.is_err() {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "File can't be read",
          "value": null
        }).to_string()
      )
    )
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": content.unwrap(),
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

#[get("/file/list/all?<path..>")]
pub fn get_all_files(
  path: FileOverviewPath
) -> (Status, (ContentType, String))  {
  let uri = path.path.unwrap_or("/".to_string());

  if uri.contains("..") {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Server can't handle .. for navigation",
          "value": null
        }).to_string()
      )
    )
  }

  let path = fs::canonicalize(
    &format!(
      "{}/{}",
      CONFIG["http_server_serve_path"].as_str().unwrap(),
      &uri
    )
  )
    .unwrap()
    .display()
    .to_string();

  println!("Path: {}", path);

  let files_in_public_folder = fs::read_dir(path);

  if files_in_public_folder.is_err() {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "File structure are currently not supported",
          "value": null
        }).to_string()
      )
    )
  }

  let files_in_public_folder = files_in_public_folder.unwrap();

  let mut vector = Vec::new();

  for file in files_in_public_folder {
    vector.push(file.unwrap().path().display().to_string());
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
    "redirect::meta",
    "redirect::javascript",
    "php",
    "http_status_page"
  ];

  let plugins = get_all_runtime_plugins();

  for plugin in plugins.iter() {
    let name = &plugin.name;
    
    if &plugin.attach_at != "render_driver" {
      continue;
    }

    vector.push(name.as_str());
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
pub fn get_route_by_name(name: PathBuf) -> (Status, (ContentType, String)) {
  let collection: Collection<Route> = get_database(String::from("routes"))
    .collection("routes");

  let result = collection
    .find_one(
      doc! {
        "name": name.display().to_string()
      },
      None
    )
    .expect("Failed to find route");

  if result.is_none() {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Route not found",
          "value": null
        }).to_string()
      )
    )
  } else {
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
}

#[delete("/route/<name..>")]
pub fn delete_route_by_name(name: PathBuf) -> (Status, (ContentType, String)) {
  let collection: Collection<Route> = get_database(String::from("routes"))
    .collection("routes");

  if collection.count_documents(
    doc! {
      "name": name.display().to_string()
    },
    None
  ).expect("Unable to count documents") == 0 {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Route not found",
          "value": null
        }).to_string()
      )
    )
  }

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

#[get("/filter/<id..>")]
pub fn get_filter_by_id(id: PathBuf) -> (Status, (ContentType, String)) {
  let collection: Collection<filter::Filter> = get_database(String::from("filters"))
    .collection("filters");

  let result = collection
    .find_one(
      doc! {
        "filter_id": id.display().to_string()
      },
      None
    )
    .expect("Failed to find filter");

  if result.is_none() {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Filter not found",
          "value": null
        }).to_string()
      )
    )
  } else {
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
}

#[delete("/filter/<id..>")]
pub fn delete_filter_by_id(id: PathBuf) -> (Status, (ContentType, String)) {
  let collection: Collection<filter::Filter> = get_database(String::from("filters"))
    .collection("filters");

  if collection.count_documents(
    doc! {
      "filter_id": id.display().to_string()
    },
    None
  ).expect("Unable to count documents") == 0 {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Filter not found",
          "value": null
        }).to_string()
      )
    )
  }

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
  let mut vector = vec![
    "ua",
    "ip",
    "ua::bot",
    "asn::owner",
    "cookie::string",
    "ip::country_code",
    "asn::country_code",
    "referrer",
    "session_id"
  ];

  let plugins = get_all_runtime_plugins();

  for plugin in plugins.iter() {
    let name = &plugin.name;
    
    if &plugin.attach_at != "plugin_filter" {
      continue;
    }

    vector.push(name.as_str());
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

#[get("/requests/asn/list")]
pub fn get_all_requests() -> (Status, (ContentType, String))  {
  let collection: Collection<asn_record::AsnRecord> = get_database(String::from("requests"))
    .collection("asn_records");

  let mut result = collection
    .find(
      doc! {},
      FindOptions::builder()
        .sort(doc! { "time": -1 })
        .limit(100)
        .skip(0)
        .build()
    )
    .expect("Failed to find ASN requests");
  
  let mut vector: Vec<asn_record::AsnRecord> = Vec::new();

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

#[get("/postback/list")]
pub fn get_all_postbacks() -> (Status, (ContentType, String))  {
  let collection: Collection<postback_payout_postback::PostbackPayoutPostback> = get_database(String::from("requests"))
    .collection("postbacks");

  let mut result = collection
    .find(
      doc! {},
      FindOptions::builder()
        .sort(doc! { "time": -1 })
        .limit(100)
        .skip(0)
        .build()
    )
    .expect("Failed to find ASN requests");
  
  let mut vector: Vec<postback_payout_postback::PostbackPayoutPostback> = Vec::new();

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