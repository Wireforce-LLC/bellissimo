use std::{fs, path::Path};
use rocket::{form::Form, http::{ContentType, Status}, FromForm};
use serde::{Deserialize, Serialize};
use crate::{config::CONFIG};
use glob::glob;

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateFile {
  pub name: String,
  pub pwd: String,
}

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

#[post("/file/create", data = "<input>")]
pub fn create_file(input: Form<CreateFile>) -> (Status, (ContentType, String)) {
  let uri = format!(
    "{}/{}",
    &input.pwd,
    &input.name
  );

  if uri.contains("..") {
    return (
      Status::BadRequest, 
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

  let path = String::from(
    &format!(
      "{}/{}",
      CONFIG["http_server_serve_path"].as_str().unwrap(),
      &uri
    )
  );

  if Path::new(&path).exists() {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "File already exists",
          "value": null
        }).to_string()
      )
    )
  }

  if Path::new(&path).parent().unwrap().exists() == false && !path.contains("/objects/") && !path.contains("/plugins/") {
    let parent_path_as_string = Path::new(&path).parent().unwrap().to_str().unwrap();

    fs::create_dir_all(parent_path_as_string).expect("Failed to create directory");
  }

  if path.contains("/objects/") && !path.ends_with(".json") {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "File must be a JSON file",
          "value": null
        }).to_string()
      )
    ) 
  }

  if path.contains("/plugins/") && !path.ends_with(".js") {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "File must be a JS file",
          "value": null
        }).to_string()
      )
    ) 
  }

  if path.contains("/scenario/") && !path.ends_with(".php") {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "File must be a PHP scenario file",
          "value": null
        }).to_string()
      )
    ) 
  }

  let result = fs::write(
    &path,
    ""
  );

  if result.is_err() {
    return (
      Status::InternalServerError, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Failed to create file",
          "value": null
        }).to_string()
      )
    )
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": null,
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

#[post("/file/write?<path..>", data = "<file>")]
pub fn write_file(path: FileOverviewPath, file: Form<WriteFileValue>) -> (Status, (ContentType, String)) {
  let uri = path.path.unwrap_or("/".to_string());

  if uri.contains("..") {
    return (
      Status::BadRequest, 
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

  if !Path::new(&path).exists() {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "File not found",
          "value": null
        }).to_string()
      )
    )
  }

  let content = file.content.clone().unwrap();

  fs::write(path, content).expect("Unable to write file");

  let value = serde_json::json!({
    "isOk": true,
    "value": null,
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

#[get("/file/list/short")]
pub fn get_files_as_placeholder() -> (Status, (ContentType, String)) {
  let base = CONFIG["http_server_serve_path"].as_str().unwrap();

  let files = glob(&"@/**/index.*".replace("@", &base)).expect("Failed to read glob pattern");

  let files = files
    .map(|file| file.unwrap())
    .filter(|file| file.is_file())
    .map(|file| file
      .canonicalize()
      .unwrap()
      .into_os_string()
      .into_string()
      .unwrap()
      .to_string()
    )
    .collect::<Vec<String>>();

  let value = serde_json::json!({
    "isOk": true,
    "value": files,
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

  if uri.trim() == "" {  
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Invalid path",
          "value": null
        }).to_string()
      )
    )
  }

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
    let file_result = file
      .unwrap()
      .path()
      .display()
      .to_string();

    let file_canonical = &file_result.replace(
      fs::canonicalize(CONFIG["http_server_serve_path"].as_str().unwrap()).unwrap().display().to_string().as_str(),
      ""
    );

    let file_raw_path = file_result.to_string();

    let is_file = Path::new(file_raw_path.as_str()).is_file();
    
    vector.push(
      FSEntity {
        path: Some(file_canonical.to_owned()),
        is_file: is_file
      }
    );
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
