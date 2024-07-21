use tokio::task::spawn_blocking;
use crate::{background_service::fetch_ipsum, config::CONFIG, ipsum_kit};
use std::{fs, path::Path};

pub fn init_func() {
    let example_plugins_toml = include_str!("../../containers/example_plugins.toml");

    if !Path::new("./config.local.toml").exists() {
      fs::write("./config.local.toml", example_plugins_toml).expect("Unable to create config.local.toml");
    }
  
    let is_public_dir = Path::new(CONFIG["http_server_serve_path"].as_str().unwrap()).is_dir();
    let is_public_exist = Path::new(CONFIG["http_server_serve_path"].as_str().unwrap()).exists();
  
    if !is_public_dir && !is_public_exist {
      fs::create_dir(CONFIG["http_server_serve_path"].as_str().unwrap()).expect("Unable to create public directory");
    }
  
    unsafe {
      fs::create_dir(format!("{}/functions", CONFIG["http_server_serve_path"].as_str().unwrap())).unwrap_unchecked();
      fs::create_dir(format!("{}/objects", CONFIG["http_server_serve_path"].as_str().unwrap())).unwrap_unchecked();
    }
  
    let is_registry_dir = Path::new(CONFIG["dir_registry"].as_str().unwrap()).is_dir();
  
    if !is_registry_dir {
      fs::create_dir(CONFIG["dir_registry"].as_str().unwrap())
        .expect("Unable to create registry directory");
  
      spawn_blocking(fetch_ipsum);
    }
  
    if fs::read_dir(CONFIG["dir_registry"].as_str().unwrap()).unwrap().count() == 0 {
      spawn_blocking(fetch_ipsum);
    }
  
    ipsum_kit::optimize_registry_lists();
  }
  
    