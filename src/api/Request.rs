use std::{collections::{BTreeMap, HashMap}, fs, ops::Add, path::{Path, PathBuf}};
use chrono::{DateTime, Days, TimeZone, Utc};
use mongodb::{bson::{bson, doc, document, Document}, options::FindOptions, sync::Collection};
use rocket::{form::Form, http::{ContentType, Status}, FromForm};
use serde::{Deserialize, Serialize};
use crate::{asn_record::{AsnRecord, RouteWay}, database::get_database, domains_by_source::DomainsGroupedBySource, guard_kit::GuardScore};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
struct FilterRequests {
  pub filter_country: Option<String>,
  pub filter_specific_date: Option<String>,
  pub limit: Option<i64>,
  pub skip: Option<u64>,
}

fn select_requests(document: Document, limit: i64, skip: u64) -> Vec<AsnRecord<'static>> {
  let collection: Collection<AsnRecord> = get_database(String::from("requests"))
    .collection("asn_records");

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

#[get("/requests/summary?<query>")]
pub fn get_requests_summary(query: HashMap<String, String>) -> (Status, (ContentType, String)) {
  // let collection: Collection<AsnRecord> = get_database(String::from("requests"))
  //   .collection("asn_records");
  
  let mut ua_bots_counts: HashMap<String, i64> = HashMap::from([
    ("bot".to_string(), 0),
    ("not_bot".to_string(), 0),
  ]);

  let mut stat_by_host: HashMap<String, i64> = HashMap::new();
  let mut requests_per_day: HashMap<chrono::DateTime<Utc>, i64> = HashMap::new();
  let mut filter_ways:  HashMap<String, i64> = HashMap::new();

  let vector = select_requests(doc! {}, 10_000, 0);

  for record in vector {
    let date: DateTime<Utc> = Utc.timestamp_micros(record.clone().time).unwrap();

    let routes = record.route_way.clone();

    if routes.is_some() {
      // Create a separate binding for the filtered routes
      let filtered_routes: Vec<RouteWay> = routes
        .unwrap()
        .into_iter()
        .filter(|x| x.use_this_way)
        .collect();

      let right_way = filtered_routes.first().cloned();

      if let Some(way) = right_way {
        // Clone the name to create an owned value
        let way_name = way.name;

        if !filter_ways.contains_key(&way_name) {
            filter_ways.insert(way_name, 0);
        } else {
          // Update the counter for the route name
          *filter_ways.entry(way_name).or_insert(0) += 1;
        }
      }
    }

    if !requests_per_day.contains_key(&date) {
      requests_per_day.insert(date, 0);
    }

    if record.is_ua_bot.is_some() {
      let is_bot = record.is_ua_bot.unwrap();
      if is_bot {
        ua_bots_counts
          .entry("bot".to_string())
          .and_modify(|v| *v += 1)
          .or_insert(1);
      } else {
        ua_bots_counts
          .entry("not_bot".to_string())
          .and_modify(|v| *v += 1)
          .or_insert(1);
      }
    }


    if record.headers.is_some() {
      let headers = record.headers.unwrap();

      if headers.get("host").is_some() {
        if !stat_by_host.contains_key(&headers.get("host").unwrap().to_string()) {
          stat_by_host.insert(headers.get("host").unwrap().to_string(), 0);
        }
    
        stat_by_host.insert(headers.get("host").unwrap().to_string(), stat_by_host[&headers.get("host").unwrap().to_string()] + 1);         
      }
    }

    requests_per_day.insert(date, requests_per_day[&date] + 1);
  }

  let mut requests_per_day_string: HashMap<String, i64> = HashMap::new();

  for (key, value) in requests_per_day.iter() {
    let time = key.format("%Y-%m-%d").to_string();
    requests_per_day_string
      .entry(time)
      .and_modify(|v| *v += value)
      .or_insert(*value);
  }

  let bots_and_not_bots = ua_bots_counts.get("bot").unwrap_or(&0) + ua_bots_counts.get("not_bot").unwrap_or(&0);

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": {
          "requests_per_day": requests_per_day_string,
          "stat_by_host": stat_by_host,
          "filter_ways": filter_ways,
          "ua_bots": {
            "is_bot": ua_bots_counts.get("bot").unwrap_or(&0),
            "is_not_bot": ua_bots_counts.get("not_bot").unwrap_or(&0),
            "percentage": {
              "bot": ((*ua_bots_counts.get("bot").unwrap_or(&0) as f64) / (bots_and_not_bots as f64) * 100.0).round(),
              "not_bot": ((*ua_bots_counts.get("not_bot").unwrap_or(&0) as f64) / (bots_and_not_bots as f64) * 100.0).round(),
            }
          }
        }
      }).to_string()
    )
  )
}

#[get("/requests/guard/<rid..>")]
pub fn get_guard_by_request_id(rid: PathBuf) -> (Status, (ContentType, String)) {
  let collection: Collection<GuardScore> = get_database(String::from("requests")).collection("guard");

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

  let collection: Collection<GuardScore> = get_database(String::from("requests")).collection("guard");

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

#[get("/requests/selector/g/q/<query_selector..>")]
pub fn get_all_domains_grouped_by_source(query_selector: PathBuf) -> (Status, (ContentType, String)) {
  let query_selector = query_selector.display().to_string();

  if query_selector.contains(" ") || query_selector.contains("$") {
    return (
      Status::BadRequest,
      (
        ContentType::JSON,
        serde_json::json!({
          "isOk": false,
          "value": null,
          "error": "Invalid request. Query selector contains invalid characters"
        }).to_string()
      )
    )
  }

  let vector = select_requests(doc! {
    format!("query.{}", query_selector): {
      "$exists": true
    }
  }, 10_000, 0);

  let mut domains_by_source: Vec<DomainsGroupedBySource> = vec![];

  for record in vector {
    if record.headers.is_some() && record.query.is_some() {
      let headers = record.headers.unwrap();
      let query = record.query.unwrap();
      
      if headers.get("host").is_some() && query.contains_key(&query_selector) {
        let host = headers.get("host").unwrap().to_string();
        let source = query.get(&query_selector).unwrap().to_string();

        let index = domains_by_source.iter().position(|x| x.host == host && x.source == source);

        if index.is_some() {
          domains_by_source[index.unwrap()].count_request += 1;
        } else {
          domains_by_source.push(DomainsGroupedBySource {
            host,
            source,
            count_request: 1
          });
        }
      }
    }
  }

  let value = serde_json::json!({
    "isOk": true,
    "value": {
      "source": query_selector,
      "selected": domains_by_source
    },
    "error": null
  });

  let result = value.to_string();

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      result.to_string()
    )
  );
}