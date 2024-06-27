use serde::{Serialize, Deserialize};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateFile {
  pub name: String,
  pub pwd: String,
}