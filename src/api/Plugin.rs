use rocket::http::{ContentType, Status};
use crate::plugin::{get_all_runtime_plugins, PluginRuntimeManifest};

#[get("/plugins/list")]
pub fn get_all_plugins() -> (Status, (ContentType, String)) {
  let mut plugins: Vec<PluginRuntimeManifest> = Vec::new();

  for plugin in get_all_runtime_plugins() {
    plugins.push(plugin);
  }

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": plugins
      }).to_string()
    )
  )
}

