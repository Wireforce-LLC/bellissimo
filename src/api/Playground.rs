use std::collections::HashMap;
use rocket::http::{ContentType, Status};
use serde::{Serialize, Deserialize};
use crate::http_over_sdk::HttpOver;

#[derive(Clone, Serialize, Deserialize)]
pub struct Playground {
    pub function: String,
    pub argv: Option<HashMap<String, String>>,
}


#[post("/playground", data = "<data>")]
pub fn playground(data: String) -> (Status, (ContentType, String)) {
    let data = serde_json::from_str::<Playground>(&data);

    let example = Playground {
        function: "call_function".to_string(),
        argv: Some(HashMap::new()),
    };

    if data.is_err() {
        return (
            Status::BadRequest,
            (
                ContentType::JSON,
                serde_json::json!({
                    "isOk": false,
                    "error": "Invalid data. Example: ".to_string() + &serde_json::to_string(&example).unwrap(),
                    "value": null
                }).to_string()
            )
        );
    }

    let data = data.unwrap();

    let result = HttpOver::call_by_name(&data.function, data.argv.unwrap_or(HashMap::new()));

    if result.is_err() {
        return (
            Status::BadRequest,
            (
                ContentType::JSON,
                serde_json::json!({
                    "isOk": false,
                    "error": result.err().unwrap(),
                    "value": null
                }).to_string()
            )
        );
    }

    let result = result.unwrap();

    return (
        Status::Ok, 
        (
            ContentType::JSON,
            serde_json::json!({
                "isOk": true,
                "error": null,
                "value": result
            }).to_string()
        )
    );
}