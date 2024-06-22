use crate::{config::CONFIG, dynamic_router::{BOT_DETECTOR, REDIS}, filter_kit::{self, ext_filter_v8}, guard_kit, ipsum_kit, plugin::get_all_runtime_plugins};

use std::{collections::HashMap, net::IpAddr};
use asn_db::Record;
use fake::faker::automotive::raw;
use redis::Commands;
use rocket::http::HeaderMap;
use uaparser::{Parser, UserAgentParser};

// Filter method by Proxycheck
fn proxycheck_io(_this: &str, x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, _filter_value: &str, operator: &str) -> bool {
  let always_disallow = vec!["::1", "127.0.0.1", "", "0.0.0.0"];
  let token = CONFIG["proxycheck_io_token"].as_str().unwrap();

  if always_disallow.contains(&x_real_ip) {
    return false;
  }

  let response = reqwest
    ::blocking
    ::get("https://proxycheck.io/v2/".to_owned() + x_real_ip + "?key=public-" + token + "vpn=1");

  if response.is_err() {
    return false;
  }

  let response = response.unwrap();
  let response = response.text().unwrap();
  let response = serde_json::from_str::<HashMap<String, serde_json::Value>>(&response);

  if response.is_err() {
    return false;
  }

  let response = response.unwrap();
  let response = response.get("proxy").unwrap();
  let response = response.as_str().unwrap();

  return match operator {
    "==" => response == "yes",
    "!=" => response != "yes",
    _ => false,
  }
}

