use std::{collections::HashMap, process, thread, time::Duration};

#[macro_use] extern crate rocket;
#[macro_use] extern crate lazy_static;


#[path = "database.rs"] mod database;

// Services
#[path = "background_service.rs"] mod background_service;

// API Routes
#[path = "api.rs"] mod api;
#[path = "api/Route.rs"] mod api_route;
#[path = "api/Filter.rs"] mod api_filter;
#[path = "api/Resource.rs"] mod api_resource;
#[path = "api/Request.rs"] mod api_request;
#[path = "api/File.rs"] mod api_file;
#[path = "api/Click.rs"] mod api_click;
#[path = "api/Funnel.rs"] mod api_funnel;
#[path = "api/Scenario.rs"] mod api_scenario;
#[path = "api/Dataset.rs"] mod api_dataset;
#[path = "api/Explorer.rs"] mod api_explorer;
#[path = "api/AdManager.rs"] mod api_ad_manager;
#[path = "api/Playground.rs"] mod api_playground;

// Kit
#[path = "libs/Widget.rs"] mod widget_sdk;
#[path = "libs/MongoDatabase.rs"] mod mongo_sdk;
#[path = "libs/Click.rs"] mod click_sdk;
#[path = "libs/System.rs"] mod system;
#[path = "libs/Statistica.rs"] mod statistica_sdk;
#[path = "libs/Router.rs"] mod router_sdk;
#[path = "libs/Dataset.rs"] mod dataset_sdk;
#[path = "libs/AdCampaignManager.rs"] mod ad_campaign_manager;
#[path = "libs/RemoteFunctions.rs"] mod remote_function;
#[path = "libs/HttpOver.rs"] mod http_over_sdk;
#[path = "libs/Initialization.rs"] mod initialization_sdk;
#[path = "libs/File.rs"] mod file_sdk;
#[path = "libs/resource_kit.rs"] mod resource_kit;

// Config Files
#[path = "config.rs"] mod config;

// Kits
#[path = "kit/render.rs"] mod rdr_kit;
#[path = "kit/filter.rs"] mod filter_kit;
#[path = "kit/guard_score.rs"] mod guard_kit;
#[path = "kit/ipsum.rs"] mod ipsum_kit;

#[path = "boot/register_main_routes.rs"] mod main_routes;
#[path = "boot/register_router.rs"] mod dynamic_router;
#[path = "boot/register_filters.rs"] mod register_filters;

// DTO
#[path = "dto/filter.rs"] pub mod filter;
#[path = "dto/asn_record.rs"] pub mod asn_record;

use config::CONFIG;
// use initialization_sdk::Initialization;
use paris::{info, log};
use remote_function::{RemoteFunction, RemoteFunctions, Trigger};
use std::net::IpAddr;
use rocket::{config::Ident, data::Limits, fairing::AdHoc, Config};
use background_service::register_background_service;
use tokio::{task::{self}, time::sleep};

