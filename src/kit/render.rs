
use crate::config::CONFIG;
use crate::not_found;
use crate::p_kit::{self, get_all_runtime_plugins};
use crate::resource_kit::Resource;

use chrono::Utc;
use fastcgi_client::{Client, Params, Request};
use rocket::futures::FutureExt;
use rocket::http::{ContentType, Status};
use serde_json::Value;
use tokio::io;
use std::collections::HashMap;
use std::future::Future;
use std::io::Stdout;
use std::pin::Pin;
use std::{env, fs};
use std::path::Path;
use std::sync::Mutex;
use tokio::{net::TcpStream};

lazy_static! {
  pub static ref RENDER_METHODS: Mutex<
    HashMap<String, fn(Resource, HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>>>
  > = Mutex::new(HashMap::new());
}

// Register a render method
fn register_render_method(
  name: &str, 
  function: fn(Resource, HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>>
) {
  RENDER_METHODS.lock().unwrap().insert(String::from(name), function);
}

// Get a render method
fn get_render_method(name: &str) -> fn(Resource, HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  return RENDER_METHODS.lock().unwrap().get(name).unwrap().clone();
}

// Check if a render method exists
fn is_render_method(name: &str) -> bool {
  return RENDER_METHODS.lock().unwrap().contains_key(name);
}


fn default_method_meta_redirect(resource: Resource, _meta: HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  let uri = resource.raw_content.clone().unwrap();
  let content = include_str!("../../containers/meta_redirect.html")
    .replace("*", &uri);

  let closure = async move { 
    (
      Status::Ok,
      (
        ContentType::HTML,
        content
      )
    )
  };

  Box::pin(closure)
}

fn default_method_js_redirect(resource: Resource, _meta: HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  let uri = resource.raw_content.clone().unwrap();
  let content = include_str!("../../containers/javascript_redirect.html")
    .replace("*", &uri);

  let closure = async move { 
    (
      Status::Ok,
      (
        ContentType::HTML,
        content
      )
    )
  };

  Box::pin(closure)
}

fn default_method_json_write(_resource: Resource, _meta: HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  let json_raw_string = "{\"value\": *}".replace("*", _resource.raw_content.unwrap().as_str());

  let _: serde::de::IgnoredAny = serde_json::from_str(json_raw_string.clone().as_str())
    .expect("Unable to deserialize json");

  let json_raw = json_raw_string.clone().to_string();

  let closure = async move { 
    (
      Status::Ok,
      (
        ContentType::HTML,
        json_raw
      )
    )
  };

  Box::pin(closure)
}

fn default_method_php(resource: Resource, meta: HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  let php_fpm_host = env::var("PHP_FPM_HOST").unwrap_or("localhost".to_string());
  let php_fpm_port = env::var("PHP_FPM_PORT").unwrap_or("9000".to_string()).parse::<u16>().unwrap();

  let closure = async move {
    if resource.raw_content.is_some() {
      if CONFIG["is_allow_debug_throw"].as_bool().unwrap() {
        return (
          Status::InternalServerError,
          (
            ContentType::HTML,
            vec![
              "Debugger:",
              "PHP render method did not support raw content, please use another render method",
            ]
            .join("\n")
          ),
        ); 
      } else {
        return (
          Status::InternalServerError,
          (
            ContentType::Plain,
            String::new()
          ),
        ); 
      }
    }

    let template_name = resource
        .file_path
        .as_ref()
        .unwrap()
        .replace("./public/", "")
        .replace("/public/", "")
        .replace("public/", "")
        .replace("/public", "");

    let template_uri_raw = env::current_dir()
      .unwrap()
      .join("public")
      .join(&template_name)
      .into_os_string()
      .into_string()
      .unwrap();
    
    if Path::new(&template_uri_raw).exists() {
      let script_name = "index.php";

      let stream = TcpStream::connect((
        php_fpm_host.as_str(),
        php_fpm_port
      )).await.unwrap();

      let client = Client::new(stream);

      // Fastcgi params, please reference to nginx-php-fpm config.
      let params = Params::default()
        .request_method("GET")
        .script_name(template_name)
        .script_filename(template_uri_raw)
        .request_uri(script_name)
        .document_uri(script_name)
        .remote_addr("127.0.0.1")
        .remote_port(12345)
        .server_addr("127.0.0.1")
        .server_port(80)
        .server_name("bellissimo");

      // Fetch fastcgi server(php-fpm) response.
      let output = client.execute_once(Request::new(params, &mut io::empty())).await.unwrap();

      // "Content-type: text/html; charset=UTF-8\r\n\r\nhello"
      let stdout = String::from_utf8(output.stdout.unwrap()).unwrap();

      let (headers, stdout) = stdout
        .trim_start()
        .split_once("\r\n\r\n")
        .unwrap();

      return (
        Status::Ok,
        (
          ContentType::HTML,
          String::from(stdout)
        )
      );
    }
  
    return not_found();
  };

  Box::pin(closure)
}


// async fn default_method_php2(resource: Resource, meta: HashMap<String, String>) -> dyn Future<Output = (Status, (ContentType, String))> {
//   // let func = ;



//   // let script_filename = env::current_dir()
//   //   .unwrap()
//   //   .join("tests")
//   //   .join("php")
//   //   .join("index.php");

//   // let script_filename = script_filename.to_str().unwrap();
//   // let script_name = "/index.php";

//   // let stream = TcpStream::connect((
//   //   CONFIG["php_fpm_host"].as_str().unwrap(),
//   //   CONFIG["php_fpm_port"].as_integer().unwrap() as u16
//   // )).unwrap();

//   // let client = Client::new(stream);

//   // // Fastcgi params, please reference to nginx-php-fpm config.
//   // let params = Params::default()
//   //   .request_method("GET")
//   //   .script_name(script_name)
//   //   .script_filename(script_filename)
//   //   .request_uri(script_name)
//   //   .document_uri(script_name)
//   //   .remote_addr("127.0.0.1")
//   //   .remote_port(12345)
//   //   .server_addr("127.0.0.1")
//   //   .server_port(80)
//   //   .server_name("jmjoy-pc")
//   //   .content_type("")
//   //   .content_length(0);

//   // // Fetch fastcgi server(php-fpm) response.
//   // let output = client.execute_once(Request::new(params, &mut io::empty())).await.unwrap();

//   // // "Content-type: text/html; charset=UTF-8\r\n\r\nhello"
//   // let stdout = String::from_utf8(output.stdout.unwrap()).unwrap();
 
//   // return (
//   //   Status::Ok,
//   //   (ContentType::Plain, stdout),
//   // );
// }

fn default_external_python() {

} 

fn default_method_html(resource: Resource, _meta: HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  let time = Utc::now().timestamp_micros();

  Box::pin(async move {
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
  })
}


fn default_method_proxy_html(_resource: Resource, _meta: HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  let closure = async move { 
    (
      Status::Ok,
      (
        ContentType::HTML,
        "json_raw".to_string()
      )
    )
  };

  Box::pin(closure)
}


fn plugin_v8(resource: Resource, meta: HashMap<String, String>) -> Pin<Box<dyn Future<Output = (Status, (ContentType, String))> + Send>> {
  let closure = async move { 
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

      
    (
      Status::from_code(map["status_code"].as_u64().unwrap() as u16).unwrap(),
      (
        content_type,
        map["body"].as_str().unwrap().to_string()
      )
    )
  };

  Box::pin(closure)
}

// Register render methods
pub fn register_default_render_methods() {
  register_render_method("proxy::html", default_method_proxy_html);
  register_render_method("redirect::meta", default_method_meta_redirect);
  register_render_method("redirect::javascript", default_method_js_redirect);
  register_render_method("json", default_method_json_write);
  register_render_method("html", default_method_html);
  register_render_method("php", default_method_php);
  
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

  return result.await;
}
