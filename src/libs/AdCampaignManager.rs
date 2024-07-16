use chrono::{DateTime, Utc};
use mongodb::bson::{doc, Bson, Document};
use serde::{Deserialize, Serialize};
use crate::mongo_sdk::MongoDatabase;

pub struct AdCampaignManager { }

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub enum AdCampaignType {
  Facebook = 101,
  GoogleAds = 102,
  GoogleSearch = 103,
  GoogleDisplay = 104,
  GoogleShopping = 105,
  Bing = 106,
  TikTok = 107,
}

impl AdCampaignType {
  pub fn u8_is_enum(value: u8) -> bool {
    return (101..107).contains(&value);
  }

  pub fn from_u8(value: u8) -> AdCampaignType { 
    match value {
      101 => AdCampaignType::Facebook,
      102 => AdCampaignType::GoogleAds,
      103 => AdCampaignType::GoogleSearch,
      104 => AdCampaignType::GoogleDisplay,
      105 => AdCampaignType::GoogleShopping,
      106 => AdCampaignType::Bing,
      107 => AdCampaignType::TikTok,
      _ => AdCampaignType::Facebook
    }
  }
}

/*
 * Collects campaigns and their performance statistics.
 * This functions-set is used to collect campaigns and their performance statistics.
 */
impl AdCampaignManager {
  /*
   * Collects KPIs by campaign ID and target clicks names.
   * This function is used to collect KPIs by campaign ID and target clicks names.
   */
  pub fn collect_kpi_by_campaign_id(
    campaign_id: String, 
    target_clicks_names: Vec<String>,
    start_time: DateTime<Utc>,
    end_time: DateTime<Utc>,
    campaign_type: AdCampaignType
  ) -> Option<Document> {
    let collection = MongoDatabase::use_requests_collection();
    let targets: Vec<Document> = target_clicks_names.iter().map(|name| doc! {
      "$in": [
        name,
        doc! {
          "$ifNull": [
            "$clicks_arr",
            []
          ]
        }
      ]
    }).collect();

    let mut first_match = doc! {
      "headers.cf-connecting-ip": doc! {
        "$exists": true,
        "$ne": Bson::Null
      },
      "query.utm_campaign": doc! {
        "$ne": Bson::Null,
        "$exists": true
      },
      "time": doc! {
        "$gte": start_time.timestamp_micros(),
        "$lte": end_time.timestamp_micros()
      },
    };

    match campaign_type {
      AdCampaignType::Facebook => {
        first_match.extend(doc! {
          "query.fbclid": doc! {
            "$ne": Bson::Null,
            "$exists": true
          },
        });
      },

      AdCampaignType::GoogleAds => {
        first_match.extend(doc! {
          "query.gclid": doc! {
            "$ne": Bson::Null,
            "$exists": true
          },
        });
      },

      _ => {}
    }

    let pipeline = vec![
      doc! {
        "$match": first_match
      },
      doc! {
        "$group": doc! {
          "_id": "$headers.cf-connecting-ip",
          "ip": doc! {
            "$max": "$headers.cf-connecting-ip"
          },
          // "country": doc! {
          //   "$max": "$headers.cf-ipcountry"
          // },
          // "first_request": doc! {
          //   "$min": "$time"
          // },
          // "last_request": doc! {
          //   "$max": "$time"
          // },
          // "count_requests": doc! {
          //   "$sum": 1
          // },
          // "resources": doc! {
          //   "$addToSet": "$resource_id"
          // },
          "campaigns": doc! {
            "$addToSet": "$query.utm_campaign"
          }
        }
      },
      doc! {
        "$lookup": doc! {
          "from": "clicks",
          "localField": "ip",
          "foreignField": "ip",
          "as": "clicks",
          "pipeline": [
            doc! {
              "$group": doc! {
                "_id": Bson::Null,
                "uniqueValues": doc! {
                  "$addToSet": "$name"
                }
              }
            },
            doc! {
              "$project": doc! {
                "_id": 0,
                "uniqueValues": 1
              }
            }
          ]
        }
      },
      doc! {
        "$addFields": doc! {
          "clicks_arr": "$clicks.uniqueValues"
        }
      },
      doc! {
        "$replaceRoot": doc! {
          "newRoot": doc! {
            "ip": "$ip",
            // "clicks_arr": doc! {
            //   "$max": "$clicks_arr"
            // },
            // "country": "$country",
            // "first_request": "$first_request",
            // "last_request": "$last_request",
            // "flow_time": doc! {
            //   "$subtract": [
            //     "$last_request",
            //     "$first_request"
            //   ]
            // },
            "count_requests": "$count_requests",
            // "resources": "$resources",
            "campaigns": "$campaigns"
          }
        }
      },
      doc! {
        "$addFields": doc! {
          "isTargetConversion": doc! {
            "$or": targets
          }
        }
      },
      doc! {
        "$match": doc! {
          // "last_request": doc! {
          //   "$gte": start_time.timestamp_micros(),
          //   "$lte": end_time.timestamp_micros()
          // },
          "campaigns": doc! {
            "$in": [
              campaign_id,
              "$campaigns"
            ]
          }
        }
      },
      doc! {
        "$group": doc! {
          "_id": Bson::Null,
          "countClicks": doc! {
              "$sum": 1
          },
          "cakpi": doc! {
            "$sum": doc! {
              "$cond": [
                doc! {
                  "$eq": [
                    "$isTargetConversion",
                    true
                  ]
                }, 1, 0
              ]
            }
          },
          "caNokpi": doc! {
            "$sum": doc! {
              "$cond": [
                doc! {
                  "$eq": [
                    "$isTargetConversion",
                    false
                  ]
                }, 1, 0
              ]
            }
          }
        }
      },
      doc! {
        "$addFields": doc! {
          "kpiPercent": doc! {
            "$multiply": [
              doc! {
                "$divide": [
                  "$cakpi",
                  "$caNokpi"
                ]
              },
              100
            ]
          }
        }
      }
    ];

    let aggr = collection.aggregate(pipeline, None);

    match aggr {
      Ok(mut cursor) => {
        let next = cursor.next();

        if next.is_none() {
          return None;
        }

        let result = next.unwrap();

        if result.is_err() {
          return None;
        }

        let result = result.unwrap();
        
        return Some(result);
      }

      Err(err) => {
        return None;
      }
    }
  }
}