/**
 * Now the main.rs is responsible for launching the server
 * and bootstrapping the filesystem
 * 
 * Now Bellissimo will be create own Architecture, called A1
 */

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

  // Configure Rocket
  let config = Config {
    port: port, // 8000 = default debug 
    address: address, // 127.0.0.1 = default debug
    limits: Limits::default(), // Limits::default() = default debug
    workers: if http_workers > 0 { http_workers } else { 2 },
    ident: Ident::try_new(http_ident).unwrap(),
    keep_alive: http_keep_alive,
    log_level: rocket::config::LogLevel::Off,

    ..Config::debug_default()
  };

  let http_server_serve_uri_path: &str = CONFIG["http_server_serve_uri_path"].as_str().unwrap();
  let http_base_route_uri_path: &str = CONFIG["http_base_route_uri_path"].as_str().unwrap();
  let http_api_uri_path: &str = CONFIG["http_api_uri_path"].as_str().unwrap();

  let is_http_future_api: bool = CONFIG["is_http_future_api"].as_bool().unwrap();
  let is_http_future_robots_txt: bool = CONFIG["is_http_future_robots_txt"].as_bool().unwrap();
  let is_http_future_static_serve: bool = CONFIG["is_http_future_static_serve"].as_bool().unwrap();
  let is_http_future_ping: bool = CONFIG["is_http_future_ping"].as_bool().unwrap();
  let is_http_future_main_router: bool = CONFIG["is_http_future_main_router"].as_bool().unwrap();
  let is_http_future_kit =  CONFIG["is_http_future_kit"].as_bool().unwrap();

  // Launch Rocket
  let mut rocket_server = rocket::custom(&config);

  if is_http_future_kit {
    rocket_server = rocket_server.mount("/", routes![main_routes::webmanifest]);
  }

  if is_http_future_static_serve {
    // rocket_server = rocket_server.mount(http_server_serve_uri_path, static_server);
    rocket_server = rocket_server.mount(http_server_serve_uri_path, routes![main_routes::static_protector]);
  }

  if is_http_future_ping {
    rocket_server = rocket_server.mount("/", routes![main_routes::ping]);
  }

  if is_http_future_robots_txt {
    rocket_server = rocket_server.mount("/", routes![main_routes::robots_txt]);
  }

  rocket_server = rocket_server.mount("/", routes![api_click::click]);
  rocket_server = rocket_server.mount("/", routes![main_routes::click_lib]);
  rocket_server = rocket_server.mount("/", routes![main_routes::dataset_lib]);

  if is_http_future_api {
    rocket_server = rocket_server
      .mount(http_api_uri_path, routes![api_resource::update_resource_by_id])
      .mount(http_api_uri_path, routes![api_file::create_file])
      .mount(http_api_uri_path, routes![api_resource::set_route_params])
      .mount(http_api_uri_path, routes![api_request::get_all_guards])
      .mount(http_api_uri_path, routes![api_request::get_guard_by_request_id])
      .mount(http_api_uri_path, routes![api_filter::update_filter_by_id])
      .mount(http_api_uri_path, routes![api_request::get_all_routes])
      .mount(http_api_uri_path, routes![api_click::get_all_clicks])
      .mount(http_api_uri_path, routes![api_click::get_ip_mapped_clicks])
      .mount(http_api_uri_path, routes![api_click::get_clicks_by_ip])
      .mount(http_api_uri_path, routes![api_funnel::funnel_by_clicks_to_schemas])
      .mount(http_api_uri_path, routes![api_funnel::funnel_by_date])
      .mount(http_api_uri_path, routes![api_dataset::create_dataset])
      .mount(http_api_uri_path, routes![api_dataset::get_dataset_data_by_id])
      .mount(http_api_uri_path, routes![api_dataset::get_all_datasets])
      .mount(http_api_uri_path, routes![api_dataset::write_data_into_dataset])
      .mount(http_api_uri_path, routes![api_dataset::write_get_data_into_dataset])
      .mount(http_api_uri_path, routes![api_explorer::explore_dataset])
      .mount(http_api_uri_path, routes![api_explorer::create_template])
      .mount(http_api_uri_path, routes![api_explorer::list_templates])
      .mount(http_api_uri_path, routes![api_explorer::get_collections])
      .mount(http_api_uri_path, routes![api_explorer::get_datasets])
      .mount(http_api_uri_path, routes![api_ad_manager::create_campaign])
      .mount(http_api_uri_path, routes![api_ad_manager::list_campaigns])
      .mount(http_api_uri_path, routes![api_ad_manager::get_campaign_clicks_history])

      .mount(http_api_uri_path, routes![api_scenario::create_remote_function])
      .mount(http_api_uri_path, routes![api_scenario::list_remote_functions])
      .mount(http_api_uri_path, routes![api_scenario::get_remote_function])
      .mount(http_api_uri_path, routes![api_scenario::read_remote_function])
      .mount(http_api_uri_path, routes![api_scenario::delete_remote_function])
      .mount(http_api_uri_path, routes![api_scenario::write_remote_function])
      .mount(http_api_uri_path, routes![api_scenario::run_function_with_debugger])
      .mount(http_api_uri_path, routes![api_scenario::run_function])

      .mount(http_api_uri_path, routes![api_scenario::create_trigger])
      .mount(http_api_uri_path, routes![api_scenario::get_triggers])
      .mount(http_api_uri_path, routes![api_scenario::get_function_triggers])
      .mount(http_api_uri_path, routes![api_scenario::delete_trigger])

      .mount(http_api_uri_path, routes![api_file::get_all_files])
      .mount(http_api_uri_path, routes![api_file::get_file])
      .mount(http_api_uri_path, routes![api_file::write_file])
      .mount(http_api_uri_path, routes![api_file::get_files_as_placeholder])
      .mount(http_api_uri_path, routes![api_playground::playground])

      .mount(http_api_uri_path, routes![api_route::create_new_route])
      .mount(http_api_uri_path, routes![api_filter::create_new_filter])
      .mount(http_api_uri_path, routes![api_resource::create_new_resource])

      .mount(http_api_uri_path, routes![api_resource::delete_resource_by_id])
      .mount(http_api_uri_path, routes![api_filter::delete_filter_by_id])
      .mount(http_api_uri_path, routes![api_route::delete_route_by_name])
      
      .mount(http_api_uri_path, routes![api_route::get_all_routes])
      .mount(http_api_uri_path, routes![api_filter::get_filter_by_id])
      .mount(http_api_uri_path, routes![api_route::get_route_by_name])
      .mount(http_api_uri_path, routes![api_filter::get_all_filters])
      .mount(http_api_uri_path, routes![api_resource::get_all_resources])
      .mount(http_api_uri_path, routes![api_resource::get_resource_by_id])
      .mount(http_api_uri_path, routes![api_request::get_all_requests])
      .mount(http_api_uri_path, routes![api_filter::get_all_plugins_for_filters])
      .mount(http_api_uri_path, routes![api_resource::get_all_drivers_for_resources]);
  }

  if is_http_future_main_router {
    rocket_server = rocket_server.mount(http_base_route_uri_path, routes![dynamic_router::router_get]);
    rocket_server = rocket_server.mount(http_base_route_uri_path, routes![dynamic_router::router_post]);
    rocket_server = rocket_server.mount(http_base_route_uri_path, routes![main_routes::object_get]);
  }

  rocket_server
    .attach(AdHoc::on_liftoff("Liftoff Message", |_| Box::pin(async {
      
    })))
    .launch()
    .await
    .unwrap();
}


