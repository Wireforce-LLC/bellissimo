

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