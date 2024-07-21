use std::collections::HashMap;
use chrono::Utc;
use mongodb::sync::Collection;
use serde::{Serialize, Deserialize};
use rocket::form::FromForm;
use crate::{mongo_sdk::MongoDatabase, remote_function::Trigger, scenario_sdk::Scenario};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Click {
    pub time: i64,
    pub ip: String,
    pub cursor_x: Option<i64>,
    pub cursor_y: Option<i64>,
    pub name: Option<String>,
}


/**
 * Position of cursor
 * (x, y)
 */
pub type CursorPosition = (i64, i64);

impl Click {
    pub fn now() -> i64 {
        return Utc::now().timestamp();
    }

    pub async fn do_user_event(name: &str, ip: &str, cursor: Option<CursorPosition>, namespace: &str) {
        let mut params = HashMap::new();

        if let Some(cursor) = cursor {
            params.insert("cursor_x".to_string(), cursor.0.to_string());
            params.insert("cursor_y".to_string(), cursor.1.to_string());
        }

        params.insert("ip".to_string(), ip.to_string());
        params.insert("name".to_string(), name.to_string());
        params.insert("time".to_string(), Click::now().to_string());
        params.insert("namespace".to_string(), namespace.to_string());

        // Scenario::execute_once(name, params.to_owned()).await;   

        Trigger::call_with_params(
            format!("click::{}", name).as_str(),
            params
        ).await.unwrap();
    }

    pub fn click(ip: &str, name: &str, cursor: CursorPosition) -> bool {   
        let collection: Collection<Click> = MongoDatabase::use_collection("requests", "clicks");

        let click: Click = Click {
            time: Click::now(),
            ip: ip.to_string(),
            cursor_x: Some(cursor.0),
            cursor_y: Some(cursor.1),
            name: Some(name.to_string())
        };        

       if !collection.insert_one(click, None).is_err() {
          return false
       }

       return true;
    }
}