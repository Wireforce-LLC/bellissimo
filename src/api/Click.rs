use chrono::Utc;
use mongodb::{bson::doc, options::FindOptions, sync::Collection};
use rocket::{form::Form, http::{ContentType, HeaderMap, Status}, request::{FromRequest, Outcome}, FromForm, Request};
use crate::{click::Click, database::get_database, dynamic_router::ImplementationError};
use crate::{click::ReceiveClick};

struct HeadersMap<'r>(&'r HeaderMap<'r>);

// Implement the `FromRequest` trait for `HeadersMap`
#[rocket::async_trait]
impl<'r> FromRequest<'r> for HeadersMap<'r> {
    type Error = ImplementationError;

    // Extract the request headers
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, ImplementationError> {
        let headers = req.headers();

        Outcome::Success(HeadersMap(headers))
    }
}

#[get("/click?<click..>", rank = 2)]
pub fn click(click: ReceiveClick, raw_headers: HeadersMap<'_>) -> Option<(Status, (ContentType, String))> {
  let collection: mongodb::sync::Collection<Click> = get_database(String::from("requests")).collection("clicks");

  let ip = raw_headers.0
    .get_one("cf-connecting-ip")
    .or_else(|| raw_headers.0.get_one("x-real-ip"))
    .or_else(|| raw_headers.0.get_one("x-forwarded-for"));

  if ip.is_none() {
    return Some(
      (
        Status::BadRequest,
        (
          ContentType::HTML,
          "BadRequest".to_string()
        )
      )
    )
  }

  let click = Click {
    time: Utc::now().timestamp(),
    ip: ip.unwrap().to_string(),
    cursor_x: click.cursor_x,
    cursor_y: click.cursor_y,
    name: click.name
  };

  collection.insert_one(click, None).unwrap();

  return Some(
    (
      Status::Ok,
      (
        ContentType::HTML,
        "OK".to_string()
      )
    )
  )
}

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

