use std::{collections::HashMap, fs, path::{Path, PathBuf}};
use chrono::{DateTime, TimeZone, Utc};
use mongodb::{bson::{doc, document}, options::FindOptions, sync::Collection};
use rocket::{form::Form, http::{ContentType, Status}, FromForm};
use crate::{asn_record::{AsnRecord, RouteWay}, background_service::User, database::get_database, guard_kit::GuardScore, plugin::{get_all_runtime_plugins, PluginRuntimeManifest}};

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

