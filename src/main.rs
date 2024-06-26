#![allow(dead_code)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate lazy_static;

#[path = "args.rs"] mod args;
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
#[path = "api/Postback.rs"] mod api_postback;
#[path = "api/User.rs"] mod api_user;
#[path = "api/Plugin.rs"] mod api_plugin;
#[path = "api/Click.rs"] mod api_click;

// Config Files
#[path = "config.rs"] mod config;

// Kits
#[path = "kit/render.rs"] mod rdr_kit;
#[path = "kit/resource_kit.rs"] mod resource_kit;
#[path = "kit/plugin.rs"] mod plugin;
#[path = "kit/filter.rs"] mod filter_kit;
#[path = "kit/http_proxy.rs"] mod hp_kit;
#[path = "kit/guard_score.rs"] mod guard_kit;
#[path = "kit/ipsum.rs"] mod ipsum_kit;

#[path = "boot/register_main_routes.rs"] mod main_routes;
#[path = "boot/register_router.rs"] mod dynamic_router;
#[path = "boot/register_filters.rs"] mod register_filters;
#[path = "boot/bootstrap_fs.rs"] mod bfs;
#[path = "boot/bootstrap_db.rs"] mod bootstrap_db;

// DTO
#[path = "dto/postback_payout_postback.rs"] pub mod postback_payout_postback;
#[path = "dto/mode.rs"] pub mod mode;
#[path = "dto/resource.rs"] pub mod resource;
#[path = "dto/filter.rs"] pub mod filter;
#[path = "dto/asn_record.rs"] pub mod asn_record;
#[path = "dto/create_file.rs"] pub mod create_file;
#[path = "dto/domains_group.rs"] pub mod domains_by_source;
#[path = "dto/click.rs"] pub mod click;

use config::CONFIG;
use ipsum_kit::REGISTRIES;
use mode::StartupMode;
use std::{net::IpAddr, time::Instant};
use colored::Colorize;
use rocket::{config::Ident, data::Limits, fairing::AdHoc, Config};
use background_service::register_background_service;
use args::parse_launched_mode;

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
    workers: if http_workers > 0 { http_workers } else { num_cpus::get() }, // num_cpus::get() = default debug
    ident: Ident::try_new(http_ident).unwrap(),
    keep_alive: http_keep_alive,

    ..Config::debug_default()
  };

  let http_server_serve_uri_path: &str = CONFIG["http_server_serve_uri_path"].as_str().unwrap();
  let http_base_route_uri_path: &str = CONFIG["http_base_route_uri_path"].as_str().unwrap();
  let http_api_uri_path: &str = CONFIG["http_api_uri_path"].as_str().unwrap();

  let is_http_future_api: bool = CONFIG["is_http_future_api"].as_bool().unwrap();
  let is_http_future_robots_txt: bool = CONFIG["is_http_future_robots_txt"].as_bool().unwrap();
  let is_http_future_postbacks: bool = CONFIG["is_http_future_postbacks"].as_bool().unwrap();
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

  if is_http_future_api {
    rocket_server = rocket_server
      .mount(http_api_uri_path, routes![api::get_config])
      .mount(http_api_uri_path, routes![api_plugin::get_all_plugins])
      .mount(http_api_uri_path, routes![api_resource::update_resource_by_id])
      .mount(http_api_uri_path, routes![api_file::create_file])
      .mount(http_api_uri_path, routes![api_request::get_requests_summary])
      .mount(http_api_uri_path, routes![api_resource::set_route_params])
      .mount(http_api_uri_path, routes![api_request::get_all_guards])
      .mount(http_api_uri_path, routes![api_request::get_guard_by_request_id])
      .mount(http_api_uri_path, routes![api_user::get_users])
      .mount(http_api_uri_path, routes![api_filter::update_filter_by_id])
      .mount(http_api_uri_path, routes![api_request::get_all_domains_grouped_by_source])
      .mount(http_api_uri_path, routes![api_request::get_all_routes])
      .mount(http_api_uri_path, routes![api_click::get_all_clicks])
      .mount(http_api_uri_path, routes![api_click::get_ip_mapped_clicks])

      .mount(http_api_uri_path, routes![api_postback::get_postback_amount])

      .mount(http_api_uri_path, routes![api_file::get_all_files])
      .mount(http_api_uri_path, routes![api_file::get_file])
      .mount(http_api_uri_path, routes![api_file::write_file])
      .mount(http_api_uri_path, routes![api_file::get_files_as_placeholder])
      
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
      .mount(http_api_uri_path, routes![api_postback::get_all_postbacks])
      .mount(http_api_uri_path, routes![api_filter::get_all_plugins_for_filters])
      .mount(http_api_uri_path, routes![api_resource::get_all_drivers_for_resources]);
  }

  if is_http_future_postbacks {
    rocket_server = rocket_server.mount("/service", routes![api_postback::postback_get]);
    rocket_server = rocket_server.mount("/service", routes![api_postback::postback_post]);
  }


  if is_http_future_main_router {
    rocket_server = rocket_server.mount(http_base_route_uri_path, routes![dynamic_router::router]);
    rocket_server = rocket_server.mount(http_base_route_uri_path, routes![main_routes::object_get]);
  }

  rocket_server
    .attach(AdHoc::on_liftoff("Liftoff Message", |_| Box::pin(async {
      
    })))
    // .ignite()
    // .await
    // .unwrap()
    .launch()
    .await
    .unwrap();
}


#[rocket::main]
async fn main() { 
  let boot_start_instant: Instant = Instant::now();

  // Banner
  println!("{}", include_str!("../containers/banner.txt"));
  println!("");
  println!("Welcome to the tool that will make your marketing and traffic referral life easier and better!");
  println!("Welcome to Bellissimo!");
  println!("");

  let mode = parse_launched_mode();

  println!("Mode of service: {}", mode.to_string().yellow());

  // Register Plugins
  plugin::register_plugins();

  // Register default filters
  register_filters::register_default_filters();

  let elapsed = boot_start_instant.elapsed();

  let filters_len = filter_kit::get_all_filters().len();
  let plugins_len = plugin::get_all_runtime_plugins().len();

  // Get runtime plugins
  let plugins: String = plugin::get_all_runtime_plugins()
    .iter()
    .map(|plugin: &plugin::PluginRuntimeManifest| plugin.name.clone())
    .collect::<Vec<String>>()
    .join(", ");

  // Get runtime filters
  let filters = filter_kit::get_all_filters()
    .keys()
    .map(|filter| filter.clone())
    .collect::<Vec<String>>()
    .join(", ");

  match mode {
    // Server
    StartupMode::Server => {
      // Bootstrap FS (file system)
      bfs::bootstrap_fs().await;

      // Register default render methods
      rdr_kit::register_default_render_methods();
      
      // Bootstrap DB
      bootstrap_db::register_database_tables();

      let ipsum_registry_count = REGISTRIES.len();

      println!("Bootstrap time: {:.4?}", elapsed);
      println!("Runtime plugins ({}): {}", plugins_len.to_string().blue(), plugins);
      println!("Runtime filtes ({}): {}", filters_len.to_string().blue(), filters);
      println!("Runtime IPSUM registries: {} items", ipsum_registry_count.to_string().blue());
      println!("");
    
      register_routes_and_attach_server().await;
    }

    // Background
    StartupMode::Background => {
      println!("Bootstrap time: {:.2?}", elapsed);
      println!("");

      register_background_service().await;
    }
  }
}
