use crate::{config::CONFIG, dynamic_router::{BOT_DETECTOR, REDIS}, filter_kit::{self, ext_filter_v8}, guard_kit, ipsum_kit, plugin::get_all_runtime_plugins};

use std::{collections::HashMap, net::IpAddr};
use asn_db::Record;
use redis::Commands;
use rocket::http::HeaderMap;
use uaparser::{Parser, UserAgentParser};

#[path="../filter/UA.rs"] mod ua;
#[path="../filter/ASNGroups.rs"] mod asn_groups;
#[path="../filter/ASNOwner.rs"] mod asn_owner;
#[path="../filter/ASNCountryCode.rs"] mod asn_country_code;
#[path="../filter/IPCountryCode.rs"] mod ip_country_code;
#[path="../filter/Referrer.rs"] mod referrer;
#[path="../filter/AcceptLanguage.rs"] mod accept_language;
#[path="../filter/SessionID.rs"] mod session_id;
#[path="../filter/IP.rs"] mod ip;
#[path="../filter/UABot.rs"] mod ua_bot;
#[path="../filter/CookieString.rs"] mod cookie_string;
#[path="../filter/Random.rs"] mod random;
#[path="../filter/UADeviceFamily.rs"] mod ua_device_family;
#[path="../filter/UADeviceBrand.rs"] mod ua_device_brand;
#[path="../filter/Tor.rs"] mod tor;
#[path="../filter/Ipsum.rs"] mod ipsum;
#[path="../filter/Ddos.rs"] mod ddos;
#[path="../filter/RequestGuard.rs"] mod request_guard;
#[path="../filter/SecChUAPlatform.rs"] mod sec_ch_ua_platform;
#[path="../filter/WebView.rs"] mod webview;
#[path="../filter/BlackReferer.rs"] mod black_referer;
#[path="../filter/AdvertisingCampaign.rs"] mod advertising_campaign;
#[path="../filter/QueryBind.rs"] mod query_bind;

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
  asn_groups::register_filter();
  ua::register_filter();
  asn_owner::register_filter();
  asn_country_code::register_filter();
  ip_country_code::register_filter();
  referrer::register_filter();
  accept_language::register_filter();
  session_id::register_filter();
  ip::register_filter();
  ua_bot::register_filter();
  cookie_string::register_filter();
  random::register_filter();
  ua_device_family::register_filter();
  ua_device_brand::register_filter();
  tor::register_filter();
  ipsum::register_filter();
  ddos::register_filter();
  request_guard::register_filter();  
  sec_ch_ua_platform::register_filter();
  webview::register_filter();
  black_referer::register_filter();
  advertising_campaign::register_filter();
  query_bind::register_filter();

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