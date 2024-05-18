

use mongodb::{options::ClientOptions, bson::doc};
use mongodb::sync::{Client, Database};
use std::sync::{Mutex};
use std::env;

lazy_static! {
  pub static ref DATABASE_CLIENT: Mutex<Client> = Mutex::new(
    Client
      ::with_options(get_client_options())
      .expect("Unable to create client")
  );
}

pub fn get_client_options() -> ClientOptions {
  let connection_value = env::var("MONGO_URI").unwrap_or("mongodb://localhost:27018".to_string());
  
  return ClientOptions
    ::parse(connection_value)
    .expect("Unable to parse client options")
}

pub fn get_database(name: String) -> Database {
  return DATABASE_CLIENT
    .lock()
    .expect("Unable to lock database")
    .database(&name);
}

pub fn configure_database() {
  get_database(String::from("routes"))
    .create_collection("routes", None)
    .expect("Unable to create collection");

  get_database(String::from("resources"))
    .create_collection("resources", None)
    .expect("Unable to create collection");

  get_database(String::from("requests"))
    .create_collection("requests", None)
    .expect("Unable to create collection");

  get_database(String::from("requests"))
    .create_collection("asn_records", None)
    .expect("Unable to create collection");
}