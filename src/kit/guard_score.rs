use asn_db::Record;
use rocket::http::HeaderMap;
use serde::{Deserialize, Serialize};

use crate::{config::CONFIG, dynamic_router::BOT_DETECTOR, ipsum_kit};

pub struct TrafficRequest<'a> {
    pub asn_record: Record,
    pub ip: String,
    pub user_agent: String,
    pub headers: HeaderMap<'a>,
    pub resource_id: Option<String>,
    pub request_id: Option<String>,
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct CalculateScore {
    pub name: String,
    pub value: i8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GuardScore {
    pub score: i8,
    pub score_calculate: Vec<CalculateScore>,
    pub quality_traffic_density: i8,
    pub is_tor: Option<bool>,
    pub tags: Vec<String>,
    pub resource_id: Option<String>,
    pub request_id: Option<String>,
}

pub fn rate_traffic(traffic: TrafficRequest) -> GuardScore {
  let black_ref = include_str!("../../containers/black_referer.txt");

    let score = 100;
    let mut quality_traffic_density = 0;
    let mut score_calculate: Vec<CalculateScore> = Vec::new();
    let mut is_tor: Option<bool> = None;
    let mut tags = Vec::new();

    let headers_count = traffic.headers.len();

    let accept_language = traffic
        .headers
        .get_one("accept-language")
        .unwrap_or("")
        .to_lowercase();

    let accept = traffic
        .headers
        .get_one("accept")
        .unwrap_or("")
        .to_lowercase();

    let accept = accept.split(",").into_iter().map(|x| x.to_string()).collect::<Vec<String>>();

    let upgrade_insecure_requests = traffic
        .headers
        .get_one("upgrade-insecure-requests")
        .unwrap_or("")
        .to_lowercase();

    let set_fetch_mode = traffic
        .headers
        .get_one("sec-fetch-mode")
        .unwrap_or("")
        .to_lowercase();

    let sec_ua_platform = traffic
        .headers
        .get_one("sec-ch-ua-platform")
        .unwrap_or("")
        .to_lowercase();

    let referer = traffic
        .headers
        .get_one("referer")
        .unwrap_or("")
        .to_lowercase();

    let sec_fetch = traffic
        .headers
        .get_one("sec-fetch-dest")
        .unwrap_or("")
        .to_lowercase();

    let x_requested_with = traffic
        .headers
        .get_one("x-requested-with")
        .unwrap_or("")
        .to_lowercase();

    let country_by_cloudflare = traffic
        .headers
        .get_one("cf-ipcountry")
        .unwrap_or("")
        .to_lowercase();

    let country_by_asn = traffic
        .asn_record
        .country
        .to_lowercase();

    let user_agent_in_headers = traffic
        .headers
        .get_one("user-agent")
        .unwrap_or("")
        .to_lowercase();

    let is_ipsum = if traffic.ip != "" {
      ipsum_kit::search_ip_in_ipsum_registries(
        traffic.ip.as_str(), 
        CONFIG["use_ipsum_once_join_for_score"].as_bool().unwrap()
      )
    } else {
      None
    };

    if headers_count < 5 {
      tags.push("Low headers count");

      score_calculate.push(
        CalculateScore {
          name: String::from("Low headers count"),
          value: 5
        }  
      );
    }
    
    let is_ua_bot = if user_agent_in_headers != "" {
      Some(BOT_DETECTOR.is_bot(traffic.user_agent.as_str()))
    } else {
      None
    };

    if is_ua_bot.is_some() && is_ua_bot.unwrap() {
      tags.push("Bot user-agent");

      score_calculate.push(
        CalculateScore {
          name: String::from("User agent is bot"),
          value: 25
        }  
      );
    }

    if is_ipsum.is_some() {
      tags.push("Ipsum traffic");
      
      if CONFIG["use_ipsum_once_join_for_score"].as_bool().unwrap() {
        score_calculate.push(
          CalculateScore {
            name: String::from(format!("IP is in ipsum database ({})", is_ipsum.unwrap().ipsum.unwrap().first().unwrap().registry)),
            value: 15
          }  
        );

      } else {
        for ipsum_registry in is_ipsum.unwrap().ipsum.unwrap() {
          score_calculate.push(
            CalculateScore {
              name: String::from(format!("IP is regarded as IP, traffic transmission IPSUM, subcategories {}", ipsum_registry.registry)),
              value: 7
            }  
          );
        }
      }
    }


    if &country_by_cloudflare == "T1" {
      tags.push("Tor exit node");

      is_tor = Some(true);
      
      score_calculate.push(
        CalculateScore {
          name: String::from("With a high degree of probability, this traffic comes from the Tor network"),
          value: 50
        }
      )
    }
    
    if country_by_cloudflare != "" && (country_by_asn.to_lowercase().trim() != country_by_cloudflare.to_lowercase().trim()) {
        score_calculate.push(
            CalculateScore {
                name: String::from("IP country by cloudflare and asn is not equal"),
                value: 5
            }  
        );
    }

    let country = if country_by_cloudflare == "" { country_by_asn } else { country_by_cloudflare };

    if accept_language != "" && !accept_language.contains(country.to_lowercase().as_str()) {
        score_calculate.push(
            CalculateScore {
                name: String::from("Accept language not contains country"),
                value: 10
            }  
        );
    }

    if sec_fetch != "document" {
        score_calculate.push(
            CalculateScore {
                name: String::from("Sec-Fetch-Dest is not document"),
                value: 3
            }  
        );
    }

    if sec_ua_platform == "" {
        score_calculate.push(
            CalculateScore {
                name: String::from("Sec-Ch-Ua-Platform is empty"),
                value: 3
            }  
        );
    }

    if user_agent_in_headers == "" {
        score_calculate.push(
            CalculateScore {
                name: String::from("User agent is empty"),
                value: 13
            }  
        );
    }

    if set_fetch_mode != "navigate" {
        score_calculate.push(
            CalculateScore {
                name: String::from("Sec-Fetch-Mode is not navigate"),
                value: 3
            }  
        );
    }

    if accept.contains(&"text/html".to_string()) && accept.contains(&"application/xhtml+xml".to_string()) && accept.contains(&"application/xml;q=0.9".to_string()) && accept.contains(&"image/avif".to_string()) && accept.contains(&"image/webp".to_string())  {
      quality_traffic_density += 10;
    }

    if upgrade_insecure_requests == "1" {
      quality_traffic_density += 5;
    }

    if black_ref.contains(&referer) { 
      quality_traffic_density -= 5;
    }

    if x_requested_with.to_lowercase() == "XMLHttpRequest".to_lowercase() {
      score_calculate.push(
        CalculateScore {
          name: String::from("X-Requested-With is XMLHttpRequest. Not safe. The X-Requested-With header is an HTTP request header that is typically set by JavaScript libraries and frameworks like jQuery when making AJAX requests using XMLHttpRequest. The X-Requested-With header is used to identify the request as an AJAX request"),
          value: 5
        }
      )
    }

    let score = score - score_calculate.iter().map(|x| x.value).sum::<i8>();

    return GuardScore {
      score: if score > 100 { 100 } else { if score < 0 { 0 } else { score } },
      score_calculate,
      quality_traffic_density: if quality_traffic_density > 100 { 100 } else { if quality_traffic_density < 0 { 0 } else { quality_traffic_density } },
      is_tor: is_tor,
      tags: tags.iter().map(|x| x.to_string()).collect(),
      request_id: traffic.request_id,
      resource_id: traffic.resource_id,
    }
}