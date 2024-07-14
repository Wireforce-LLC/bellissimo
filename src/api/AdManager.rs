use chrono::{DateTime, Duration, Utc};
use mongodb::bson::doc;
use rocket::form::FromForm;
use serde::{Serialize, Deserialize};
use crate::ad_campaign_manager::{AdCampaignManager, AdCampaignType};
use crate::mongo_sdk::MongoDatabase;
use rocket::http::{ContentType, Status};
use serde_json::json;

/**
 * Struct representing an Ad Campaign.
 */
#[derive(Serialize, Deserialize, Clone, Debug, FromForm)]
pub struct AdCampaign {
  pub time: Option<i64>,
  
  // The name of the campaign. 
  // This is the internal name of the campaign set by the advertiser.
  //
  // Example: "Summer Sale 2022 Campaign"
  pub name: String,
  
  // The ID of the campaign.
  // This ID is used by the operator's advertising platform to identify the campaign.
  //
  // Example: "2056295633252"
  pub campaign_id: String,
  
  // The target click values.
  // These are the clicks that are defined as key performance indicators (KPIs) for the campaign.
  //
  // Example: ["Buy Now Clicks", "Contact Us Clicks"]
  pub target_click: Vec<String>,
  
  // The type of the campaign. Indicates the operator associated with the campaign.
  pub campaign_type: u8
}

#[derive(Serialize, Deserialize, Clone, Debug, FromForm)]
pub struct SelectorDateOfCampaign {
  pub start_time: i64,
  pub end_time: i64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AdManagerCampaign {
  pub time: i64,
  pub name: String,
  pub campaign_id: String,
  pub target_click: Vec<String>,
  pub campaign_type: u8,
  pub kpi_success: u8,
  pub kpi_fail: u8,
  pub kpi_percent: f64,
  pub count_clicks: u8,
}

/**
 * Get all campaigns.
 */
#[get("/adsmanager/campaigns/list?<selector..>")]
pub fn list_campaigns(selector: SelectorDateOfCampaign) -> (Status, (ContentType, String)) {
  let collection = MongoDatabase::use_campaigns_collection();
  let result = collection.find(doc! {}, None);

  if result.is_err() {
    return (
      Status::InternalServerError, 
      (
        ContentType::JSON,
        json!({
          "isOk": false,
          "value": null,
          "error": result.unwrap_err().to_string()
        }).to_string()
      )
    );
  }

  let result = result.unwrap();
  let mut campaigns_vec: Vec<AdManagerCampaign> = Vec::new();

  for campaign in result {
    let campaign = campaign.unwrap();
    let campaign_results = AdCampaignManager::collect_kpi_by_campaign_id(
      campaign.campaign_id.clone(),
      campaign.target_click.clone(),
      DateTime::from_timestamp(selector.start_time.clone(), 0).unwrap(),
      DateTime::from_timestamp(selector.end_time.clone(), 0).unwrap(),
      AdCampaignType::from_u8(campaign.campaign_type)  
    );

    if campaign_results.is_none() {
      let campaign = AdManagerCampaign {
        time: campaign.time.unwrap_or(0),
        name: campaign.name,
        campaign_id: campaign.campaign_id,
        target_click: campaign.target_click,
        campaign_type: campaign.campaign_type,
        kpi_success: 0,
        kpi_fail: 0,
        kpi_percent: 0.0,
        count_clicks: 0
      };

      campaigns_vec.push(campaign);
    } else {
      let campaign_results = campaign_results.unwrap();
      
      let campaign = AdManagerCampaign {
        time: campaign.time.unwrap_or(0),
        name: campaign.name,
        campaign_id: campaign.campaign_id,
        target_click: campaign.target_click,
        campaign_type: campaign.campaign_type,
        kpi_success: campaign_results.get_i32("cakpi").unwrap_or(0) as u8,
        kpi_fail: campaign_results.get_i32("caNokpi").unwrap_or(0) as u8,
        kpi_percent: campaign_results.get_f64("kpiPercent").unwrap_or(0.0) as f64,
        count_clicks: campaign_results.get_i32("countClicks").unwrap_or(0) as u8,
      };

      campaigns_vec.push(campaign);
    }
  }

  (
    Status::Ok, 
    (
      ContentType::JSON,
      json!({
        "isOk": true,
        "value": campaigns_vec,
        "error": null
      }).to_string()
    )
  )

}

#[post("/adsmanager/create", data="<campaign>")]
pub fn create_campaign(campaign: String) -> (Status, (ContentType, String)) {
  let campaign = serde_json::from_str(&campaign);

  if campaign.is_err() {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        json!({
          "isOk": false,
          "value": null,
          "error": format!("Invalid campaign: {}", campaign.unwrap_err().to_string())
        }).to_string()
      )
    );
  }

  let campaign: AdCampaign = campaign.unwrap();

  let campaign = AdCampaign {
    time: Some(Utc::now().timestamp_millis()),
    
    ..campaign
  };

  let collection = MongoDatabase::use_campaigns_collection();

  if !AdCampaignType::u8_is_enum(campaign.campaign_type) {
    return (
      Status::BadRequest, 
      (
        ContentType::JSON,
        json!({
          "isOk": false,
          "value": null,
          "error": "Invalid campaign type"
        }).to_string()
      )
    );
  }

  let result = collection.insert_one(campaign, None);

  if result.is_err() {
    return (
      Status::InternalServerError, 
      (
        ContentType::JSON,
        json!({
          "isOk": false,
          "value": null,
          "error": "Failed to insert campaign"
        }).to_string()
      )
    );
  }

  let response = json!({
    "isOk": true,
    "value": null,
    "error": null
  });

  let result = response.to_string();

  return (
    Status::Created, 
    (
      ContentType::JSON,
      result
    )
  );
}