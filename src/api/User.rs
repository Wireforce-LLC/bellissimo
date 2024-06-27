
use std::{collections::HashMap, fs, path::{Path, PathBuf}};
use chrono::{DateTime, TimeZone, Utc};
use mongodb::{bson::{doc, document}, options::FindOptions, sync::Collection};
use rocket::{form::Form, http::{ContentType, Status}, FromForm};
use crate::{asn_record::{AsnRecord, RouteWay}, background_service::User, database::get_database, guard_kit::GuardScore};

#[get("/user/list")]
pub fn get_users() -> (Status, (ContentType, String)) {
  let collection: Collection<User> = get_database(String::from("classification")).collection("users");

  let users: Vec<User> = collection
    .find(None, None)
    .expect("Unable to find users")
    .map(|res| res.unwrap().into())
    .collect();

  let value = serde_json::json!({
    "isOk": true,
    "value": users,
    "error": null
  });

  let result = value.to_string();

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      result
    )
  );
}
