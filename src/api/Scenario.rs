use std::collections::HashMap;

use rocket::{form::Form, http::{ContentType, Status}};
use serde::{Deserialize, Serialize};
use crate::{remote_function::{CreateRemoteFunction, RemoteFunction, RemoteFunctions}, scenario_sdk::Scenario};

#[derive(Debug, FromForm)]
pub struct GetRemoteFunction {
    pub id: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WriteRemoteFunction {
    pub id: String,
    pub content: String
}


#[derive(Debug, Serialize, Deserialize)]
pub struct RunDebug {
    pub id: String,
    pub argv: HashMap<String, String>
}

#[delete("/function/delete?<selector..>")]
pub fn delete_remote_function(selector: GetRemoteFunction) -> (Status, (ContentType, String)) {
    let result: Result<(), String> = RemoteFunctions::delete_remote_function(
        &selector.id,
        true
    );

    if result.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": null,
            "error": result.unwrap_err()
        });

        let result: String = value.to_string();

        return (Status::BadRequest, (ContentType::JSON, result));
    }

    let value = serde_json::json!({
        "isOk": true,
        "value": null,
        "error": null
    });
    
    let result: String = value.to_string();

    return (Status::Ok, (ContentType::JSON, result));
}


#[post("/function/create", data="<input>")]
pub fn create_remote_function(input: String) -> (Status, (ContentType, String)) {
    let intent_json = serde_json::from_str(&input);

    if intent_json.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": null,
            "error": intent_json.unwrap_err().to_string()
        });

        let result: String = value.to_string();

        return (Status::BadRequest, (ContentType::JSON, result));
    }

    let intent_json: serde_json::Value = intent_json.unwrap();

    let remote_function = CreateRemoteFunction {
        name: intent_json["name"].as_str().unwrap().to_string(),
        id: intent_json["id"].as_str().unwrap().to_string(),
        runtime: intent_json["runtime"].as_u64().unwrap() as u8
    };

    let result = RemoteFunctions::create_remote_function(
        remote_function
    );

    if result.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": result,
            "error": result.unwrap_err()
        });

        let result: String = value.to_string();

        return (Status::InternalServerError, (ContentType::JSON, result));
    }

    let value = serde_json::json!({
        "isOk": true,
        "value": result,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Created, (ContentType::JSON, result));
}

#[get("/function/list")]
pub fn list_remote_functions() -> (Status, (ContentType, String)) {
    let functions = RemoteFunctions::get_remote_functions();

    let value = serde_json::json!({
        "isOk": true,
        "value": functions,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Ok, (ContentType::JSON, result));
}

#[get("/function?<selector..>")]
pub fn get_remote_function(selector: GetRemoteFunction) -> (Status, (ContentType, String)) {
    let id = selector.id;
    let function = RemoteFunctions::get_remote_function(&id);

    let value = serde_json::json!({
        "isOk": true,
        "value": function,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Ok, (ContentType::JSON, result));
}

#[get("/function/read?<selector..>")]
pub fn read_remote_function(selector: GetRemoteFunction) -> (Status, (ContentType, String)) {
    let id = selector.id;
    let function = RemoteFunctions::read_source_code(&id);

    if function.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": null,
            "error": function.unwrap_err()
        });

        let result = value.to_string();
        
        return (Status::BadRequest, (ContentType::JSON, result));
    }

    let function = function.unwrap();

    let value = serde_json::json!({
        "isOk": true,
        "value": function,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Ok, (ContentType::JSON, result));
}   

#[post("/function/write", data="<input>")]
pub fn write_remote_function(input: String) -> (Status, (ContentType, String)) {
    let intent_json = serde_json::from_str(&input);

    if intent_json.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": null,
            "error": intent_json.unwrap_err().to_string()
        });

        let result: String = value.to_string();

        return (Status::BadRequest, (ContentType::JSON, result));
    }

    let intent_json: WriteRemoteFunction = intent_json.unwrap();

    let result = RemoteFunctions::write_source_code(
        &intent_json.id,
        &intent_json.content
    );

    if result.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": null,
            "error": result.unwrap_err()
        });

        let result: String = value.to_string(); 

        return (Status::BadRequest, (ContentType::JSON, result));
    }

    let value = serde_json::json!({
        "isOk": true,
        "value": null,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Ok, (ContentType::JSON, result));
}

#[post("/function/run/debug", data="<input>")]
pub async fn run_function_with_debugger(input: String) -> (Status, (ContentType, String)) {
    let intent_json = serde_json::from_str(&input);

    if intent_json.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": null,
            "error": intent_json.unwrap_err().to_string()
        });

        let result: String = value.to_string();

        return (Status::BadRequest, (ContentType::JSON, result));
    }

    let intent_json: RunDebug = intent_json.unwrap();

    let id = intent_json.id;
    let args = intent_json.argv;

    let result = RemoteFunctions::execute_function_in_runtime(&id, args).await;

    if result.is_err() {
        let value = serde_json::json!({
            "isOk": false,
            "value": null,
            "error": result.unwrap_err()
        });

        let result: String = value.to_string();

        return (Status::InternalServerError, (ContentType::JSON, result));
    }

    let data = result.unwrap();

    let value = serde_json::json!({
        "isOk": true,
        "value": data,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Ok, (ContentType::JSON, result));
}

/**
 * Get scenario logs
 * @param limit Limit of logs to retrieve
 * @skip Skip the first n logs
 * @return List of scenario logs
 */
#[get("/scenario/logs/list")]
pub fn get_scenario_logs() -> (Status, (ContentType, String)) {
    let limit = 512;
    let skip = 0;

    let logs = Scenario::get_logs(limit, skip);

    let value = serde_json::json!({
        "isOk": true,
        "value": logs,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Ok, (ContentType::JSON, result));
}
