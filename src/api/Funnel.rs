use rocket::http::{ContentType, Status};
use crate::funnel_sdk::{Funnel, FunnelByClicksFilter, FunnelStandardFilter};

#[derive(FromForm)]
pub struct FunnelClicksQuery {
    pub start_time: Option<u32>,
    pub end_time: Option<u32>,
    pub limit: Option<u32>,
    pub skip: Option<u32>,
    pub hide_short_schemas: Option<bool>,
}

#[derive(FromForm)]
pub struct FunnelClicksDateQuery {
    pub start_time: Option<u32>,
    pub end_time: Option<u32>,
    pub limit: Option<u32>,
    pub skip: Option<u32>,
}

#[get("/funnel/clicks?<query..>")]
pub fn funnel_by_clicks_to_schemas(query: FunnelClicksQuery) -> (Status, (ContentType, String)) {
  let funnel = Funnel::funnel_by_clicks(
    FunnelStandardFilter {
      start_time: query.start_time,
      end_time: query.end_time,
      limit: query.limit,
      skip: query.skip,
    },
    FunnelByClicksFilter {
      hide_short_schemas: query.hide_short_schemas,
    }
  );

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": funnel
      }).to_string()
    )
  )
}

#[get("/funnel/clicks/date?<query..>")]
pub fn funnel_by_date(query: FunnelClicksDateQuery) -> (Status, (ContentType, String)) {
  let funnel = Funnel::funnel_by_date(
    FunnelStandardFilter {
      start_time: query.start_time,
      end_time: query.end_time,
      limit: query.limit,
      skip: query.skip,
    }
  );

  return (
    Status::Ok, 
    (
      ContentType::JSON,
      serde_json::json!({
        "isOk": true,
        "error": null,
        "value": funnel
      }).to_string()
    )
  )
}