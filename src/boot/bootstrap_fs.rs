use crate::config::CONFIG;

use std::{fs, path::Path};

/**
 * Bootstrap the filesystem
 * Create the public directory if it doesn't exist
 * Create the plugins directory if it doesn't exist
 * Create the plugins.toml if it doesn't exist
 */
pub fn bootstrap_fs() {
    let example_plugins_toml = include_str!("../../containers/example_plugins.toml");
  
    if !Path::new("./plugins.toml").exists() {
      fs::write("./plugins.toml", example_plugins_toml).expect("Unable to create plugins.toml");
    }
  
    let is_public_dir = Path::new(CONFIG["http_server_serve_path"].as_str().unwrap()).is_dir();
    let is_public_exist = Path::new(CONFIG["http_server_serve_path"].as_str().unwrap()).exists();
  
    if !is_public_dir && !is_public_exist {
      fs::create_dir(CONFIG["http_server_serve_path"].as_str().unwrap()).expect("Unable to create public directory");
    }

    unsafe {
      fs::create_dir(format!("{}/objects", CONFIG["http_server_serve_path"].as_str().unwrap())).unwrap_unchecked();
      fs::create_dir(format!("{}/plugins", CONFIG["http_server_serve_path"].as_str().unwrap())).unwrap_unchecked();
    }
  
    let is_pugins_dir = Path::new(CONFIG["dir_plugins"].as_str().unwrap()).is_dir();
    let is_pugins_exist = Path::new(CONFIG["dir_plugins"].as_str().unwrap()).exists();
  
    if !is_pugins_dir && !is_pugins_exist {
      fs::create_dir(CONFIG["dir_plugins"].as_str().unwrap())
        .expect("Unable to create plugins directory");
    }
  }
  