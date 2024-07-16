use crate::api_ad_manager::AdCampaign;
use crate::asn_record::AsnRecord;
use crate::click::Click as ClickType;
use crate::dynamic_router::Route;
use crate::filter::Filter;
use crate::guard_kit::GuardScore;
use crate::resource_kit::Resource;
use mongodb::{options::ClientOptions, bson::doc};
use mongodb::sync::{Client, Collection, Database};
use paris::info;
use std::env;
use std::sync::Arc;

lazy_static! {
  pub static ref DATABASE_CLIENT: Client = MongoDatabase::spawn_connection();

  pub static ref POOL_CLIENTS: Arc<Vec<Client>> = Arc::new(MongoDatabase::create_pool_of_connections());
}

#[derive(Default, Debug)]
pub struct MongoDatabase {}

impl MongoDatabase {
  pub fn spawn_connection() -> Client {
    Client
      ::with_options(MongoDatabase::get_client_options())
      .expect("Unable to create client")
  }

  pub fn create_pool_of_connections() -> Vec<Client> {
    let mut clients = Vec::new();
    
    for i in 0..3 {
      clients.push(MongoDatabase::spawn_connection());
      info!("MongoDB connection '{}' created", i);
    }

    return clients;
  }

  pub fn use_client() -> Client {
    return DATABASE_CLIENT.clone();
  }

  pub fn get_pool_of_clients() -> Arc<Vec<Client>> {
    return POOL_CLIENTS.clone();
  }

  pub fn get_client_from_pool() -> Client {
    let clients = MongoDatabase::get_pool_of_clients();
    let index = rand::random::<usize>() % clients.len();
    return clients[index].clone();
  }
}

impl MongoDatabase {
  pub fn predict_load() {
    MongoDatabase::get_pool_of_clients().iter().for_each(|client| {
      client;
    });
  }
}

impl MongoDatabase {
  /**
   * Function to use the requests collection.
   *
   * @returns {Collection<AsnRecord>}
   *    The collection for ASN records.
   */
  pub fn use_requests_collection<'x>() -> Collection<AsnRecord<'x>> {
    MongoDatabase::use_collection::<AsnRecord>(
      "requests",
      "asn_records"
    )
  }

  pub fn use_routes_collection() -> Collection<Route> {
    MongoDatabase::use_collection::<Route>(
      "routes",
      "routes"
    )
  }

  pub fn use_guards_collection() -> Collection<GuardScore> {
    MongoDatabase::use_collection::<GuardScore>(
      "requests",
      "guard"
    )
  }

  pub fn use_resources_collection() -> Collection<Resource> {
    MongoDatabase::use_collection::<Resource>(
      "resources",
      "resources"
    )
  }
  
  /**
   * Function to use the clicks collection.
   *
   * @returns {Collection<ClickType>}
   *    The collection for click types.
   */
  pub fn use_clicks_collection() -> Collection<ClickType> {
    MongoDatabase::use_collection::<ClickType>(
      "requests",
      "clicks"
    )
  }

  pub fn use_filters_collection() -> Collection<Filter> {
    MongoDatabase::use_collection::<Filter>(
      "filters",
      "filters"
    )
  }

  /**
   * Function to use the campaigns collection.
   */
  pub fn use_campaigns_collection() -> Collection<AdCampaign> {
    MongoDatabase::use_collection::<AdCampaign>(
      "adsManager",
      "campaigns"
    )
  }
}

impl MongoDatabase {
  /**
   * Creates collections with the specified names.
   * 
   * This function creates collections with the specified names
   * in the specified database.
   *
   * @param {Array} collections - The names of the collections to create.
   * @param {String} database - The name of the database to create the collections in.
   */
  pub fn create_collections(collections: Vec<(&str, &str)>) {
    for collection in collections {
      let database = MongoDatabase::use_database(collection.1);
      
      unsafe {
        database
          .create_collection(collection.0, None)
          .unwrap_unchecked()
      }
    }
  }

  /**
   * Checks if a collection exists in the specified database.
   * 
   * This function checks if a collection with the specified name exists in the specified database.
   *
   * @param collection the collection to check
   * @param database the database
   */
  pub fn collection_exists(collection: &str, database: &str) -> bool {
    let database = MongoDatabase::use_database(database);
    let collection_names = database.list_collection_names(None).unwrap();
    
    collection_names.contains(&collection.to_string())
  }

  /**
   * Retrieves the database with the specified name.
   * 
   * This function fetches the MongoDB database object based on the provided name.
   * @param name the name of the database
   */
  pub fn get_collection_names(database: &str) -> Vec<String> {
    let database = MongoDatabase::use_database(database);
    let collection_names = database.list_collection_names(None).unwrap();

    let result: Vec<String> = collection_names
      .iter()
      .map(|name| name.to_string())
      .collect();

    result    
  }
} 

impl MongoDatabase {
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
    return ClientOptions::parse(connection_value)
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
  pub fn use_database(name: &str) -> Database {
    return MongoDatabase::get_client_from_pool()
      .database(&name);
  }

  /**
   * Retrieves the collection with the specified name.
   */
  pub fn use_collection<T>(database: &str, collection: &str) -> mongodb::sync::Collection<T> {
    return MongoDatabase::get_client_from_pool()
      .database(&database)
      .collection::<T>(&collection);
  }

  /**
   * Retrieves the names of all databases.
   * @return
   */
  pub fn get_databases() -> Vec<String> {
    let databases = MongoDatabase::get_client_from_pool()
      .list_database_names(None, None)
      .unwrap();

    let result: Vec<String> = databases
      .iter()
      .map(|name| name.to_string())
      .collect();

    result
  }

  /**
   * Creates collections with the specified names.
   * @param names
   * @return
   */
  pub fn get_collections(database: &str) -> Vec<String> {
    let database = MongoDatabase::use_database(database);
    let collection_names = database.list_collection_names(None).unwrap();

    let result: Vec<String> = collection_names
      .iter()
      .map(|name| name.to_string())
      .collect();

    result
  }
}
