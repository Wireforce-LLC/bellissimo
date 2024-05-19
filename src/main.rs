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
use rocket::{http::{ContentType, Status}, Config};

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

#[get("/postback")]
async fn postback_get() -> (Status, (ContentType, String)) {
  return (
    Status::NoContent,
    (
      ContentType::Plain,
      String::from("")
    )
  )
}

#[get("/routes/list")]
async fn list_routes() -> (Status, (ContentType, String)) {
  return (
    Status::NoContent,
    (
      ContentType::Plain,
      "".to_string()
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
  
    .mount("/api", if !args.disable_api { routes![api::create_new_route] } else { routes![future_disallow] })
    .mount("/api", if !args.disable_api { routes![api::get_all_routes] } else { routes![future_disallow] })
    
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
