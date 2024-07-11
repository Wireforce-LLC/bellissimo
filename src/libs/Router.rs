use std::{collections::HashMap, path::Path};
use asn_db::Record;
use chrono::Utc;
use rocket::http::HeaderMap;
use crate::{asn_record::{AsnRecord, RouteWay}, config::CONFIG, dynamic_router::{BOT_DETECTOR, UA_PARSER}, resource_kit::Resource, statistica_sdk::Converter};
use nanoid::nanoid;
use uaparser::Parser;

impl Converter {
    pub fn new() -> Converter {
      Converter {}
    }
  
    pub fn convert_params_to_meta_file_links(resource: &Resource) -> HashMap<String, String> {
      let mut meta = HashMap::new();
      
      if resource.file_path.is_some() {
        let root = resource.file_path.clone().unwrap();
        let root = Path::new(&root);
        let root = root.parent().unwrap();
        let root = root.to_str().unwrap().split('/').collect::<Vec<&str>>();
        
        let pwd = Path::new(CONFIG["http_server_serve_uri_path"].as_str().unwrap());

        meta.insert("pwd".to_string(), pwd.as_os_str().to_str().unwrap().to_string());

        let public = pwd
          .join(root.last().unwrap())
          .into_os_string()
          .into_string()
          .unwrap();

        meta.insert("public".to_string(), public.clone());
        meta.insert("static".to_string(), public.clone());
      }  

      return meta;
    }

    pub fn convert_params_to_meta_for_request(
      client_ip: &str,
      domain: Option<&str>,
      user_agent: &str,
      raw_headers: HeaderMap,
      query: HashMap<String, String>
    ) -> HashMap<String, String> {
      let mut meta = HashMap::new();
      let time = Utc::now().timestamp_micros();

      meta.insert("time".to_string(), time.to_string());
      meta.insert("hello_rust".to_string(), "Rust".to_string());
      meta.insert("ip".to_string(), client_ip.to_string());
      meta.insert("client-ip".to_string(), client_ip.to_string());

      meta.insert("user-agent".to_string(), user_agent.to_string());
      meta.insert("utc-time".to_string(), Utc::now().to_string());

      meta.insert("nanoid".to_string(), nanoid!(16));
      meta.insert("is-bellisimo".to_string(), "true".to_string());

      meta.insert("domain".to_string(), domain.unwrap_or("localhost").to_string());

      if CONFIG["ext_apply_http_query"].as_bool().unwrap() &&  !query.is_empty() {  
        query.iter().for_each(|(k, v)| {
          meta.insert(k.to_string(), v.to_string());
        });
      }


      if CONFIG["ext_apply_http_headers"].as_bool().unwrap() && !raw_headers.is_empty() {
        for h in raw_headers.iter() {
          meta.insert("http-header-".to_string() + h.name().to_string().to_lowercase().as_str(), h.value().to_string());
        }  
      }
      
      return meta;
    }

    pub fn convert_params_to_asn_record_struct<'a>(
      user_agent: &'a str,
      asn_record: Option<&'a Record>,
      raw_headers: HeaderMap<'a>,
      query: HashMap<String, String>,
      route_way: Option<Vec<RouteWay>>,
      route_name: Option<String>,
      resource_id: Option<String>,
    ) -> (String, AsnRecord<'a>) {

      let now = Utc::now();
      let mut headers: HashMap<String, String> = HashMap::new();
    
      for raw_header in raw_headers.iter() {
        headers.insert(
          raw_header.name().to_string(),
          raw_header.value().to_string(),
        );
      }
      
      let request_id = if raw_headers.get_one("request-id").is_some() { 
        raw_headers.get_one("request-id").unwrap().to_string()
      } else {
        nanoid!()
      };
      
      let is_allow_write_record = raw_headers
        .get_one("cf-ipcountry")
        .is_some() && 
          CONFIG["use_cloudflare_data_priority"]
            .as_bool()
            .unwrap();
          
      let cuntry_code = if is_allow_write_record {
        Some(raw_headers.get_one("cf-ipcountry").unwrap().to_string().to_uppercase())
      } else if asn_record.is_some() { 
        Some(asn_record.unwrap().country.clone().to_uppercase())
      } else { 
        None
      };
    
      let client = UA_PARSER.parse(&user_agent);
      let record = AsnRecord {
        asn_name: match asn_record {
          Some(asn_record) => Some(asn_record.owner.to_owned()),
    
          _ => None
        },
    
        asn_number: match asn_record {
          Some(asn_record) => Some(asn_record.as_number.to_owned()),
    
          _ => None
        },
    
        asn_country_code: cuntry_code.clone(),
        asn_description: Some(String::new()),
        request_id: request_id.to_string(),
        time: now.timestamp_micros(),
        is_ua_bot: Some(BOT_DETECTOR.is_bot(user_agent)),
        headers: Some(headers.clone()),
        query: Some(query),
        route_way: route_way,
        route_name: route_name,
        resource_id: resource_id,
        user_agent_client: Some(client),
        
      };

      return (
        request_id, 
        record
      );
    }
}
