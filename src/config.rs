use toml::Table;

lazy_static! {
    pub static ref CONFIG: Table = toml::from_str(include_str!("../config.toml")).unwrap();
}