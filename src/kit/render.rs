
use crate::config::CONFIG;
use crate::p_kit::{self, get_all_runtime_plugins};
use crate::resource_kit::Resource;

use chrono::Utc;
use rocket::http::{ContentType, Status};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::Mutex;

lazy_static! {
  pub static ref RENDER_METHODS: Mutex<HashMap<String, fn(Resource, HashMap<String, String>) -> (Status, (ContentType, String))>> = Mutex::new(HashMap::new());
}

// Register a render method
fn register_render_method(name: &str, function: fn(Resource, HashMap<String, String>) -> (Status, (ContentType, String))) {
  RENDER_METHODS.lock().unwrap().insert(String::from(name), function);
}

// Get a render method
fn get_render_method(name: &str) -> fn(Resource, HashMap<String, String>) -> (Status, (ContentType, String)) {
  return RENDER_METHODS.lock().unwrap().get(name).unwrap().clone()
}

// Check if a render method exists
fn is_render_method(name: &str) -> bool {
  return RENDER_METHODS.lock().unwrap().contains_key(name);
}

fn default_method_meta_redirect(resource: Resource, _meta: HashMap<String, String>) -> (Status, (ContentType, String)) {
  let uri = resource.raw_content.clone().unwrap();
  
  return (
    Status::Ok,
    (
      ContentType::HTML,
        include_str!("../../containers/meta_redirect.html")
          .replace("*", &uri),
    ),
  );
}

fn default_method_js_redirect(resource: Resource, _meta: HashMap<String, String>) -> (Status, (ContentType, String)) {
  let uri = resource.raw_content.clone().unwrap();
  
  return (
    Status::Ok,
    (
      ContentType::HTML,
        include_str!("../../containers/javascript_redirect.html")
          .replace("*", &uri),
    ),
  );
}

fn default_method_json_write(_resource: Resource, _meta: HashMap<String, String>) -> (Status, (ContentType, String)) {
  let json_raw_string = "{\"value\": *}".replace("*", _resource.raw_content.unwrap().as_str());

  let _: serde::de::IgnoredAny = serde_json::from_str(json_raw_string.clone().as_str())
    .expect("Unable to deserialize json");

  return (
    Status::Ok,
    (ContentType::JSON, json_raw_string.clone().to_string()),
  );
}

fn default_external_python() {

} 

fn default_method_html(resource: Resource, _meta: HashMap<String, String>) -> (Status, (ContentType, String)) {
  let time = Utc::now().timestamp_micros();

  let mut params = HashMap::new();

  params.insert("time", time.to_string());
  params.insert("hello_rust", "Rust".to_string());
  params.insert("public", CONFIG["http_server_serve_uri_path"].as_str().unwrap().to_string());
  params.insert("static", CONFIG["http_server_serve_uri_path"].as_str().unwrap().to_string());

  if &resource.file_path.is_some() == &true {
    let template_name = resource
        .file_path
        .as_ref()
        .unwrap()
        .replace("./public/", "")
        .replace("/public/", "")
        .replace("public/", "")
        .replace("/public", "");

    let template_uri_raw = "./public/*".replace("*", &template_name);

    let pwd = CONFIG["http_server_serve_uri_path"].as_str().unwrap().to_string() + "/" + Path::new(&template_name).parent().unwrap().to_str().unwrap();
    let pwd_static = Path::new(&pwd).to_str().unwrap();

    params.insert("pwd", String::from(pwd_static));


    if !Path::new(&template_uri_raw).exists() {
      if CONFIG["is_allow_debug_throw"].as_bool().unwrap() {
        return (
          Status::InternalServerError,
          (
            ContentType::Plain,
            vec![
              "Debugger:",
              "",
              "You are seeing this message because you have the 'is_allow_debug_throw' parameter enabled and an error occurred while rendering the page.",
              format!("You are trying to access file '{raw}', but we couldn't find it. We searched along the way '{path}'", raw=template_name, path=template_uri_raw).as_str()
            ].join("\n"),
          ),
        ); 
      } else {
        return (
          Status::NoContent,
          (
            ContentType::Plain,
            String::new()
          ),
        ); 
      }
    }

    if !Path::new(&template_uri_raw).is_file() {
      if CONFIG["is_allow_debug_throw"].as_bool().unwrap() {
        return (
          Status::InternalServerError,
          (
            ContentType::Plain,
            vec![
              "Debugger:",
              "",
              "You are seeing this message because you have the 'is_allow_debug_throw' parameter enabled and an error occurred while rendering the page.",
              format!("You are trying to reference file '{file}', but there is no entity with type 'file' in the path you specified, there is something else there. Perhaps this is a directory, or a link (they sometimes work incorrectly), or a binary file with execution rights", file=template_name).as_str()
            ].join("\n"),
          ),
        ); 
      } else {
        return (
          Status::NoContent,
          (
            ContentType::Plain,
            String::new()
          ),
        ); 
      }
    }

    let mut result =
        fs::read_to_string(template_uri_raw).unwrap();

    for key in params.keys() {
        result = result.replace(
            &"{{*}}".replace("*", key).to_string(),
            params.get(key).unwrap(),
        );
    }

    return (Status::Ok, (ContentType::HTML, String::from(result)));
  } else if &resource.raw_content.is_some() == &true {
    let mut result: String = String::from(resource.raw_content.as_ref().unwrap());

    for key in params.keys() {
        result = result.replace(
            &"{{*}}".replace("*", key).to_string(),
            params.get(key).unwrap(),
        );
    }


    drop(params);

    return (Status::Ok, (ContentType::HTML, String::from(result)));
  }

  return (
    Status::InternalServerError,
    (ContentType::HTML, "Unable to render resource".to_string()),
  );
}

