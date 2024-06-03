#[path = "../database.rs"]
mod database;
use serde::{Deserialize, Serialize};
use mongodb::{bson::doc, options::FindOneOptions, sync::Collection};

#[derive(Serialize, Deserialize, Debug)]
pub struct Resource {
    pub resource_id: String,
    pub driver: String,
    pub raw_content: Option<String>,
    pub file_path: Option<String>,
}


// Get resource
pub fn require_resource(resource_id: &str) -> Resource {
    let collection: Collection<Resource> =
        database::get_database(String::from("resources")).collection("resources");

    let resource: Resource = collection
        .find_one(
            doc! {
              "resource_id": resource_id
            },
            None,
        )
        .expect("Unable to find resource")
        .expect("Resource not found")
        .into();

    println!("FILE PATH {}", resource_id);

    return resource;
}

/**
 * Get resource raw data
 */
pub fn require_resource_raw(res: &Resource) -> (char, Option<String>) {
    if res.raw_content.is_none() && res.file_path.is_none() {
        return ('b', None);
    }

    if !res.raw_content.is_none() && !res.file_path.is_none() {
        return ('a', None);
    }

    let raw_data: String = if res.raw_content.is_some() {
        res.raw_content.as_ref().unwrap().to_owned()
    } else {
        std::fs::read_to_string(res.file_path.clone().unwrap()).expect("Unable to read file")
    };

    return ('p', Option::from(raw_data));
}
