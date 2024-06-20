use toml::Table;
use std::{fs, sync::Arc};

fn get_config() -> toml::map::Map<std::string::String, toml::Value> {
  let mut ext = fs::read_to_string("./config.toml")
    .expect("Unable to read config.toml")
    .parse::<Table>()
    .expect("Unable to parse config.toml");

  let local = fs::read_to_string("./config.local.toml")
    .expect("Unable to read config.local.toml")
    .parse::<Table>()
    .expect("Unable to parse config.local.toml");
    
  ext.extend(local);

  return ext;
}

lazy_static! {
  // Define static variables
  // Define config
  pub static ref CONFIG: Arc<Table> = Arc::new(
    get_config()
  );
}