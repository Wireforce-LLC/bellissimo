use crate::{database::get_database, dto_factory::{asn_record::AsnRecord, resource::Resource}, dynamic_router::{REDIS, REDIS_CLIENT}, guard_kit::GuardScore, hp_kit};

use std::{fs, path::Path, thread, time::Duration};
use mongodb::{bson::{doc, Bson}, sync::Collection};
use redis::Commands;
use serde::Serialize;
use serde::Deserialize;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Device {
  pub user_agent: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
  pub name: String,
  pub real_ip: String,
  pub country_code: String,
  pub devices: Vec<Device>,
}

pub fn get_all_registred_users() -> Vec<User> {
  let collection: Collection<User> = get_database(String::from("classification")).collection("users");

  let users: Vec<User> = collection
    .find(None, None)
    .expect("Unable to find users")
    .map(|res| res.unwrap().into())
    .collect();

  return users;
}

fn register_user_if_needed(user: &User) -> bool {
  let collection: Collection<User> = get_database(String::from("classification")).collection("users");

  let is_user_exist = collection
    .count_documents(doc! {"real_ip": &user.real_ip}, None);

  if is_user_exist.unwrap() == 0 {
    collection.insert_one(user, None).expect("Unable to insert user");

    return true;
  }

  return false;
}

fn user_classification() {
  let collection: Collection<GuardScore> = get_database(String::from("requests")).collection("guard");

  let guard_scores: Vec<GuardScore> = collection
    .find({
      doc! {
        "score": doc! {
            "$gte": 65
        },
        "tags": [],
        "$or": [
            doc! {
                "is_tor": false
            },
            doc! {
                "is_tor": Bson::Null
            }
        ]
    }
    }, None)
    .expect("Unable to find guard scores")
    .map(|res| res.expect("Unable to find guard score").into())
    .collect();

  for guard_score in guard_scores {
    if guard_score.request_id.is_none() {
      continue;
    }

    let request_id = guard_score.request_id.unwrap();
    let request_body: Option<AsnRecord> = get_database(String::from("requests")).collection("requests").find_one(
      doc! {
        "request_id": request_id
      },
      None
    ).unwrap();

    if request_body.is_none() {
      continue;
    }

    let request_body = request_body.unwrap();
    
    if request_body.headers.is_none() {
      continue;
    }

    let headers = request_body.headers.unwrap();

    let empty = String::new();
    let cloudflare_ip = headers.get("cf-connecting-ip").unwrap_or(&empty);

    if cloudflare_ip.is_empty() {
      continue;
    }

    let user_agent = headers.get("user-agent").unwrap_or(&empty);

    if user_agent.is_empty() {
      continue;
    }

    let real_ip = cloudflare_ip.to_owned();
    let country_code = headers.get("cf-ipcountry").unwrap_or(&empty).to_owned();
    
    if country_code.is_empty() {
      continue;
    }

    let user = User {
      name: String::new(),
      real_ip,
      country_code,
      devices: vec![Device { user_agent: user_agent.to_owned() }],
    };

    let is_user_registered = register_user_if_needed(&user);

    if is_user_registered {
      println!("User registered: {}", &user.real_ip);
    }
  }

}

pub async fn register_background_service() {
  let interval = Duration::from_secs(30);

  loop {
    user_classification();

    thread::sleep(interval);
  }
}
