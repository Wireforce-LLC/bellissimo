use toml::Table;
use std::fs;

lazy_static! {
  pub static ref CONFIG: Table = toml::from_str(
    fs::read_to_string("./config.toml").unwrap().as_str()
  ).unwrap();
}