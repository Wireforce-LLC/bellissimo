use std::{collections::{BTreeMap, HashMap}, path::PathBuf};
use chrono::{DateTime, Days, TimeZone, Utc};
use mongodb::{bson::{doc, Document}, options::FindOptions, sync::Collection};
use rocket::{http::{ContentType, Status}, FromForm};
use serde::{Deserialize, Serialize};
use crate::{asn_record::{AsnRecord, RouteWay}, guard_kit::GuardScore, mongo_sdk::MongoDatabase};

#[derive(Debug, Serialize, Deserialize)]
pub struct DomainsGroupedBySource {
    pub host: String,
    pub source: String,
    pub count_request: usize,
}

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
pub struct FilterRequests {
  pub filter_country: Option<String>,
  pub filter_specific_date: Option<String>,
  pub limit: Option<i64>,
  pub skip: Option<u64>,
}

fn select_requests(document: Document, limit: i64, skip: u64) -> Vec<AsnRecord<'static>> {
  let collection = MongoDatabase::use_requests_collection();

  let mut result = collection
    .find(
      document,
      FindOptions::builder()
        .sort(doc! { "time": -1 })
        .limit(limit)
        .skip(skip)
        .build()
    )
    .expect("Failed to find ASN requests");

  let mut vector: Vec<AsnRecord> = Vec::new();

  while let Some(doc) = result.next() {
    vector.push(doc.expect("Unable to get document"));
  }

  return vector;
}

#[get("/requests/guard/<rid..>")]
pub fn get_guard_by_request_id(rid: PathBuf) -> (Status, (ContentType, String)) {
  let collection = MongoDatabase::use_guards_collection();

  let result = collection
    .find_one(
      doc! {
        "request_id": rid.display().to_string()
      },
      None
    )
    .expect("Failed to find guard");

  if result.is_none() {
    return (
      Status::NotFound, 
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "error": "Guard not found",
          "value": null
        }).to_string()
      )
    )
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": result.unwrap(),
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

#[get("/requests/guard/list")]
pub fn get_all_guards() -> (Status, (ContentType, String))  {
  let mut guards: Vec<GuardScore> = Vec::new();

  let collection = MongoDatabase::use_guards_collection();

  let mut result= collection
    .find(
      doc! {},
      FindOptions::builder()
        .sort(doc! { "time": -1 })
        .limit(100)
        .skip(0)
        .build()
    )
    .expect("Failed to find guard");


  while let Some(doc) = result.next() {
    guards.push(doc.expect("Unable to get document"));
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": guards,
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

#[get("/requests/asn/list?<query..>")]
pub fn get_all_requests(query: FilterRequests) -> (Status, (ContentType, String))  {
  let mut final_doc = doc! {};

  if query.limit.is_some() {
    if query.limit.unwrap() > 500 {
      return (
        Status::BadRequest, 
        (
          ContentType::JSON,
          serde_json::json!({
            "isOk": false,
            "value": null,
            "error": "Limit must be less than 500"
          }).to_string()
        )
      )
    }
  }

  if query.filter_specific_date.is_some() {
    let date = query
      .filter_specific_date
      .unwrap();

    let date = DateTime::parse_from_str(date.as_str(), "%a, %d %b %Y %H:%M:%S %z").unwrap();
    let date_2 = date.checked_add_days(Days::new(1)).unwrap();

    let date = doc! {
      "time": { "$gte": date.timestamp_micros(), "$lte": date_2.timestamp_micros() }
    };

    final_doc.extend(date);
  }
  
  if query.filter_country.is_some() {
    let country: String = query.filter_country.unwrap_or("".to_string());
    let country = doc! {
      "$or": [
          {"headers.cf-ipcountry": &country},
          {"asn_country_code": &country},
      ]
    };

    final_doc.extend(country);
  }

  let vector = select_requests(
    final_doc,
    query.limit.unwrap_or(24),
    query.skip.unwrap_or(0),
  );

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

#[get("/requests/routes/list")]
pub fn get_all_routes() -> (Status, (ContentType, String))  {
  let vector = select_requests(doc! {}, 10_000, 0);

  let mut route_count: BTreeMap<String, i8> = BTreeMap::new();

  for record in vector {
    if record.route_name.is_none() {
      continue;
    }
    
    *route_count.entry(record.route_name.unwrap()).or_insert(0) += 1;
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": route_count,
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