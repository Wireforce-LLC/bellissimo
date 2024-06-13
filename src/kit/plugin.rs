use std::{collections::HashMap, fs, path::Path, sync::{Mutex, Once}, vec};
use colored::Colorize;
use serde::Serialize;
use v8::CreateParams;
use crate::config::CONFIG;
use toml::Table;

static INIT: Once = Once::new();

pub struct PluginManifest {
  pub name: String,
  pub absolute_path: String,
}

#[derive(Serialize, Debug)]
pub struct PluginRuntimeManifest {
  pub name: String,
  pub absolute_path: String,
  pub description: String,
  pub version: String,
  pub engine: String,
  pub attach_at: String,
}

// Implementing Clone trait for PluginRuntimeManifest
impl Clone for PluginRuntimeManifest {
  fn clone(&self) -> Self {
      // Implement the logic to clone the fields of PluginRuntimeManifest
      PluginRuntimeManifest {
        name: self.name.clone(),
        absolute_path: self.absolute_path.clone(),
        description: self.description.clone(),
        version: self.version.clone(),
        engine: self.engine.clone(),
        attach_at: self.attach_at.clone(),
      }
  }
}

struct Context {
  pub d: String
}

lazy_static! {
  pub static ref PLUGINS: Mutex<HashMap<String, PluginManifest>> = Mutex::new(HashMap::new());
  pub static ref PLUGINS_RUNTIME: Mutex<Vec<PluginRuntimeManifest>> = Mutex::new(Vec::new());
  pub static ref PLUGINS_MANIFESTS: Table = toml::from_str(fs::read_to_string("./plugins.toml").unwrap().as_str()).unwrap();
}

pub fn get_all_runtime_plugins() -> Vec<PluginRuntimeManifest> {
  let vec = PLUGINS_RUNTIME
    .lock()
    .unwrap();
  
  let mut vec_build: Vec<PluginRuntimeManifest> = Vec::new();

  for value in vec.iter() {
    vec_build.push(value.to_owned());
  }

  return vec_build;
}

pub fn call_plugin(name: &str, dataset: HashMap<String, String>) -> String {
  let manifest = PLUGINS_RUNTIME
    .lock()
    .unwrap();

  let instance = manifest
    .iter()
    .find(|x| x.name == name)
    .unwrap();

  let raw = fs::read_to_string(&instance.absolute_path).unwrap();

  return call_it_plugin(raw.as_str(), dataset);
}

fn call_it_plugin(raw: &str, dataset: HashMap<String, String>) -> String {
  let params: CreateParams = Default::default();
  
  // params.heap_limits(
  //   CONFIG["v8_init_heap_size"].as_integer().unwrap() as usize,
  //   CONFIG["v8_max_heap_size"].as_integer().unwrap() as usize,
  // );

  let isolate = &mut v8::Isolate::new(params);

  let scope = &mut v8::HandleScope::new(isolate);
  let context = v8::Context::new(scope);
  let scope = &mut v8::ContextScope::new(scope, context);

  let code = v8::String::new(scope, raw).unwrap();
  let script = v8::Script::compile(scope, code, None).unwrap();

  let context_object = v8::Object::new(scope);

  let var_args_name = v8::String::new(scope, "args").unwrap().into();

  for value in dataset {
    let key = v8::String::new(scope, value.0.as_str()).unwrap();
    let val = v8::String::new(scope, value.1.as_str()).unwrap();

    context_object.set(
      scope,
      key.into(),
      val.into()
    ); 
  }

  context
    .global(scope)
    .set(
      scope, 
      var_args_name, 
      context_object.into()
    );

  let result_with_var = script.run(scope).unwrap();
  let result_with_var = result_with_var.to_string(scope).unwrap();
  let result_with_var = result_with_var.to_rust_string_lossy(scope);

  return result_with_var;
}

