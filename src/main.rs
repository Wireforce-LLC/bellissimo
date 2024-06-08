#![allow(dead_code)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate lazy_static;

#[path = "args.rs"] mod args;
#[path = "router.rs"] mod router;
#[path = "database.rs"] mod database;
#[path = "dto_factory.rs"] mod dto_factory;

// Services
#[path = "background_service.rs"] mod background_service;

// API Routes
#[path = "api.rs"] mod api;

// Config Files
#[path = "config.rs"] mod config;

// Kits
#[path = "kit/render.rs"] mod rdr_kit;
#[path = "kit/resource_kit.rs"] mod resource_kit;
#[path = "kit/plugins.rs"] mod p_kit;

use chrono::Utc;
use config::CONFIG;
use elasticsearch::IndexParts;
use p_kit::register_plugins;
use rdr_kit::register_default_render_methods;
use router::{register_default_filter_plugins, ELASTIC};
use serde_json::json;
use tokio::{runtime::Handle, task};
use std::{fs, net::IpAddr, path::Path};
use colored::Colorize;
use mongodb::{bson::doc, sync::Collection};
use rocket::{config::Ident, data::Limits, fs::{FileServer, Options}, http::{ContentType, Status}, Config};
use background_service::register_background_service;
use crate::database::get_database;
use args::parse_launched_mode;

use dto_factory::{mode::StartupMode, postback_payout_postback::PostbackPayoutPostback};

// Configure Rocket
#[get("/robots.txt")]
fn robots() -> (Status, (ContentType, String)) {
  let robots = include_str!("../containers/robots.txt");
  return (
    Status::Ok,
    (
      ContentType::Plain,
      String::from(robots)
    )
  )
}

// Configure not found
#[get("/")]
pub fn not_found() -> (Status, (ContentType, String)) {
  return (
    Status::NotFound,
    (
      ContentType::HTML,
      include_str!("../containers/404.html").to_string()
    )
  )
}

// Ping the server
#[get("/ping")]
fn ping() -> (Status, (ContentType, String)) {
  return (
    Status::Ok,
    (
      ContentType::Plain,
      "Yes! I am a teapot".to_string()
    )
  )
}

