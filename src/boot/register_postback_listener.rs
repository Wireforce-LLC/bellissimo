use crate::{database::get_database, dto_factory, dynamic_router};

use dynamic_router::ELASTIC;
use elasticsearch::IndexParts;
use mongodb::sync::Collection;
use rocket::http::{ContentType, Status};
use serde_json::json;
use chrono::Utc;
use tokio::{runtime::Handle, task};
use dto_factory::postback_payout_postback::PostbackPayoutPostback;

/**
 * Function to asynchronously register a 
 * postback listener with payload data.
 * Inserts payload data into a database collection
 * and sends it to an Elasticsearch index.
 */
pub async fn register_postback_listener(payload: PostbackPayoutPostback) -> (Status, (ContentType, String)) {
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
        .lock()
        .unwrap()
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
