use std::path::Path;
use std::{fs, path};
use std::{collections::HashMap, env};
use chrono::Utc;
use fastcgi_client::{Client, Params, Request};
use mongodb::bson::doc;
use serde::{Serialize, Deserialize};
use tokio::net::TcpStream;
use tokio::io::{self};

use crate::mongo_sdk::MongoDatabase;
use crate::system;

#[derive(Default, Serialize, Deserialize)]
pub struct ScenarioLog {
  pub event_name: String,
  pub params: HashMap<String, String>,
  pub result: String,
  pub time: i64,
}

#[derive(Default)]
pub struct Scenario {}

lazy_static! {
    static ref PHP_FPM_ADDRESS: (String, String) = {
        (
            env::var("PHP_FPM_HOST").unwrap_or("localhost".to_string()),
            env::var("PHP_FPM_PORT").unwrap_or("9000".to_string()),
        )
    };
}

impl Scenario {
  /**
   * Writes the execution log for a scenario to a MongoDB 
   * collection named "logs" in the "scenario" database
   */
  fn write_execution_log(entity: ScenarioLog) {
    let collection = MongoDatabase::use_collection::<ScenarioLog>("scenario", "logs");

    collection
      .insert_one(entity, None)
      .unwrap();

    return;
  }

  pub async fn execute_once(name: &str, args: HashMap<String, String>) -> Option<String> {
    let stream = TcpStream::connect((
      PHP_FPM_ADDRESS.0.to_owned(),
      PHP_FPM_ADDRESS.1.parse::<u16>().unwrap()
    )).await.unwrap();

    let client = Client::new(stream);

    let query_string_from_meta = args
      .iter()
      .map(|(k, v)| format!("{}={}", k, v))
      .collect::<Vec<String>>()
      .join("&");

    let file_name = format!("{}.php", name);
    let file_path = system::PUBLIC_ABSOLUTE_FOLDER
      .join("scenario")
      .join("events")
      .join(&file_name)
      .into_os_string()
      .into_string()
      .unwrap();

    if !Path::new(&file_path).exists() {
      return None;
    }

    // Fastcgi params, please reference to nginx-php-fpm config.
    let params = Params::default()
      .request_method("POST")
      .script_filename(file_path)
      .script_name(&file_name)
      .request_uri(format!("/scenario/{}", &file_name))
      .query_string(query_string_from_meta)
      .content_length(500)
      .content_type("text/html")
      .server_software("bellissimo")
      .server_addr("127.0.0.1")
      .server_name("bellissimo");

    let stdin = io::empty();

    // Fetch fastcgi server(php-fpm) response.
    let request = Request::new(params, stdin);

    let output = client.execute_once(request).await.unwrap();
    let vec = output.stdout.unwrap_or(Vec::new());
    let result = String::from_utf8(vec).unwrap();
    
    let log = ScenarioLog {
      event_name: name.to_string(),
      params: args,
      result: result.clone(),
      time: Utc::now().timestamp()
    };

    Scenario::write_execution_log(log);

    return Some(result);
  }
}