#[get("/postback?<payload..>")]
async fn postback_get(payload: PostbackPayoutPostback) -> (Status, (ContentType, String)) {
  let utc_time = Utc::now().timestamp();
  let collection: Collection<PostbackPayoutPostback> = get_database(String::from("requests")).collection("postbacks");
  let payload_with_time = PostbackPayoutPostback {
    time: Some(utc_time.clone()),
    currency: if payload.currency.is_some() { Some(payload.currency.unwrap().to_uppercase()) } else { None },
    ..payload
  };

  let raw_json_as_string: String = serde_json::to_string(&payload_with_time).unwrap();

  let _ = collection.insert_one(payload_with_time, None)
    .expect("Failed to insert document");

  task::block_in_place(move || {
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
  )
}

// Launch the server
async fn register_routes_and_attach_server() {
  let http_workers = CONFIG["http_workers"].as_integer().unwrap() as usize;
  let http_ident = CONFIG["http_ident"].as_str().unwrap();
  let http_keep_alive = CONFIG["http_keep_alive"].as_integer().unwrap() as u32;

  let port: u16 = CONFIG["http_server_port"]
    .as_integer()
    .unwrap() as u16;

  let host: &str = CONFIG["http_server_address"]
    .as_str()
    .unwrap();
  
  let address: IpAddr = host.parse::<IpAddr>().unwrap();

  let server_path: &str = CONFIG["http_server_serve_path"].as_str().unwrap();
  
  // Configure Rocket
  let config = Config {
    port: port, // 8000 = default debug 
    address: address, // 127.0.0.1 = default debug
    limits: Limits::default(), // Limits::default() = default debug
    workers: if http_workers > 0 { http_workers } else { num_cpus::get() }, // num_cpus::get() = default debug
    ident: Ident::try_new(http_ident).unwrap(),
    keep_alive: http_keep_alive,

    ..Config::debug_default()
  };

  // Serve static files
  let static_server = FileServer::new(
    server_path, 
    Options::Index
  ).rank(-15);

  let http_server_serve_uri_path = CONFIG["http_server_serve_uri_path"].as_str().unwrap();
  let http_base_route_uri_path = CONFIG["http_base_route_uri_path"].as_str().unwrap();
  let http_api_uri_path = CONFIG["http_api_uri_path"].as_str().unwrap();

  let is_http_future_api = CONFIG["is_http_future_api"].as_bool().unwrap();
  let is_http_future_robots_txt = CONFIG["is_http_future_robots_txt"].as_bool().unwrap();
  let is_http_future_postbacks = CONFIG["is_http_future_postbacks"].as_bool().unwrap();
  let is_http_future_static_serve = CONFIG["is_http_future_static_serve"].as_bool().unwrap();
  let is_http_future_ping = CONFIG["is_http_future_ping"].as_bool().unwrap();
  let is_http_future_main_router = CONFIG["is_http_future_main_router"].as_bool().unwrap();

  // Launch Rocket
  let mut rocket_server = rocket::custom(&config);

  if is_http_future_static_serve {
    rocket_server = rocket_server.mount(http_server_serve_uri_path, static_server);
  }

  if is_http_future_ping {
    rocket_server = rocket_server.mount("/", routes![ping]);
  }

  if is_http_future_robots_txt {
    rocket_server = rocket_server.mount("/", routes![robots]);
  }

  if is_http_future_postbacks {
    rocket_server = rocket_server.mount("/service", routes![postback_get]);
  }

  if is_http_future_api {
    rocket_server = rocket_server
      .mount(http_api_uri_path, routes![api::get_postback_amount])

      .mount(http_api_uri_path, routes![api::get_all_files])
      .mount(http_api_uri_path, routes![api::get_file])
      .mount(http_api_uri_path, routes![api::write_file])
      .mount(http_api_uri_path, routes![api::get_files_as_placeholder])
      
      .mount(http_api_uri_path, routes![api::create_new_route])
      .mount(http_api_uri_path, routes![api::create_new_filter])
      .mount(http_api_uri_path, routes![api::create_new_resource])

      .mount(http_api_uri_path, routes![api::delete_resource_by_id])
      .mount(http_api_uri_path, routes![api::delete_filter_by_id])
      .mount(http_api_uri_path, routes![api::delete_route_by_name])
      
      .mount(http_api_uri_path, routes![api::get_all_routes])
      .mount(http_api_uri_path, routes![api::get_filter_by_id])
      .mount(http_api_uri_path, routes![api::get_route_by_name])
      .mount(http_api_uri_path, routes![api::get_all_filters])
      .mount(http_api_uri_path, routes![api::get_all_resources])
      .mount(http_api_uri_path, routes![api::get_resource_by_id])
      .mount(http_api_uri_path, routes![api::get_all_requests])
      .mount(http_api_uri_path, routes![api::get_all_postbacks])
      .mount(http_api_uri_path, routes![api::get_all_plugins_for_filters])
      .mount(http_api_uri_path, routes![api::get_all_drivers_for_resources]);
  }

  if is_http_future_main_router {
    rocket_server = rocket_server.mount(http_base_route_uri_path, routes![router::router]);
  }

  rocket_server
    .launch()
    .await
    .unwrap();
}

fn register_database_tables() {
  get_database(String::from("routes"))
    .create_collection("routes", None)
    .expect("Unable to create collection");

  get_database(String::from("resources"))
    .create_collection("resources", None)
    .expect("Unable to create collection");

  get_database(String::from("requests"))
    .create_collection("requests", None)
    .expect("Unable to create collection");

  get_database(String::from("requests"))
    .create_collection("asn_records", None)
    .expect("Unable to create collection");
}


fn bootstrap_fs() {
  let example_plugins_toml = vec![
    "[example]",
    "name = \"bellissimo\"",
    "version = \"0.1.0\"",
    "description = \"Bellissimo plugin for marketing\"",
    "attach_at = \"...\"",
    "engine = \"v8\"",
    "src = \"./test.js\"",
  ];

  if !Path::new("./plugins.toml").exists() {
    fs::write("./plugins.toml", example_plugins_toml.join("\n")).expect("Unable to create plugins.toml");
  }

  if !Path::new("./public").is_dir() && !Path::new("./public").exists() {
    fs::create_dir("./public").expect("Unable to create public directory");
  }

  if !Path::new(CONFIG["dir_plugins"].as_str().unwrap()).is_dir() && !Path::new(CONFIG["dir_plugins"].as_str().unwrap()).exists() {
    fs::create_dir(CONFIG["dir_plugins"].as_str().unwrap()).expect("Unable to create plugins directory");
  }
}

// Server
async fn bootstrap_mode_server() {
  bootstrap_fs();

  register_default_render_methods();
  register_default_filter_plugins();
  
  register_database_tables();
  register_routes_and_attach_server().await;
}

// Background service
async fn bootstrap_mode_background() {  
  register_background_service().await;
}

#[rocket::main]
async fn main() { 
  println!("{}", include_str!("../containers/banner.txt"));
  println!("");
  println!("Welcome to the tool that will make your marketing and traffic referral life easier and better!");
  println!("Welcome to Bellissimo!");
  println!("");

  let mode = parse_launched_mode();

  println!("Mode of service: {}", mode.to_string().yellow());
  println!("");

  register_plugins();

  match mode {
    // Server
    StartupMode::Server => {
      bootstrap_mode_server().await;
    }

    // Background
    StartupMode::Background => {
      bootstrap_mode_background().await;
    }
  }
}
