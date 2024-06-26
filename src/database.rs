

use mongodb::{options::ClientOptions, bson::doc};
use mongodb::sync::{Client, Database};
use std::sync::Mutex;
use std::env;

lazy_static! {
  pub static ref DATABASE_CLIENT: Mutex<Client> = Mutex::new(
    Client
      ::with_options(get_client_options())
      .expect("Unable to create client")
  );
}

/**
 * Retrieves the client options for
 * connecting to the MongoDB server.
 * 
 * This function fetches the client options required to
 * establish a connection to the MongoDB server.
 *
 * @returns {ClientOptions} The options for connecting to the MongoDB server.
 */
pub fn get_client_options() -> ClientOptions {
  // Retrieve the MongoDB URI from the environment variables, defaulting to a local URI.
  let connection_value = env::var("MONGO_URI").unwrap_or("mongodb://localhost:27018".to_string());
  
  // Parse the connection value into ClientOptions or panic if unable to parse.
  return ClientOptions
    ::parse(connection_value)
    .expect("Unable to parse client options")
}

/**
 * Retrieves the database with the specified name.
 * 
 * This function fetches the MongoDB database object based on the provided name.
 *
 * @param {String} name - The name of the database to retrieve.
 * @returns {Database} The database object associated with the specified name.
 */
pub fn get_database(name: String) -> Database {
  return DATABASE_CLIENT
    .lock()
    .expect("Unable to lock database")
    .database(&name);
}