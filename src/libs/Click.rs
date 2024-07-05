use chrono::Utc;
use mongodb::sync::Collection;

use crate::{click::Click as ClickType, mongo_sdk::MongoDatabase};

#[derive(Default)]
pub struct Click {

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

    pub fn click(ip: &str, name: &str, cursor: CursorPosition) -> bool {   
        let collection: Collection<ClickType> = MongoDatabase::use_collection("requests", "clicks");

        let click = ClickType {
            time: Click::now(),
            ip: ip.to_string(),
            cursor_x: Some(cursor.0),
            cursor_y: Some(cursor.1),
            name: Some(name.to_string())
        };        

       if collection.insert_one(click, None).is_err() {
           return false
       }

       return true;
    }
}