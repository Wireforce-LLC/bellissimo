use crate::{database::get_database, dto_factory::resource::Resource, dynamic_router::{REDIS, REDIS_CLIENT}, hp_kit};

use std::{fs, path::Path, thread, time::Duration};
use mongodb::{bson::doc, sync::Collection};
use redis::Commands;


// Register resources from public
// ./public
fn register_resources_from_public() {
  let collection: Collection<Resource> = get_database(String::from("resources"))
    .collection("resources");

  let paths = fs::read_dir("./public/").unwrap();

  for path in paths {
    let p = path.unwrap().path();

    if &p.is_dir() == &true {
      if &p.join("index.html").is_file() == &false {
        continue;
      }

      let exists_documents = collection
        .count_documents(doc! {
          "resource_id": "local::*".replace("*", p.to_str().unwrap())
        }, None)

        .expect("Failed to count documents");

      if exists_documents == 0 {
        let path_raw = p.to_str().unwrap().replace("./public/", "") + "/index.html";

        let doc = Resource {
          driver: "html".to_string(),
          resource_id: "local::*".replace("*", p.to_str().unwrap()),
          raw_content: Option::None,
          file_path: Option::Some(
            String::from(
              Path::new(&path_raw).to_str().unwrap()
            )
          ),
        };

        collection.insert_one(doc, None).unwrap();

        println!("Name: {}", p.display())
      }
    }
  }
}

pub async fn register_background_service() {
  let alloc_time = 60 * 15;
  let interval = Duration::from_secs(30);

  loop {
    register_resources_from_public();
    
    let collection: Collection<Resource> = get_database(String::from("resources"))
      .collection("resources");

    let documents = collection
      .find(doc! {}, None)
      .expect("Failed to find documents");

    for document in documents {
      let document_result = &document.unwrap();
      
      if &document_result.driver == "proxy::html" {
        if document_result.raw_content.is_none() {
          continue;
        }
        
        let prefetch = document_result
          .raw_content
          .clone()
          .expect("Failed to get raw content");

        if REDIS.lock().expect("Unable to lock redis").exists("proxy_cache/*".replace("*", &prefetch)).unwrap() {
          println!("Pass prefetch '{}'", prefetch);
          continue;
        }

        let res: reqwest::Response = hp_kit::get_website_content(&prefetch).await;
      
        println!("Prefetch '{}'", prefetch);

        if res.status().is_success() {
          let mut conn = REDIS_CLIENT
            .lock()
            .expect("Unable to lock redis client")
            .get_connection()
            .expect("Unable to get redis connection");

          let result = &res.text().await.unwrap();

          let _: () = redis::pipe()
            .cmd("SETEX")
            .arg("proxy_cache/*".replace("*", &prefetch))
            .arg(alloc_time)
            .arg(&result)
            .query(&mut conn)
            .expect("Unable to set redis result");
        }
      }

      thread::sleep(Duration::from_secs(3));
    }

    thread::sleep(interval);
  }
}
