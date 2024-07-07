use std::path::PathBuf;
use mongodb::{bson::{doc, Document}, options::FindOptions};
use rocket::{http::{ContentType, HeaderMap, Status}, request::{FromRequest, Outcome}, Request};
use serde::{Deserialize, Serialize};
use crate::{click::Click, database::get_database, dynamic_router::ImplementationError};
use crate::click::ReceiveClick;
use crate::click_sdk;

struct HeadersMap<'r>(&'r HeaderMap<'r>);

#[derive(Serialize, Deserialize)]
struct Event {
  pub name: String
}

#[derive(Serialize, Deserialize)]
struct ClickGroupped {
  pub last_events: Vec<Event>,
  pub ip: String,
  pub country: Option<String>,
}

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

#[warn(private_interfaces)]
#[get("/click?<click..>", rank = 2)]
pub async fn click(click: ReceiveClick, raw_headers: HeadersMap<'_>) -> Option<(Status, (ContentType, String))> {
  let ip = raw_headers.0
    .get_one("cf-connecting-ip")
    .or_else(|| raw_headers.0.get_one("x-real-ip"))
    .or_else(|| raw_headers.0.get_one("x-forwarded-for"));    

  if click.name.is_none() {
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

  let name = click.name.unwrap();
  let ip = ip.unwrap();

  click_sdk::Click::click(
    ip,
    &name,
    (click.cursor_x.unwrap_or(0), click.cursor_y.unwrap_or(0))
  );

  click_sdk::Click::do_user_event(&name, ip, None).await;

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

#[get("/click/list/by/ip/<ip..>")]
pub fn get_clicks_by_ip(ip: PathBuf) -> (Status, (ContentType, String)) {
  let ip = ip.into_os_string().into_string().unwrap();
  let collection: mongodb::sync::Collection<Click> = get_database(String::from("requests")).collection("clicks");

  let mut clicks: Vec<Click> = Vec::new();

  let clicks_find = collection
    .find(
      doc! {
        "ip": ip
      },
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


#[get("/click/ipMapping")]
pub fn get_ip_mapped_clicks() -> (Status, (ContentType, String)) {
  let collection: mongodb::sync::Collection<Click> = get_database(String::from("requests")).collection("clicks");

  let pipeline: Vec<Document> = vec![
    doc! { "$match": { "ip": { "$exists": true }, "time": { "$exists": true } } },
    doc! { "$sort": { "time": -1 } },
    doc! { "$group": {
        "_id": "$ip",
        "last_actions": { "$push": { "name": "$name", "time": "$time" } }
    } },
    doc! { "$lookup": {
        "from": "asn_records",
        "localField": "_id",
        "foreignField": "headers.cf-connecting-ip",
        "as": "requests",
        "pipeline": [
            {
                "$match": {
                    "asn_country_code": { "$ne": null },
                    "is_ua_bot": false
                }
            }
        ]
    } },
    doc! { "$addFields": {
        "country": { "$first": "$requests" }
    } },
    doc! { "$limit": 500 },
    doc! { "$project": {
        "ip": "$_id",
        "list": { "$slice": ["$last_actions", 0, 5] },
        "country": "$country.asn_country_code",
        "requests": { "$slice": ["$requests", 0, 5] }
    } }
];


  let mut groups: Vec<ClickGroupped> = Vec::new();
  let groupped = collection.aggregate(pipeline, None).unwrap();

  for click in groupped {
    if let Ok(click) = click {
      let events: Vec<Event> = click.get("list").unwrap().as_array().unwrap().iter().map(|x| {
        let doc = x.as_document().unwrap();
        
        Event {
          name: if doc.get("name").is_some() {
            doc.get("name").unwrap().as_str().unwrap_or("").to_string()
          } else {
            "".to_string()
          }
        }
      }).collect();


      if events.len() < 2 {
        continue;
      }

      groups.push(ClickGroupped {
        last_events: events,
        ip: click.get("ip").unwrap().as_str().unwrap().to_string(),
        country: if click.get("country").is_some() {
          Some(click.get("country").unwrap().as_str().unwrap().to_string())
        } else {
          None
        },
      });
    }
  }

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": groups
      }).to_string()
    )
  )
}