use std::{collections::HashMap, path::{Path, PathBuf}, sync::Arc};
use clap::builder::OsStr;
use rocket::{fs::NamedFile, http::{ContentType, Status}};
use serde_json::Value;
use crate::{config::CONFIG, rdr_kit, resource_kit};

lazy_static! {
    // Define static variables

    // Define robots.txt
    pub static ref ROBOTS_TXT: Arc<&'static str> = Arc::new(include_str!("../../containers/robots.txt"));

    // Define not found html template
    pub static ref NOT_FOUND_HTML: Arc<&'static str> = Arc::new(include_str!("../../containers/404.html"));
}

#[get("/object/get/<object..>")]
pub async fn object_get(object: PathBuf) -> Option<(Status, (ContentType, String))> {
  let resource_id = Path::new("")
    .join(object)
    .into_os_string()
    .into_string()
    .unwrap();

  let meta = HashMap::new();
  let resource = resource_kit::get_resource(resource_id.as_str());

  if resource.is_none() {
    return Some(not_found());
  }

  let resource = rdr_kit::render_resource_for_http(
    resource.unwrap(),
    meta
  ).await;
  
  return Some(
    resource
  )
}

#[get("/ga.js", rank = 1)]
pub async fn click_lib() -> Option<(Status, (ContentType, String))> {
  let ref_content: &str = include_str!("../../containers/Javascript/click-lib.js");

  let content = ref_content.to_owned();

  return Some((Status::Ok, (ContentType::JavaScript, content)));
}

#[get("/ds.js", rank = 1)]
pub async fn dataset_lib() -> Option<(Status, (ContentType, String))> {
  let ref_content: &str = include_str!("../../containers/Javascript/dataset-lib.js");

  let content = ref_content.to_owned();

  return Some((Status::Ok, (ContentType::JavaScript, content)));
}

#[get("/webmanifest?<query..>", rank = 1)]
pub async fn webmanifest(
  query: HashMap<String, String>
) -> Option<(Status, (ContentType, String))> {  
  if resource_kit::is_resource_exist("webmanifest") {
    let resource = resource_kit::require_resource("webmanifest");
    let out = rdr_kit::render_resource_for_http(resource, HashMap::new()).await;

    return Some(out);
  }

  let ref_content: &str = include_str!("../../containers/webmanifest");

  let mut ref_content: HashMap<String, Value> = serde_json::from_str(ref_content).unwrap_or(HashMap::new());
  let mut mutation = HashMap::new();

  for value in query {
    mutation.insert(value.0, Value::String(value.1));
  }

  ref_content.extend(mutation);

  let content = serde_json::json!(ref_content).to_string();

  return Some((Status::Ok, (ContentType::JSON, content)));
}


// Configure Rocket
#[get("/<path..>", rank = 0)]
pub async fn static_protector(path: PathBuf) -> Option<NamedFile> {
  if CONFIG["is_static_file_protection"].as_bool().unwrap() == false {
    return None
  }

  let protect_exts = CONFIG["static_file_protection_exts"]
    .as_array()
    .unwrap()
    .iter()
    .map(|ext| ext.as_str().unwrap())
    .collect::<Vec<&str>>();

  let path = Path::new(CONFIG["http_server_serve_path"].as_str().unwrap())
    .join(path);

  let binding = OsStr::from("txt");
  let ext = &path.extension();
  let ext = &ext.unwrap_or(&binding).to_str().unwrap();

  let path_as_string = path.clone().into_os_string();

  if !path.exists() {
    return None
  }

  let file = NamedFile::open(&path).await.unwrap();

  if &path_as_string.to_str().unwrap().contains("plugins") == &true {
    return None;
  }

  if &path_as_string.to_str().unwrap().contains("objects") == &true {
    return None;
  }

  if protect_exts.contains(&ext) {
    return None
  } else { 
    return Some(file);
  }
}

// Configure Rocket
#[get("/robots.txt")]
pub fn robots_txt() -> (Status, (ContentType, String)) {
  return (
    Status::Ok,
    (
      ContentType::Plain,
      ROBOTS_TXT.to_string()
    )
  )
}

// Configure not found
#[get("/")]
pub fn not_found() -> (Status, (ContentType, String)) {
  return (
    Status::NotFound,
    (
      ContentType::HTML,
      NOT_FOUND_HTML.to_string()
    )
  )
}

// Ping the server
#[get("/ping")]
pub fn ping() -> (Status, (ContentType, String)) {
  return (
    Status::Ok,
    (
      ContentType::Plain,
      "Pong".to_string()
    )
  )
}