fn default_method_proxy_html(_resource: Resource, _meta: HashMap<String, String>) -> (Status, (ContentType, String)) {
  return (
    Status::Ok,
    (
      ContentType::Plain,
      "raw_data".to_string(),
    )
  )
}


fn plugin_v8(resource: Resource, meta: HashMap<String, String>) -> (Status, (ContentType, String)) {
  let output = p_kit::call_plugin(resource.driver.as_str(), meta);
  
  let mut lookup: HashMap<String, Value> = serde_json::from_str(output.as_str()).unwrap();
  let mut map = HashMap::new();

  for key in vec!["status_code", "body", "content_type"] {
      let (k, v) = lookup.remove_entry(key).unwrap();
      map.insert(k, v);
  }

  let content_type = ContentType
    ::from_extension(map["content_type"].as_str().unwrap())
    .unwrap();

  return (
    Status::from_code(map["status_code"].as_u64().unwrap() as u16)
      .unwrap(),
    (
      content_type,
      map["body"].as_str().unwrap().to_string()
    )
  )
}

// Register render methods
pub fn register_default_render_methods() {
  register_render_method("proxy::html", default_method_proxy_html);
  
  register_render_method("redirect::meta", default_method_meta_redirect);
  register_render_method("redirect::javascript", default_method_js_redirect);
  register_render_method("json", default_method_json_write);
  register_render_method("html", default_method_html);
  
  for plugin in get_all_runtime_plugins() {
    if &plugin.attach_at == "render_driver" && &plugin.engine == "v8" {
      register_render_method(
        &plugin.name, 
        |resource, meta| plugin_v8(resource, meta)
      );
    }
  }

  // register_render_method("redirect::meta".to_string(), render_resource_for_http);
  // register_render_method("redirect::javascript".to_string(), render_resource_for_http);
}

pub async fn render_resource_for_http(
  resource: Resource, // what? why...
  meta: HashMap<String, String>, // ....
) -> (Status, (ContentType, String)) {
  let driver_name = resource
    .driver
    .clone()
    .to_lowercase();

  if !is_render_method(&driver_name) {
    if CONFIG["is_allow_debug_throw"].as_bool().unwrap() {
      return (
        Status::InternalServerError,
        (
          ContentType::Plain,
          vec![
            "Debugger:",
            "",
            "You are seeing this message because you have the 'is_allow_debug_throw' parameter enabled and an error occurred while rendering the page.",
            format!("You are trying to render content using the '{driver}' rendering driver, but there is no such driver on the system.", driver=driver_name).as_str()
          ].join("\n"),
        ),
      ); 
    } else {
      return (
        Status::NoContent,
        (
          ContentType::Plain,
          String::new(),
        ),
      );
    }
  }

  let driver = get_render_method(&driver_name);

  let result = driver(resource, meta);

  return result;
}
