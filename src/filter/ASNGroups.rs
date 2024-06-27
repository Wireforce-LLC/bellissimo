use asn_db::Record;
use rocket::http::HeaderMap;
use std::collections::HashMap;
use crate::filter_kit;

pub fn register_filter() {
  filter_kit::register_filter(
    "asn::groups",
    |
        _this: &str,
        _x_real_ipp: &str,
        _user_agent: &str,
        _raw_headers: HeaderMap,
        asn_record: Option<&Record>,
        filter_value: &str,
        operator: &str
    | {
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
        let asn_owners_groups: HashMap<&str, Vec<&str>> = serde_json
            ::from_str(asn_raw)
            .unwrap();

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
}
