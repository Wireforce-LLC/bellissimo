use crate::mongo_sdk::MongoDatabase;

/**
 * Bootstrap the database
 * Create the routes, resources and requests collections
 * Create the asn_records collection
 */
pub fn register_database_tables() {
  MongoDatabase::create_collections(
    vec! [
      ("routes", "routes"),
      ("resources", "resources"),
      ("requests", "requests"),
      ("requests", "asn_records"),
      ("requests", "guard"),
      ("scenario", "logs"),
    ]
  )
}
