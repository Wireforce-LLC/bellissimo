use toml::Table;
use std::{fs, sync::Arc};

lazy_static! {
  // Define static variables
  // Define config
  pub static ref CONFIG: Arc<Table> = Arc::new(
    fs::read_to_string("./config.toml")
      .expect("Unable to read config.toml")
      .parse::<Table>()
      .expect("Unable to parse config.toml")
  );
}