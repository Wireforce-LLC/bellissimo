use serde::{Deserialize, Serialize};

#[derive(FromForm)]
#[derive(Serialize, Deserialize, Debug)]
pub struct PostbackPayoutPostback {
  pub uuid: Option<String>,
  pub date: Option<String>,
  pub status: Option<String>,
  pub ip: Option<String>,
  pub amount: Option<u128>,
  pub stream: Option<String>,
  pub currency: Option<String>,
  pub time: Option<i64>
}
