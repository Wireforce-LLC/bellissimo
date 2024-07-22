use std::{collections::HashMap, env, fs, future, path::Path, str::FromStr, sync::{Arc, Mutex}, thread::{self, sleep}, time::Duration};

use chrono::{DateTime, Local, Utc};
use clokwerk::{Interval, Job, Scheduler};
use fastcgi_client::{Client, Params, Request};
use futures::{StreamExt, TryStreamExt};
use mongodb::bson::doc;
use paris::{info, log};
use serde::{Deserialize, Serialize};
use tokio::{io, net::TcpStream, runtime::Runtime, spawn, task::{self, spawn_blocking}, time::Instant};

use crate::{http_over_sdk::HttpOver, mongo_sdk::MongoDatabase, system};

pub struct RemoteFunctions {}

#[derive(Debug, Serialize, Deserialize)]
pub struct TriggerFunction {
    pub trigger_event: String,
    pub function_id: String,
    pub trigger_id: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExecutionResult {
    pub file_name: String,
    pub output: Option<String>,
    pub processor: String,
    pub error: Option<String>,
    pub success: bool,
    pub args: HashMap<String, String>,
    pub runtime: u8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FunctionExecutionLog {
    pub time: i64,
    pub function_id: String,
    pub args: HashMap<String, String>,
    pub output: Option<String>,
    pub success: bool,
    pub duration_in_millis: i64,
    pub runtime: u8,
    pub processor: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRemoteFunction {
    pub name: String,
    pub id: String,
    pub runtime: u8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RemoteFunction {
    pub name: String,
    pub id: String,
    pub path: String,
    pub runtime: u8,
}

pub enum RuntimeEnum {
    Node = 2,
    Php = 1,
    Python = 3,
}

#[derive(Debug, Clone)]
pub struct ScheduleTask {
    pub function_id: String,
    pub at: DateTime<Utc>
}

lazy_static! {
    static ref PHP_FPM_ADDRESS: (String, String) = {
        (
            env::var("PHP_FPM_HOST").unwrap_or("localhost".to_string()),
            env::var("PHP_FPM_PORT").unwrap_or("9000".to_string()),
        )
    };

    static ref SCHEDULE_TASKS: Arc<Mutex<Vec<ScheduleTask>>> = Arc::new(Mutex::new(vec![]));
}

    

pub fn init_func() {
    info!("Create thread to process tasks");
    
    task::spawn(async move {
        loop {
            let mut guard = SCHEDULE_TASKS.lock().unwrap();
    
            guard.retain(|task| {
                if task.at <= Utc::now() {
                    let function_id = task.function_id.clone();
    
                    info!("Calling remote function '{}' at {:?}", function_id, task.at);
    
                    tokio::spawn(async move {
                        let result = RemoteFunctions::call(&function_id, None).await;
    
                        if result.is_err() {
                            info!("Remote function '{}' error: {:?}", function_id, result);
                        } 
                    });
                    false
                } else {
                    true
                }
            });
    
            drop(guard); 

            // tokio::time::sleep(
            //     Duration::from_secs(1)
            // ).await;
    
            sleep(Duration::from_secs(1));
        }
    });

    HttpOver::register(
        "schedule_task",
        "Schedule task after N seconds or minutes or hours or all of them",
        |params: HashMap<String, String>| {
            if !params.contains_key("function_id") {
                return Err("Missing 'function_id' parameter".to_string());
            }

            let function_id = params.get("function_id").unwrap();

            if !RemoteFunctions::is_remote_function_exist(function_id) {
                return Err(format!("Remote function '{}' not found", function_id));
            }

            if !params.contains_key("hours") {
                return Err("Missing 'hours' parameter".to_string());
            }

            if !params.contains_key("minutes") {
                return Err("Missing 'minutes' parameter".to_string());
            }

            if !params.contains_key("seconds") {
                return Err("Missing 'seconds' parameter".to_string());
            }

            let hours = params.get("hours").unwrap().parse::<i64>().unwrap_or(0);
            let minutes = params.get("minutes").unwrap().parse::<i64>().unwrap_or(0);
            let seconds = params.get("seconds").unwrap().parse::<i64>().unwrap_or(0);

            let at = Utc::now() + chrono::Duration::hours(hours) + chrono::Duration::minutes(minutes) + chrono::Duration::seconds(seconds);

            RemoteFunctions::register_schedule_task(function_id, at);

            let mut result = HashMap::new();

            result.insert("success".to_string(), serde_json::to_value(true).unwrap());
            result.insert("at".to_string(), serde_json::to_value(at.format("%Y-%m-%d %H:%M:%S").to_string()).unwrap());
            result.insert("now".to_string(), serde_json::to_value(Utc::now().format("%Y-%m-%d %H:%M:%S").to_string()).unwrap());

            Ok(Some(result))
        }
    ).unwrap();
}

pub struct Trigger {}

impl Trigger {
    pub fn call_delayed(
        trigger_event: &str,
    ) -> Result<(), String> {
        let collection = MongoDatabase::use_trigger_collection();

        let result = collection
            .find(doc! { "trigger_event": trigger_event }, None)
            .unwrap();

        for document in result {
            let document = document.unwrap();
            let function_id = document.function_id;
            
            RemoteFunctions::register_schedule_task(&function_id, Utc::now() + Duration::from_secs(3));
        }

        Ok(())
    }

    pub async fn call_with_params(
        trigger_event: &str,
        params: HashMap<String, String>
    ) -> Result<(), String> {
        let collection = MongoDatabase::use_async_trigger_collection();

        let mut result = collection
            .find(doc! { "trigger_event": trigger_event }, None)
            .await
            .unwrap();
    
        while let Some(document) = result.try_next().await.unwrap_or(None) {
            let function_id = document.function_id;
            
            RemoteFunctions
                ::call(&function_id, Some(params.clone()))
                .await
                .unwrap();
        }

        Ok(())
    }

    pub fn create_trigger(
        trigger: TriggerFunction
    ) -> Result<(), String> {
        let collection = MongoDatabase::use_trigger_collection();

        collection
            .insert_one(trigger, None)
            .unwrap();

        Ok(())               
    }

    pub fn delete_trigger(
        trigger_id: &str
    ) -> Result<(), String> {
        let collection = MongoDatabase::use_trigger_collection();

        collection
            .delete_one(doc! { "trigger_id": trigger_id }, None)
            .unwrap();

        Ok(())
    }

    pub fn get_trigger(
        trigger_id: &str
    ) -> Result<Option<TriggerFunction>, String> {
        let collection = MongoDatabase::use_trigger_collection();

        let result = collection
            .find_one(doc! { "trigger_id": trigger_id }, None)
            .unwrap();

        if result.is_none() {
            return Ok(None);
        }

        let result = result.unwrap();

        Ok(Some(result))
    }

    pub fn get_triggers() -> Result<Vec<TriggerFunction>, String> {
        let collection = MongoDatabase::use_trigger_collection();

        let result = collection
            .find(doc! {}, None)
            .unwrap();

        let mut triggers: Vec<TriggerFunction> = Vec::new();

        for doc in result {
            triggers.push(doc.unwrap());
        }

        Ok(triggers)
    }

    pub fn get_triggers_by_function_id(
        function_id: &str
    ) -> Result<Vec<TriggerFunction>, String> {
        let collection = MongoDatabase::use_trigger_collection();

        let result = collection
            .find(doc! { "function_id": function_id }, None)
            .unwrap(); 

        let mut triggers: Vec<TriggerFunction> = Vec::new();

        for doc in result {
            triggers.push(doc.unwrap());
        }

        Ok(triggers)
    }

    pub fn get_trigger_by_trigger_point(
        trigger_point: &str
    ) -> Result<Option<TriggerFunction>, String> {
        let collection = MongoDatabase::use_trigger_collection();

        let result = collection
            .find_one(doc! { "trigger_event": trigger_point }, None)
            .unwrap();

        if result.is_none() {
            return Ok(None);
        }

        let result = result.unwrap();

        Ok(Some(result))
    }
}

impl RemoteFunctions {
    pub fn register_schedule_task(function_id: &str, at: DateTime<Utc>) {
        SCHEDULE_TASKS
            .lock()
            .unwrap()
            .push(ScheduleTask {
                function_id: function_id.to_string(),
                at
            });
    }
}

impl RemoteFunctions {
    async fn runtime_php(
        file_path: &str,
        args: HashMap<String, String>,
    ) -> Result<ExecutionResult, String> {
        let stream = TcpStream::connect((
            PHP_FPM_ADDRESS.0.to_owned(),
            PHP_FPM_ADDRESS.1.parse::<u16>().unwrap(),
        ))
        .await
        .unwrap();

        let client = Client::new(stream);

        let query_string_from_meta = args
            .iter()
            .map(|(k, v)| format!("{}={}", k, v))
            .collect::<Vec<String>>()
            .join("&");

        if !Path::new(&file_path).exists() {
            return Err("File not found".to_string());
        }

        // Fastcgi params, please reference to nginx-php-fpm config.
        let params = Params::default()
            .request_method("POST")
            .script_filename(file_path)
            .request_uri("/remote-functions")
            .query_string(query_string_from_meta)
            .server_software("bellissimo")
            .server_addr("127.0.0.1")
            .server_name("bellissimo");

        let stdin = io::empty();

        // Fetch fastcgi server(php-fpm) response.
        let request = Request::new(params, stdin);

        let mut php_fpm = client.execute_once(request).await.unwrap();

        let mut response_data = String::new();

        if php_fpm.stdout.is_some() {
            let stdout = php_fpm.stdout.unwrap();

            if !stdout.is_empty() {
                response_data = String::from_utf8(stdout).unwrap();

                return Ok(ExecutionResult {
                    file_name: file_path.to_string(),
                    output: Some(response_data),
                    processor: "php-fpm".to_string(),
                    error: None,
                    success: true,
                    args,
                    runtime: RuntimeEnum::Php as u8,
                });
            }
        }

        if php_fpm.stderr.is_some() {
            let stderr = php_fpm.stderr.unwrap();

            if !stderr.is_empty() {
                response_data = String::from_utf8(stderr).unwrap();

                return Ok(ExecutionResult {
                    file_name: file_path.to_string(),
                    output: None,
                    processor: "php-fpm".to_string(),
                    error: Some(response_data),
                    success: false,
                    args,
                    runtime: RuntimeEnum::Php as u8,
                });
            }
        }

        return Err("Unknown error".to_string());
    }

    /**
     * Fill default hashmap
     */
    fn fill_default_hashmap() -> HashMap<String, String> {
        let mut args = HashMap::new();

        args.insert(
            "__remote_function_endpoint__".to_string(),
            env::var("REMOTE_FUNCTION_ENDPOINT").unwrap_or("http://localhost:8000".to_string()),
        );

        return args;
    }

    /**
     * Call remote function
     */
    pub async fn call(
        function_id: &str,
        args: Option<HashMap<String, String>>,
    ) -> Result<serde_json::Value, String> {
        let collection = MongoDatabase::use_async_collection::<FunctionExecutionLog>(
            "pipeline",
            "logs"
        );

        let mut args = args.unwrap_or(HashMap::new());

        args.insert(
            "__function_id__".to_string(),
            function_id.to_string(),
        );

        let start = Instant::now();
        let result = RemoteFunctions::execute_function_in_runtime(function_id, args.clone()).await;
        let duration = start.elapsed();
        let duration_in_millis = duration.as_millis();

        if result.is_err() {
            return Err(result.err().unwrap());
        }

        let result = result.unwrap();

        let log_record = FunctionExecutionLog {
            time: Utc::now().timestamp_micros(),
            function_id: function_id.to_string(),
            args: args,
            duration_in_millis: i64::try_from(duration_in_millis).unwrap_or(0),
            success: result.success.clone(),
            output: result.output.clone(),
            runtime: RuntimeEnum::Php as u8,
            processor: "php-fpm".to_string(),
        };

        collection
            .insert_one(
                log_record,
                None
            )
            .await
            .unwrap();

        if result.success {
            let output = &result
                .output
                .unwrap();
            
            if result.processor == "php-fpm" {
                let pair = output.split_once("\r\n\r\n").unwrap();

                if pair.0.contains("Content-Type: application/json") {
                    let value = serde_json::from_str::<serde_json::Value>(pair.1);

                    if value.is_err() {
                        return Err(value.unwrap_err().to_string());
                    }

                    return Ok(value.unwrap());
                }
            }

            return Ok(serde_json::to_value(output).unwrap());
        }

        if result.error.is_some() {
            return Err(result.error.unwrap());
        }

        return Err("Unknown error".to_string());
    }

    /**
     * Execute remote function
     */
    pub async fn execute_function_in_runtime(
        function_id: &str,
        args: HashMap<String, String>,
    ) -> Result<ExecutionResult, String> {
        let mut argv = RemoteFunctions::fill_default_hashmap();

        argv.extend(args);

        let remote_function = RemoteFunctions::get_remote_function(function_id);

        if remote_function.is_none() {
            return Err("Remote function not found".to_string());
        }

        let remote_function = remote_function.unwrap();

        return RemoteFunctions::runtime_php(&remote_function.path, argv).await;
    }
}

impl RemoteFunctions {
    fn check_id_is_exist(id: &str) -> bool {
        let collection = MongoDatabase::use_remote_functions_collection();

        return collection
            .find_one(
                doc! {
                    "id": id
                },
                None,
            )
            .unwrap()
            .is_some();
    }
}

impl RemoteFunctions {
    pub fn create_remote_function(remote_function: CreateRemoteFunction) -> Result<(), String> {
        let collection = MongoDatabase::use_remote_functions_collection();
        let file_ext = match remote_function.runtime {
            1 => "php",
            2 => "js",
            3 => "py",
            _ => "func",
        };

        let remote_function = RemoteFunction {
            name: remote_function.name,
            id: remote_function.id.clone(),
            path: system::PUBLIC_ABSOLUTE_FOLDER
                .join("functions")
                .join(format!("{}.{}", remote_function.id, file_ext))
                .into_os_string()
                .into_string()
                .unwrap(),
            runtime: remote_function.runtime,
        };

        if remote_function.id == "" {
            return Err("Remote function id cannot be empty".to_string());
        }

        if remote_function.id.contains(" ") {
            return Err("Remote function id cannot contain spaces".to_string());
        }

        if remote_function
            .id
            .as_bytes()
            .iter()
            .all(|x| x.is_ascii_lowercase() || *x == b'_' || x.is_ascii_digit())
            == false
        {
            return Err("Remote function id must be alphanumeric or _ or digits".to_string());
        }

        if remote_function.name == "" {
            return Err("Remote function name cannot be empty".to_string());
        }

        if remote_function.path == "" {
            return Err("Remote function path cannot be empty".to_string());
        }

        if remote_function.runtime == 0 {
            return Err("Remote function runtime cannot be empty".to_string());
        }

        if RemoteFunctions::check_id_is_exist(&remote_function.id) {
            return Err("Remote function already exists".to_string());
        }

        let result = fs::write(&remote_function.path, "");

        if result.is_err() {
            return Err(result.unwrap_err().to_string());
        }

        if !Path::new(&remote_function.path).exists() {
            return Err("Remote function path not found".to_string());
        }

        // Insert the remote function
        collection.insert_one(remote_function, None).unwrap();

        return Ok(());
    }

    /**
     * Delete remote function
     */
    pub fn delete_remote_function(id: &str, also_delete_file: bool) -> Result<(), String> {
        if !RemoteFunctions::check_id_is_exist(&id) {
            return Err("Remote function not found".to_string());
        }

        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_function = collection
            .find_one(
                doc! {
                    "id": &id
                },
                None,
            )
            .unwrap();

        let remote_function = remote_function.unwrap();

        collection.delete_one(doc! { "id": id }, None).unwrap();

        if also_delete_file {
            if Path::new(&remote_function.path).exists() {
                // Delete the file
                fs::remove_file(&remote_function.path).unwrap();
            }
        }

        return Ok(());
    }

    /**
     * Write source code
     *
     * This function writes the source code of the remote function to the specified path.
     */
    pub fn write_source_code(id: &str, code: &str) -> Result<(), String> {
        if !RemoteFunctions::check_id_is_exist(&id) {
            return Err("Remote function not found".to_string());
        }

        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_function = collection
            .find_one(
                doc! {
                    "id": id
                },
                None,
            )
            .unwrap();

        if remote_function.is_none() {
            return Err("Remote function not found".to_string());
        }

        let remote_function = remote_function.unwrap();
        let path = remote_function.path;

        if !Path::new(&path).exists() {
            return Err("Remote function path not found".to_string());
        }

        let metadata = fs::metadata(&path).unwrap();

        if metadata.is_dir() {
            return Err("Remote function path is a directory".to_string());
        }

        if metadata.is_symlink() {
            return Err("Remote function path is a symlink".to_string());
        }

        if metadata.permissions().readonly() {
            return Err("Remote function path is readonly".to_string());
        }

        // Write the source code
        std::fs::write(&path, code).unwrap();

        return Ok(());
    }

    /**
     * Read source code
     *
     * This function reads the source code of the remote function from the specified path.
     * Returns the source code as a string.
     */
    pub fn read_source_code(id: &str) -> Result<String, String> {
        if !RemoteFunctions::check_id_is_exist(&id) {
            return Err("Remote function not found".to_string());
        }

        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_function = collection
            .find_one(
                doc! {
                    "id": id
                },
                None,
            )
            .unwrap();

        if remote_function.is_none() {
            return Err("Remote function not found".to_string());
        }

        let remote_function = remote_function.unwrap();
        let path = remote_function.path;

        if !Path::new(&path).exists() {
            return Err("Remote function path not found".to_string());
        }

        return Ok(std::fs::read_to_string(&path).unwrap());
    }

    /**
     * Get remote functions
     *
     * This function returns a list of remote functions.
     */
    pub fn get_remote_functions() -> Vec<RemoteFunction> {
        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_functions: Vec<RemoteFunction> = collection
            .find(None, None)
            .unwrap()
            .map(|res| res.unwrap().into())
            .collect();

        return remote_functions;
    }

    /**
     * Get remote function
     *
     * This function returns a remote function with the specified id.
     */
    pub fn get_remote_function(id: &str) -> Option<RemoteFunction> {
        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_function = collection
            .find_one(
                doc! {
                    "id": id
                },
                None,
            )
            .unwrap();

        if remote_function.is_none() {
            return None;
        }

        return Some(remote_function.unwrap().into());
    }

    pub fn is_remote_function_exist(id: &str) -> bool {
        return RemoteFunctions::get_remote_function(id).is_some();
    }
}
