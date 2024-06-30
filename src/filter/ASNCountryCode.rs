use asn_db::Record;
use rocket::http::HeaderMap;
use crate::filter_kit;

pub fn register_filter() {
    filter_kit::register_filter(
        "asn::country_code",
        |_this: &str, _x_real_ip: &str, _user_agent: &str, _raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str|  {
          if asn_record.is_none() {
            return false;
          }

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
}