use std::{collections::HashMap, sync::Mutex};

lazy_static! {
    pub static ref HTTP_OVER_REGISTRY: Mutex<HashMap<String, HttpOverFunction>> = Mutex::new(HashMap::new());
    pub static ref HTTP_OVER_DOCUMENTS: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}

type HttpOverFunction = fn(HashMap<String, String>) -> Result<Option<HashMap<String, serde_json::Value>>, String>;

pub fn init_func() {
}

pub struct HttpOver {}

impl HttpOver {
    pub fn register(
        function_name: &str,
        description: &str,
        function: HttpOverFunction
    ) -> Result<(), String> {
        let locked = HTTP_OVER_REGISTRY.lock();

        if locked.is_err() {
            return Err("Failed to acquire lock".to_string());
        }

        let mut locked = locked.unwrap();

        if locked.contains_key(function_name) {
            return Err(format!("Function '{}' already registered", function_name));
        }

        locked.insert(function_name.to_string(), function);

        HTTP_OVER_DOCUMENTS
            .lock()
            .unwrap()
            .insert(function_name.to_string(), description.to_string());

        Ok(())
    }

    pub fn unregister(function_name: &str) -> Result<(), String> {
        if !HTTP_OVER_REGISTRY
            .lock()
            .unwrap()
            .contains_key(function_name) {
                return Err(format!("Function '{}' not registered", function_name));
            }

        HTTP_OVER_REGISTRY
            .lock()
            .unwrap()
            .remove(function_name);

        Ok(())
    }

    pub fn list() -> Vec<String> {
        HTTP_OVER_REGISTRY
            .lock()
            .unwrap()
            .keys()
            .map(|k| k.to_string())
            .collect()
    }  

    pub fn call_by_index(index: usize, argv: HashMap<String, String>) -> Result<Option<HashMap<String, serde_json::Value>>, String> {
        let function_name = HTTP_OVER_REGISTRY
            .lock()
            .unwrap()
            .keys()
            .nth(index)
            .unwrap()
            .to_string();

        HttpOver::call(&function_name, argv)
    }

    pub fn call_by_name(function_name: &str, argv: HashMap<String, String>) -> Result<Option<HashMap<String, serde_json::Value>>, String> {
        HttpOver::call(function_name, argv)
    }

    pub fn call_by_function(function: HttpOverFunction, argv: HashMap<String, String>) -> Result<Option<HashMap<String, serde_json::Value>>, String> {
        function(argv)
    }

    pub fn call(function_name: &str, argv: HashMap<String, String>) -> Result<Option<HashMap<String, serde_json::Value>>, String> {
        let locked = HTTP_OVER_REGISTRY.lock();

        if locked.is_err() {
            return Err(locked.unwrap_err().to_string());
        }

        let locked = locked.unwrap();

        if !locked.contains_key(function_name) {
                return Err(format!("Function '{}' not registered", function_name));
            }

        locked
            .get(function_name)
            .unwrap()(argv)
    }
}

