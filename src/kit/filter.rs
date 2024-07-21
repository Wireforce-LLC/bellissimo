use crate::config::CONFIG;
use std::{collections::HashMap, sync::Mutex};
use asn_db::Record;
use paris::info;
use rocket::http::HeaderMap;

lazy_static! {
  // Filter methods
  pub static ref FILTERS_METHODS: Mutex<HashMap<String, fn(this: &str, x_real_ip:&str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool>> = Mutex::new(HashMap::new());
}

/**
 * Registers a custom filter function under the specified name.
 * This function allows registering a custom filter
 * function to be used in the filtering process.
 * 
 * @param {String} name - The name under which to register the filter function
 * @param {Function} function - The custom filter function to be registered.
 */
pub fn register_filter(name: &str, function: fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool) {
  FILTERS_METHODS
    .lock()
    .unwrap()
    .insert(String::from(name), function);

  info!("Registered filter: {}", name);
}


/**
 * Retrieves the names of all registered filters
 * This function returns a list of names of all filters that have been registered.
 * 
 * @returns {Vec<String>} An array containing the names of all registered filters.
 */
pub fn get_all_registred_filters_names() -> Vec<String> {
  return FILTERS_METHODS.lock().unwrap().keys().map(|x| -> String { String::from(x) }).collect();
}


/**
 * Checks if a filter with the specified name is registered.
 * This function checks if a filter with the provided name has been registered.
 * 
 * @param {String} name - The name of the filter to check.
 * @returns {bool} Returns true if the filter is registered, false otherwise.
 */
pub fn is_filter(name: &str) -> bool {
  return FILTERS_METHODS
    .lock()
    .unwrap()
    .contains_key(name);
}


/**
 * Retrieves all registered filters.
 * This function returns a HashMap containing 
 * all registered filter functions.
 *
 * @returns {HashMap<String, Function>} A mapping of filter names to their respective functions.
 */
pub fn get_all_filters() -> HashMap<String, fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool> {
  return FILTERS_METHODS
    .lock()
    .unwrap()
    .clone();
}


/**
 * Retrieves the filter function associated with the specified name.
 * This function fetches the filter function registered under the provided name.
 * 
 * @param {String} name - The name of the filter function to retrieve.
 * @returns {Function} The filter function corresponding to the specified name.
 */
pub fn get_filter(name: &str) -> fn(this: &str, x_real_ip: &str, user_agent: &str, raw_headers: HeaderMap, asn_record: Option<&Record>, filter_value: &str, operator: &str) -> bool {
  return FILTERS_METHODS
    .lock()
    .unwrap()
    .get(name)
    .unwrap()
    .clone();
}
