use std::{path::{self, Path, PathBuf}, sync::Arc};

use clap::builder::OsStr;
use rocket::{fs::NamedFile, http::{ContentType, Status}};

use crate::config::CONFIG;

lazy_static! {
    // Define static variables

    // Define robots.txt
    pub static ref ROBOTS_TXT: Arc<&'static str> = Arc::new(include_str!("../../containers/robots.txt"));

    // Define not found html template
    pub static ref NOT_FOUND_HTML: Arc<&'static str> = Arc::new(include_str!("../../containers/404.html"));
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
  let forbidden_page = include_str!("../../containers/403.html");
  let ext =  path.extension().unwrap_or(&binding).to_str().unwrap();
  
  if !path.exists() {
    return None
  }

  if protect_exts.contains(&ext) {
    return None
  } else { 
    return Some(NamedFile::open(path).await.unwrap());
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