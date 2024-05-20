#[macro_use] extern crate rocket;
#[macro_use] extern crate lazy_static;
#[macro_use] extern crate fake_useragent;

#[path = "dto/json_router.rs"] mod json_router;
#[path = "dto/mode.rs"] mod mode;
#[path = "args.rs"] mod args;
#[path = "router.rs"] mod router;
#[path = "database.rs"] mod database;
#[path = "collector.rs"] mod collector;
#[path = "api.rs"] mod api;

pub use args::Args;

use asn_db::Ipv4Addr;
use chrono::Utc;
use mongodb::{bson::doc, sync::Collection};
use rocket::{http::{ContentType, Status}, time::Instant, Config};
use serde::{Deserialize, Serialize};

use crate::database::get_database;

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
struct PostbackPayoutPostback {
  uuid: Option<String>,
  date: Option<String>,
  status: Option<String>,
  ip: Option<String>,
  amount: Option<u128>,
  stream: Option<String>,
  currency: Option<String>,
  time: Option<i64>
}

#[get("/robots.txt")]
fn robots() -> (Status, (ContentType, String)) {
  let robots = include_str!("../robots.txt");
  return (
    Status::Ok,
    (
      ContentType::Plain,
      String::from(robots)
    )
  )
}


#[get("/")]
fn not_found() -> (Status, (ContentType, String)) {
  return (
    Status::NotFound,
    (
      ContentType::Plain,
      "Not found".to_string()
    )
  )
}

#[get("/")]
async fn future_disallow() -> (Status, (ContentType, String)) {
  return (
    Status::Forbidden,
    (
      ContentType::Plain,
      "This feature is disabled in this build of Bellissimo".to_string()
    )
  )
}

#[get("/postback?<payload..>")]
async fn postback_get(payload: PostbackPayoutPostback) -> (Status, (ContentType, String)) {
  println!("{:?}", payload);  

  let collection: Collection<PostbackPayoutPostback> = get_database(String::from("requests")).collection("postbacks");
  let now = Utc::now();

  let _ = collection.insert_one(PostbackPayoutPostback {
    uuid: payload.uuid,
    date: payload.date,
    status: payload.status,
    ip: payload.ip,
    amount: payload.amount,
    stream: payload.stream,
    currency: payload.currency,
    time: Option::Some(now.timestamp_micros())
  }, None);

  return (
    Status::NoContent,
    (
      ContentType::Plain,
      String::from("")
    )
  )
}

async fn launch_rocket(args: &Args) {
  let config = Config {
    port: 8000,
    address: Ipv4Addr::new(0, 0, 0, 0).into(),
    ..Config::debug_default()
  };

  let rocket_server = rocket::custom(&config)
    .mount("/", routes![router::router])
    .mount("/", if !args.disable_robots { routes![robots] } else { routes![not_found] })

    .mount("/api", if !args.disable_api { routes![api::create_new_route] } else { routes![future_disallow] })
    .mount("/api", if !args.disable_api { routes![api::create_new_filter] } else { routes![future_disallow] })
    .mount("/api", if !args.disable_api { routes![api::create_new_resource] } else { routes![future_disallow] })
    
    .mount("/api", if !args.disable_api { routes![api::get_all_routes] } else { routes![future_disallow] })
    .mount("/api", if !args.disable_api { routes![api::get_all_filters] } else { routes![future_disallow] })
    .mount("/api", if !args.disable_api { routes![api::get_all_resources] } else { routes![future_disallow] })
    
    .mount("/service", if !args.disable_postbacks { routes![postback_get] } else { routes![future_disallow] });
      
  rocket_server.launch().await.unwrap();
}

/**
 * Main
 */
async fn rocket_main(args: &Args) {
  println!("Server mode");

  database::configure_database();

  launch_rocket(args).await;
}


async fn collector_main(args: &Args) {
  println!("Collector mode");
  
  collector::main().await;
}

#[rocket::main]
async fn main() { 
  let (args, mode) = args::parse_and_make();

  match mode {
    1 => rocket_main(&args).await,
    2 => {},
    3 => collector_main(&args).await,
    _ => {}
  }
}