pub fn register_default_filters() {
  filter_kit::register_filter(
    "asn::groups",
    |_this: &str,_x_real_ipp: &str, _user_agent: &str, _raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      if asn_record.is_none() {
        return false;
      }

      if operator != "in" {
        return false;
      }

      let record = asn_record.unwrap();
      let owner = record.owner.to_lowercase();
      let constains = filter_value.to_lowercase();
      let constains = constains.split(",").collect::<Vec<&str>>();

      let asn_raw = include_str!("../../containers/asn_owners_group.json");
      let asn_owners_groups: HashMap<&str, Vec<&str>> = serde_json::from_str(asn_raw).unwrap();
      
      for value in constains {
        let default_value = Vec::new();
        let known_asn = &asn_owners_groups.get(&value).unwrap_or(&default_value);

        for asn in known_asn.iter() {
          if owner.to_lowercase().contains(&asn.to_lowercase()) {
            return true;
          }
        }
      }

      return false;
    }
  );

  filter_kit::register_filter(
    "ua",
    |_this: &str, _x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => user_agent == filter_value,
        "!=" => user_agent != filter_value,
        ">" => user_agent > filter_value,
        ">=" => user_agent >= filter_value,
        "<" => user_agent < filter_value,
        "<=" => user_agent <= filter_value,
        "~" => user_agent.contains(filter_value),

        _ => false
      };
    }
  );

  filter_kit::register_filter(
    "asn::owner",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => {
          match asn_record {
            Some(record) => record.owner.to_lowercase() == filter_value.to_lowercase(),
            None => false
          }
        }

        "!=" => {
          match asn_record {
            Some(record) => record.owner.to_lowercase() != filter_value.to_lowercase(),
            None => false
          }
        }

        "~" => {
          match asn_record {
            Some(record) => record.owner.to_lowercase().contains(&filter_value.to_lowercase()),
            None => false
          }
        }
 
        _ => false
      };
    }
  );

  filter_kit::register_filter(
    "asn::country_code",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let cuntry_code = asn_record.unwrap().country.clone().to_uppercase();

      return match operator {
        "==" => cuntry_code == filter_value.to_uppercase(),
        "!=" => cuntry_code != filter_value.to_uppercase(),
        "~" => cuntry_code.contains(&filter_value.to_uppercase()),
        "in" => filter_value.to_uppercase().split(",").collect::<Vec<&str>>().contains(&cuntry_code.as_str()),

        _ => false
      };
    }
  );

  filter_kit::register_filter(
    "ip::country_code",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let cuntry_code = if raw_headers.get_one("cf-ipcountry").is_some() && CONFIG["use_cloudflare_data_priority"].as_bool().unwrap() {
        Some(raw_headers.get_one("cf-ipcountry").unwrap().to_string().to_uppercase())
      } else { 
        Some(asn_record.unwrap().country.clone().to_uppercase())
      };

      return match operator {
        "==" => cuntry_code.unwrap() == filter_value,
        "!=" => cuntry_code.unwrap() != filter_value,
        "~" => cuntry_code.unwrap().contains(filter_value),
        "in" => filter_value.split(",").collect::<Vec<&str>>().contains(&cuntry_code.unwrap().as_str()),

        _ => false
      };
    }
  );

  filter_kit::register_filter(
    "referrer",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => raw_headers.get_one("referer").unwrap_or("") == filter_value,
        "!=" => raw_headers.get_one("referer").unwrap_or("") != filter_value,
        "~" => raw_headers.get_one("referer").unwrap_or("").to_string().contains(filter_value),

        _ => false
      };
    }
  );

  filter_kit::register_filter(
    "accept_language",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      return match operator {
        "==" => raw_headers.get_one("accept-language").unwrap_or("") == filter_value,
        "!=" => raw_headers.get_one("accept-language").unwrap_or("") != filter_value,
        "~" => raw_headers.get_one("accept-language").unwrap_or("").to_string().contains(filter_value),

        _ => false
      };
    }
  );

  filter_kit::register_filter(
    "session_id",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let cookies = raw_headers.get_one("cookie").unwrap_or("").to_string();

      if cookies.is_empty() {
        return false;
      }

      let cookies = cookies.split(";").collect::<Vec<&str>>();
      let cookies_as_map = cookies.iter().map(|x| x.split("=").collect::<Vec<&str>>()).collect::<Vec<Vec<&str>>>();

      let php_sessid = cookies_as_map
        .iter()
        .find(|x| x[0] == "PHPSESSID");

      if php_sessid.is_none() {
        return false;
      }

      return match operator {
        "==" => php_sessid.unwrap()[1] == filter_value,
        "!=" => php_sessid.unwrap()[1] != filter_value,
        "~" => php_sessid.unwrap()[1].to_string().contains(filter_value),
        "in" => filter_value.split(",").collect::<Vec<&str>>().contains(&php_sessid.unwrap()[1]),

        _ => false
      };
    }
  );

  filter_kit::register_filter(
    "ip",
    |_this: &str, x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
      let real_ip = x_real_ip.parse::<IpAddr>();

      if real_ip.is_err() {
        return false;
      }

      return match operator {
          "==" => real_ip.unwrap() == filter_value.parse::<IpAddr>().unwrap(),
          "!=" => real_ip.unwrap() != filter_value.parse::<IpAddr>().unwrap(),
          ">" => real_ip.unwrap() > filter_value.parse::<IpAddr>().unwrap(),
          ">=" => real_ip.unwrap() >= filter_value.parse::<IpAddr>().unwrap(),
          "<" => real_ip.unwrap() < filter_value.parse::<IpAddr>().unwrap(),
          "<=" => real_ip.unwrap() <= filter_value.parse::<IpAddr>().unwrap(),
          "~" => real_ip.unwrap().to_string().contains(filter_value),

          _ => false
      }
    }
  );

  filter_kit::register_filter(
    "ua::bot", 
    |_this: &str, _x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, _filter_value: &str, operator: &str|  {
      return match operator {
        "==" => {
          return BOT_DETECTOR.is_bot(user_agent);
        }

        "!=" => {
          return !BOT_DETECTOR.is_bot(user_agent);
        }

        _ => false
      } 
    }
  );

  filter_kit::register_filter(
    "cookie::string",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str|  {

      return match operator {
        "==" => {
          return raw_headers
            .get_one("cookie")
            .unwrap_or("") == filter_value;
        }

        "!=" => {
          return raw_headers
            .get_one("cookie")
            .unwrap_or("") != filter_value;
        }

        "~" => {  
          return raw_headers
            .get_one("cookie")
            .unwrap_or("")
            .contains(filter_value);
        }

        _ => false
      }
    }
  );

  filter_kit::register_filter(
    "random",
    |_this: &str, _x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, _filter_value: &str, _operator: &str|  rand::random::<bool>()
  );

  filter_kit::register_filter(
    "ua::device::family",
    |_this: &str, _x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
      if user_agent.is_empty() {
        return false;
      }
      
      let ua_parser = UserAgentParser::from_bytes(include_bytes!("../../containers/user_agent_parser.bin")).expect("Parser creation failed");
      let client: uaparser::Client = ua_parser.parse(&user_agent);

      return match operator {
        "==" => {
          return client.device.family.to_lowercase() == filter_value.to_lowercase()
        }

        "!=" => {
          return client.device.family.to_lowercase() != filter_value.to_lowercase()
        }

        "~" => {
          return client.device.family.to_lowercase().contains(filter_value.to_lowercase().as_str())
        }

        _ => false
      }
    }
  );

  filter_kit::register_filter(
    "ua::device::brand",
    |_this: &str, _x_real_ip: &str, user_agent: &str, _raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
      if user_agent.is_empty() {
        return false;
      }
      
      let ua_parser = UserAgentParser::from_bytes(include_bytes!("../../containers/user_agent_parser.bin")).expect("Parser creation failed");
      let client: uaparser::Client = ua_parser.parse(&user_agent); 
      let brand = client.device.brand;

      if brand.is_none() {
        return false;
      }

      let brand = brand.unwrap().to_lowercase();
      
      return match operator {
        "==" => {
          return brand == filter_value.to_lowercase()
        }

        "!=" => {
          return brand != filter_value.to_lowercase()
        }

        "~" => {
          return brand.contains(filter_value.to_lowercase().as_str())
        }

        _ => false
      }
    }
  );

  filter_kit::register_filter(
    "traffic::tor",
    |_this: &str, _x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
      let ip = raw_headers.get_one("cf-ipcountry");

      if ip.is_none() {
        return false;
      }

      return match operator {
        "==" => ip.unwrap().to_lowercase() == "t1",
        "!=" => ip.unwrap().to_lowercase() != "t1",

        _ => false
      }
    }
  );

  filter_kit::register_filter(
    "traffic::ipsum",
    |_this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
      let is_ipsum = ipsum_kit::is_ip_in_ipsum(x_real_ip);

      if is_ipsum.is_none() {
        return false;
      }

      return match operator {
        "==" => true,

        _ => false
      }
    }
  );

  filter_kit::register_filter(
    "is_ddos",
    |_this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, _asn_record: Option<&Record>, filter_value: &str, operator: &str| {
      if x_real_ip.is_empty() {
        return false;
      }

      if x_real_ip == "127.0.0.1" {
        return false;
      }

      let mut conn = REDIS.lock().unwrap();

      let count_connections = conn.get("ddos:".to_owned() + x_real_ip).unwrap_or(0);
    
      let _: () = redis::pipe()
        .cmd("SETEX")
        .arg("ddos:".to_owned() + x_real_ip)
        .arg(60)
        .arg(count_connections + 1)
        .query(&mut conn)
        .expect("Unable to set redis result");

      if count_connections >= CONFIG["ddos_limit"].as_integer().unwrap_or(12) {
        return true;
      }

      return false;
    }
  );

  filter_kit::register_filter(
    "request_guard",
    |_this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, _filter_value: &str, operator: &str| {
      if asn_record.is_none() {
        return false;
      }

      let score: guard_kit::GuardScore = guard_kit::rate_traffic(
        guard_kit::TrafficRequest {
          asn_record: asn_record.unwrap().to_owned(),
          headers: raw_headers,
          user_agent: user_agent.to_string(),
          ip: x_real_ip.to_string(),
          request_id: None,
          resource_id: None
        }
      );

      return match operator {
        "==" => score.score > CONFIG["score_kit_value"].as_integer().unwrap() as i8,
        "!=" => score.score <= CONFIG["score_kit_value"].as_integer().unwrap() as i8,

        _ => false
      }
    }
  );

  if CONFIG.contains_key("proxycheck_io_token") {
    filter_kit::register_filter(
      "proxycheck_io",
      proxycheck_io
    );
  }
}

/**
 * Function to include runtime filters based on plugins.
 * Iterates through all runtime plugins and registers filters if conditions are met.
 */
pub fn include_runtime_filters() {
  for plugin in get_all_runtime_plugins() {
      if &plugin.attach_at == "plugin_filter" && &plugin.engine == "v8" {
          filter_kit::register_filter(
              &plugin.name, 
              ext_filter_v8
          )
      }
  }
}