// Plugins
pub fn get_plugins_configs() -> Vec<PluginRuntimeManifest> {
  let plugins_raw = fs::read_to_string("./plugins.toml")
    .unwrap();

  let table: Table = toml::from_str(plugins_raw.as_str()).unwrap();
  let mut plugins: Vec<PluginRuntimeManifest> = Vec::new();

  'plugins_iter: for value in table.iter() {
    let mut has_error = false;

    let keys = value.1.as_table().unwrap();
    let plugin = value.0.as_str();
    let reference = vec!["name", "attach_at", "version", "description", "engine", "src"];

    if plugin == "example" {
      continue 'plugins_iter;
    }

    for value in reference.clone() {
      if !keys.contains_key(value) {
        if CONFIG["stdout_warning"].as_bool().unwrap() {
          println!("[ {warning} ]: Property '{prop}' not found in '{plugin}' plugin", warning = "WARNING".yellow(), plugin=plugin, prop = value);
        }

        has_error = true;
      }
    }

    if has_error {
      if CONFIG["stdout_warning"].as_bool().unwrap() {
        println!("[ {warning} ]: Fix it with:", warning = "WARNING".yellow());
        println!("[{plugin}]", plugin=plugin);
  
        for prop in reference {
          println!("{prop}=\"{value}\"", prop=prop, value=if keys.contains_key(prop) { keys.get(prop).unwrap().as_str().unwrap().white() } else { "fill this field".blue() });
        }
      }

      continue 'plugins_iter;
    }
  
    let absolute_path = Path
      ::new(CONFIG["dir_plugins"].as_str().unwrap())
      .join(value.1["src"].as_str().unwrap().to_string());

    let raw = PluginRuntimeManifest {
      name: value.0.to_string(),
      absolute_path: fs::canonicalize(absolute_path)
        .unwrap()
        .to_str()
        .unwrap()
        .to_string(),
      
      version: value.1["version"].as_str().unwrap().to_string(),
      description: value.1["description"].as_str().unwrap().to_string(),
      engine: value.1["engine"].as_str().unwrap().to_string(),
      attach_at: value.1["attach_at"].as_str().unwrap().to_string(),
    };
  
    plugins.push(raw);
  }

  return plugins;
}

pub fn register_plugins() {
  INIT.call_once(|| {
    let platform = v8::new_default_platform(0, false).make_shared();

    v8::V8::initialize_platform(platform);
    v8::V8::initialize();
  });

  for plugin in get_plugins_configs() {
    PLUGINS_RUNTIME
      .lock()
      .unwrap()
      .push(plugin);
  }

  // if CONFIG["is_plugins_enabled"].as_bool().unwrap() {
  //   for plugin in PLUGINS_MANIFESTS.iter() {
  //     let name = plugin.0;
  //     let plugin_manifest = plugin.1.as_table().unwrap();
      
  //     if name == "example" {
  //       continue;
  //     }
      
  //     println!("{}", name);  
  //     println!("{}", plugin_manifest);  
  //   }

  //   // let path = Path::new(CONFIG["dir_plugins"].as_str().unwrap());

  //   // for entry in path.read_dir().expect("read_dir call failed") {
  //   //   if let Ok(entry) = entry {
  //   //     let p = fs::canonicalize(entry.path()).unwrap();
       
  //   //     // let raw = fs::read_to_string(p).unwrap();

  //   //     // let mut map: HashMap<String, String> = HashMap::new();
        
  //   //     // map.insert(String::from("data1"), String::from("data_var"));
  //   //     // map.insert(String::from("data2"), String::from("data_var"));

  //   //     // let out = call_it_plugin(
  //   //     //   raw.as_str(),
  //   //     //   map
  //   //     // );

  //   //     let manifest = PluginManifest {
  //   //       name: String::from(p.as_path().file_name().unwrap().to_str().unwrap()),
  //   //       absolute_path: String::from(p.to_str().unwrap()),
  //   //     };

  //   //     PLUGINS.lock().unwrap().insert(
  //   //       String::from(""),
  //   //       manifest
  //   //     );
  //   //   }
  //   // }
  // }
}