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
}
