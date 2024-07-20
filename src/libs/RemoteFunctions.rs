use std::{collections::HashMap, env, fs, path::Path};

use fastcgi_client::{Client, Params, Request};
use mongodb::bson::doc;
use serde::{Serialize, Deserialize};
use tokio::{io, net::TcpStream};

use crate::{mongo_sdk::MongoDatabase, system};

pub struct RemoteFunctions {}


#[derive(Debug, Serialize, Deserialize)]
pub struct ExecutionResult {
    pub file_name: String,
    pub output: Option<String>,
    pub processor: String,
    pub error: Option<String>,
    pub success: bool,
    pub args: HashMap<String, String>,
    pub runtime: u8
}


#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRemoteFunction {
    pub name: String,
    pub id: String,
    pub runtime: u8
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RemoteFunction {
    pub name: String,
    pub id: String,
    pub path: String,
    pub runtime: u8
}

pub enum Runtime {
    Node = 2,
    Php = 1,
    Python = 3,
}

lazy_static! {
    static ref PHP_FPM_ADDRESS: (String, String) = {
        (
            env::var("PHP_FPM_HOST").unwrap_or("localhost".to_string()),
            env::var("PHP_FPM_PORT").unwrap_or("9000".to_string()),
        )
    };
}


impl RemoteFunctions {
    async fn runtime_php(file_path: &str, args: HashMap<String, String>) -> Result<ExecutionResult, String> {
        let stream = TcpStream::connect((
            PHP_FPM_ADDRESS.0.to_owned(),
            PHP_FPM_ADDRESS.1.parse::<u16>().unwrap()
        )).await.unwrap();
    
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
        
        let mut php_fpm = client
            .execute_once(request)
            .await
            .unwrap();

        let mut response_data = String::new();

        let stdout = php_fpm
            .stdout
            .unwrap();

        let stderr = php_fpm
            .stderr
            .unwrap();
        
        if !stdout.is_empty() {
            response_data = String::from_utf8(stdout).unwrap();

            return Ok(ExecutionResult {
                file_name: file_path.to_string(),
                output: Some(response_data),
                processor: "php-fpm".to_string(),
                error: None,
                success: true,
                args,
                runtime: Runtime::Php as u8
            })
        }


        if !stderr.is_empty() {
            response_data = String::from_utf8(stderr).unwrap();

            return Ok(ExecutionResult {
                file_name: file_path.to_string(),
                output: None,
                processor: "php-fpm".to_string(),
                error: Some(response_data),
                success: false,
                args,
                runtime: Runtime::Php as u8
            })
        }

        return Err("Unknown error".to_string());
    }

    /**
     * Fill default hashmap
     */
    fn fill_default_hashmap() -> HashMap<String, String> {
        let mut args = HashMap::new();

        return args;
    }

    /**
     * Execute remote function
     */
    pub async fn execute_function_in_runtime(function_id: &str, args: HashMap<String, String>) -> Result<ExecutionResult, String> {
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
                None
            )
            .unwrap()
            .is_some();
    }
}

impl RemoteFunctions {
    pub fn create_remote_function(remote_function: CreateRemoteFunction) -> Result<(), String> {
        let collection = MongoDatabase::use_remote_functions_collection();
        let remote_function = RemoteFunction {
            name: remote_function.name,
            id: remote_function.id.clone(),
            path: system::PUBLIC_ABSOLUTE_FOLDER
                .join("functions")
                .join(format!("{}.func", remote_function.id))
                .into_os_string()
                .into_string()
                .unwrap(),
            runtime: remote_function.runtime
        };

        if remote_function.id == "" {
            return Err("Remote function id cannot be empty".to_string());
        }

        if remote_function.id.contains(" ") {
            return Err("Remote function id cannot contain spaces".to_string());
        }

        if remote_function.id.as_bytes().iter().all(|x| x.is_ascii_lowercase() || *x == b'_' || x.is_ascii_digit()) == false {
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
    pub fn delete_remote_function(
        id: &str,
        also_delete_file: bool
    ) -> Result<(), String> {
        if !RemoteFunctions::check_id_is_exist(&id) {
            return Err("Remote function not found".to_string());
        }

        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_function = collection
            .find_one(
                doc! {
                    "id": &id
                },
                None
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
    pub fn write_source_code(
        id: &str,
        code: &str,
    ) -> Result<(), String> {
        if !RemoteFunctions::check_id_is_exist(&id) {
            return Err("Remote function not found".to_string());
        }

        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_function = collection
            .find_one(
                doc! {
                    "id": id
                },
                None
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
    pub fn read_source_code(
        id: &str,
    ) -> Result<String, String> {
        if !RemoteFunctions::check_id_is_exist(&id) {
            return Err("Remote function not found".to_string());
        }

        let collection = MongoDatabase::use_remote_functions_collection();

        let remote_function = collection
            .find_one(
                doc! {
                    "id": id
                },
                None
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
                None
            )
            .unwrap();

        if remote_function.is_none() {
            return None;
        }

        return Some(remote_function.unwrap().into());
    }
}