#[rocket::main]
async fn main() { 
 
  // Banner
  println!(include_str!("../containers/banner.txt"));
  println!("");

  log!("Welcome to the tool that will make your marketing and traffic referral life easier and better!");
  log!("Welcome to Bellissimo!");
  log!("PID: {}", process::id());

  log!("");
  
  initialization_sdk::initialize();

  task::spawn(async {
    info!("Starting background service...");
    register_background_service().await;
  });

  task::spawn(async move {
    info!("Starting scheduler...");

    let mut times = 0;

    loop {
      let mut params = HashMap::new();

      params.insert("times".to_string(), times.to_string());

      Trigger
        ::call_with_params(
          format!("every::{}m", times).as_str(),
          params.clone()
        )
        .await
        .unwrap();

      Trigger
        ::call_with_params(
          format!("every::{}", "minute").as_str(),
          params.clone()
        )
        .await
        .unwrap();

      times += 1;

      if (times % 60) == 0 {
        times = 0;
      }
      
      sleep(Duration::from_secs(60)).await;
    }
  });

  info!("Starting server...");

  Trigger::call_delayed("server::boot").unwrap();

  // Register default filters
  register_filters::register_default_filters();
  
  // Register default render methods
  rdr_kit::register_default_render_methods();

  register_routes_and_attach_server().await;
}
