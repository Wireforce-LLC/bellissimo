#[path = "dto/resource.rs"] mod resource;

use std::{thread, time::Duration};

use mongodb::{bson::doc, sync::Collection};
use redis::Commands;

use crate::{database::get_database, router::{get_website_content, REDIS, REDIS_CLIENT}};

pub async fn main() {
  let alloc_time = 60 * 15;
  let interval = Duration::from_secs(30);

  loop {
    let collection: Collection<resource::Resource> = get_database(String::from("resources"))
      .collection("resources");

    let documents = collection
      .find(doc! {}, None)
      .expect("Failed to find documents");

    for document in documents {
      let document_result = &document.unwrap();
      
      if &document_result.driver == "proxy::html" {
        let prefetch = document_result
          .raw_content
          .clone()
          .expect("Failed to get raw content");

        if REDIS.lock().expect("Unable to lock redis").exists("proxy_cache/*".replace("*", &prefetch)).unwrap() {
          println!("Pass prefetch '{}'", prefetch);
          continue;
        }

        let res: reqwest::Response = get_website_content(&prefetch).await;
      
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
