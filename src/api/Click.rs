use mongodb::{bson::doc, options::FindOptions, sync::Collection};
use rocket::{form::Form, http::{ContentType, Status}, FromForm};
use crate::{click::Click, database::get_database, plugin::PluginRuntimeManifest};

#[get("/click/list")]
pub fn get_all_clicks() -> (Status, (ContentType, String)) {
  let collection: mongodb::sync::Collection<Click> = get_database(String::from("requests")).collection("clicks");

  let mut clicks: Vec<Click> = Vec::new();

  let clicks_find = collection
    .find(
      doc! {},
      FindOptions::builder()
        .sort(doc! { "time": -1 })
        .limit(500)
        .skip(0)
        .build()
    )
    .expect("Failed to find clicks");

  for click in clicks_find {
    if let Ok(click) = click {
      clicks.push(click);
    }
  }

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": clicks
      }).to_string()
    )
  )
}

