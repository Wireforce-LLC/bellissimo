use mongodb::{options::ClientOptions, bson::doc};
use mongodb::sync::{Client, Database};
use std::env;

lazy_static! {
    pub static ref DATABASE_CLIENT: Client = Client
        ::with_options(MongoDatabase::get_client_options())
        .expect("Unable to create client");
}

#[derive(Default)]
pub struct MongoDatabase {}

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
        return DATABASE_CLIENT.database(&name);
    }

    /**
     * Retrieves the collection with the specified name.
     */
    pub fn use_collection<T>(database: &str, collection: &str) -> mongodb::sync::Collection<T> {
        return DATABASE_CLIENT.database(&database).collection::<T>(&collection);
    }

    /**
     * Retrieves the names of all databases.
     * @return
     */
    pub fn get_databases() -> Vec<String> {
        let databases = DATABASE_CLIENT
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
