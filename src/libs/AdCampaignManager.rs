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

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct AdCampaignClickRecord {
  pub month: i32,
  pub day: i32,
  pub year: i32,
  pub clicks: i32
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct AdCampaignKpi {
  pub campaign_id: String,
  pub clicks: i32,
  pub target_records: i32,
  pub not_target_records: i32,
  pub success_rate: i32
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

impl AdCampaignManager {
  pub fn collect_campaign_clicks_history(
    start_time: DateTime<Utc>,
    end_time: DateTime<Utc>,
    utm_campaign_name: &str
  ) -> Vec<AdCampaignClickRecord> {
    let collection = MongoDatabase::use_requests_collection();
    let pipeline = vec![
        doc! {
            "$match": doc! {
                "query.utm_campaign": doc! {
                  "$eq": utm_campaign_name
                },
                "time": doc! {
                  "$gte": start_time.timestamp_micros(),
                  "$lte": end_time.timestamp_micros()
                }
            }
        },
        doc! {
            "$group": doc! {
                "_id": "$headers.cf-connecting-ip",
                "campaign": doc! {
                    "$max": "$query.utm_campaign"
                },
                "time": doc! {
                    "$max": "$time"
                }
            }
        },
        doc! {
            "$project": doc! {
                "y": doc! {
                    "$year": doc! {
                        "$toDate": doc! {
                            "$divide": [
                                "$time",
                                1000
                            ]
                        }
                    }
                },
                "m": doc! {
                    "$month": doc! {
                        "$toDate": doc! {
                            "$divide": [
                                "$time",
                                1000
                            ]
                        }
                    }
                },
                "d": doc! {
                    "$dayOfMonth": doc! {
                        "$toDate": doc! {
                            "$divide": [
                                "$time",
                                1000
                            ]
                        }
                    }
                },
                "h": doc! {
                    "$hour": doc! {
                        "$toDate": doc! {
                            "$divide": [
                                "$time",
                                1000
                            ]
                        }
                    }
                },
                "tweet": 1
            }
        },
        doc! {
            "$group": doc! {
                "_id": doc! {
                    "month": "$m",
                    "day": "$d",
                    "year": "$y"
                },
                "count": doc! {
                    "$count": doc! {}
                }
            }
        },
        doc! {
            "$sort": doc! {
                "_id.d": -1,
                "_id.m": -1,
                "_id.y": -1
            }
        },
        doc! {
            "$sort": doc! {
                "_id": -1
            }
        },
        doc! {
            "$limit": 14
        }
    ];

    let mut clicks_history: Vec<AdCampaignClickRecord> = Vec::new();
    let aggr = collection.aggregate(pipeline, None);

    for doc in aggr.unwrap() {
      let doc = doc.unwrap();
      
      let record = AdCampaignClickRecord {
        // month: doc.get("_id.month").unwrap(),
        // day: doc.get_i32("_id.day").unwrap(),
        // year: doc.get_i32("_id.year").unwrap(),
        // clicks: doc.get_i32("count").unwrap()
        month: doc.get_document("_id").unwrap().get_i32("month").unwrap(),
        day: doc.get_document("_id").unwrap().get_i32("day").unwrap(),
        year: doc.get_document("_id").unwrap().get_i32("year").unwrap(),
        clicks: doc.get_i32("count").unwrap()
      };

      clicks_history.push(record);
    }

    return clicks_history;
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
  ) -> Option<AdCampaignKpi> {
    let collection = MongoDatabase::use_requests_collection();
    let targets: Vec<Document> = target_clicks_names.iter().map(|name| doc! {
      "$in": [
          "wantInstall",
          "$clicks_arr"
      ]
    }).collect();

    let mut first_match = doc! {
      "query.utm_campaign": doc! {
        "$eq": campaign_id
      },
      "time": doc! {
        "$gte": start_time.timestamp_micros(),
        "$lte": end_time.timestamp_micros()
      }
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
          "time": doc! {
            "$max": "$time"
          },
          "campaign": doc! {
            "$max": "$query.utm_campaign"
          }
        }
      },
      doc! {
        "$lookup": doc! {
          "from": "clicks",
          "localField": "_id",
          "foreignField": "ip",
          "as": "clicks"
        }
      },
      doc! {
        "$addFields": doc! {
          "clicks_arr": doc! {
            "$map": doc! {
              "input": "$clicks",
              "as": "click",
              "in": "$$click.name"
            }
          }
        }
      },
      doc! {
        "$addFields": doc! {
          "is_target": doc! {
            "$or": targets
          }
        }
      },
      doc! {
          "$group": doc! {
              "_id": "$campaign",
              "count": doc! {
                  "$count": doc! {}
              },
              "target_records": doc! {
                  "$sum": doc! {
                      "$cond": [
                          doc! {
                              "$eq": [
                                  "$is_target",
                                  true
                              ]
                          },
                          1,
                          0
                      ]
                  }
              },
              "not_target_records": doc! {
                  "$sum": doc! {
                      "$cond": [
                          doc! {
                              "$eq": [
                                  "$is_target",
                                  false
                              ]
                          },
                          1,
                          0
                      ]
                  }
              }
          }
      },
      doc! {
          "$addFields": doc! {
              "success_rate": doc! {
                  "$toInt": doc! {
                      "$multiply": [
                          doc! {
                              "$divide": [
                                  "$target_records",
                                  "$not_target_records"
                              ]
                          },
                          100
                      ]
                  }
              }
          }
      },
      doc! {
          "$sort": doc! {
              "is_target": -1
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

        println!("result: {:?}", result);
        
        let result = AdCampaignKpi {
          campaign_id: result.get("_id").unwrap().as_str().unwrap_or("Untitled").to_string(),
          clicks: result.get("count").unwrap().as_i32().unwrap_or(0),
          target_records: result.get("target_records").unwrap().as_i32().unwrap_or(0),
          not_target_records: result.get("not_target_records").unwrap().as_i32().unwrap_or(0),
          success_rate: result.get("success_rate").unwrap().as_i32().unwrap_or(0),
        };

        return Some(result);
      }

      Err(err) => {
        return None;
      }
    }
  }
}