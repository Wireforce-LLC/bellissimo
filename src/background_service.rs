use crate::{config::CONFIG, ipsum_kit::{optimize_registry_lists, read_ipsum_config, read_ipsum_registry}};

use std::{fs, thread, time::Duration};
use paris::info;
use tokio::{task::spawn_blocking, time::sleep};

pub fn fetch_ipsum() {
  let registry_root = CONFIG["dir_registry"].as_str().unwrap();
  
  for registry in read_ipsum_config() {
    let reg_object = registry.1.as_table().unwrap();
    let reg_name = registry.0;
    let reg_url = reg_object["url"].as_str().unwrap();

    info!("Updating registry '{}'", reg_name);

    let registry_content = read_ipsum_registry(reg_url);

    if registry_content.is_none() {
      continue;
    }

    if fs::write(
      format!("{}/{}.list", registry_root, reg_name), 
      registry_content.unwrap()
    ).is_ok() {
      info!("Registry '{}' updated", reg_name);
    }
  }

  optimize_registry_lists();
}

pub async fn register_background_service() {
  let interval = Duration::from_secs(30);
  let mut i = 0;
  
  loop {
    i += 1;
  
    if i % 64 == 0 {
      spawn_blocking(fetch_ipsum).await.unwrap();    
    }

    sleep(interval).await;
  }
}
