use crate::database::get_database;

/**
 * Bootstrap the database
 * Create the routes, resources and requests collections
 * Create the asn_records collection
 */
pub fn register_database_tables() {
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

  get_database(String::from("requests"))
    .create_collection("guard", None)
    .expect("Unable to create collection");
}
