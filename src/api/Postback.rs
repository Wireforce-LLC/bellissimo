use crate::{database::get_database, dynamic_router, postback_payout_postback::PostbackPayoutPostback};
use dynamic_router::ELASTIC;
use elasticsearch::IndexParts;
use mongodb::{bson::doc, options::FindOptions, sync::Collection};
use rocket::http::{ContentType, Status};
use serde_json::json;
use chrono::{Duration, Utc};
use tokio::{runtime::Handle, task};

/**
 * Function to asynchronously register a 
 * postback listener with payload data.
 * Inserts payload data into a database collection
 * and sends it to an Elasticsearch index.
 */
async fn register_postback_listener(payload: PostbackPayoutPostback) -> (Status, (ContentType, String)) {
  let utc_time = Utc::now().timestamp();
  let collection: Collection<PostbackPayoutPostback> = get_database(String::from("requests")).collection("postbacks");
  
  let payload_with_time = PostbackPayoutPostback {
    time: Some(utc_time.clone()),
    currency: payload.currency.as_ref().map(|c| c.to_uppercase()),

    ..payload
  };
  
  let raw_json_as_string: String = serde_json::to_string(&payload_with_time).unwrap();
  
  let _ = collection.insert_one(payload_with_time, None)
    .expect("Failed to insert document");

  task::block_in_place(|| {
    Handle::current().block_on(async move {
      let insert_json_raw = json!(raw_json_as_string);

      ELASTIC
        .index(IndexParts::IndexId("postbacks", &utc_time.to_string()))
        .body(insert_json_raw.to_owned())
        .send()
        .await
        .unwrap();
    })
  });

  return (
    Status::Created,
    (
      ContentType::Plain,
      String::from("OK")
    )
  );
}


#[get("/postback?<payload..>")]
pub async fn postback_get(payload: PostbackPayoutPostback) -> (Status, (ContentType, String)) {
  return register_postback_listener(payload).await
}

#[post("/postback?<payload..>")]
pub async fn postback_post(payload: PostbackPayoutPostback) -> (Status, (ContentType, String)) {
  return register_postback_listener(payload).await
}

#[get("/postback/24h-amount")]
pub fn get_postback_amount() -> (Status, (ContentType, String))  {
  let collection: Collection<PostbackPayoutPostback> = get_database(String::from("requests"))
    .collection("postbacks");

  let result = collection
    .find(
      doc! {
        "time": {
          "$gte": (Utc::now() - Duration::days(1)).timestamp(),
          "$lte": Utc::now().timestamp()
        },
        "currency": "USD"
      },
      None
    )
    .unwrap();
  
  let mut amount: i32 = 0;

  for doc in result {
    if amount < 2147483647 {
      if doc.is_ok() {
        let amount_result = doc.unwrap().amount;

        if amount_result.is_some() {
          amount += amount_result.unwrap();  
        }
      }
    }
  }
  
  let value = serde_json::json!({
    "isOk": true,
    "value": amount,
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

#[get("/postback/list")]
pub fn get_all_postbacks() -> (Status, (ContentType, String))  {
  let collection: Collection<PostbackPayoutPostback> = get_database(String::from("requests"))
    .collection("postbacks");

  let mut result = collection
    .find(
      doc! {},
      FindOptions::builder()
        .sort(doc! { "time": -1 })
        .limit(100)
        .skip(0)
        .build()
    )
    .expect("Failed to find ASN requests");
  
  let mut vector: Vec<PostbackPayoutPostback> = Vec::new();

  while let Some(doc) = result.next() {
    vector.push(doc.expect("Unable to get document"));
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": vector,
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