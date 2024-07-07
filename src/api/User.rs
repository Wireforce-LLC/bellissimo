
use mongodb::sync::Collection;
use rocket::http::{ContentType, Status};
use crate::{background_service::User, database::get_database};

/**
 * Get all users
 * @return List of users
 */
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
