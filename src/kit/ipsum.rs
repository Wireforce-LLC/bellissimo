use std::fs::{self, File};
use std::io::{BufRead, BufReader, Read, Write};
use std::path::Path;
use std::time::Instant;

use toml::Table;

use crate::config::CONFIG;

lazy_static! {
  pub static ref IPSUM: Vec<String> = {
    let file = File::open("./containers/ipsum.txt").expect("Unable to open file");
    let reader = BufReader::new(file);

    let mut v = Vec::new();

    for line in reader.lines() {
      let line = line.unwrap();
      v.push(line);
    }

    v.sort();

    v
  };

  pub static ref REGISTRIES: Vec<String> = {
    let root_dir = CONFIG["dir_registry"].as_str().unwrap();

    let reg_list = fs::read_dir(root_dir)
      .expect("Unable to read registry directory")
      .filter_map(|registry| {
        if !registry.is_ok() {
          return None;
        }

        if let Some(registry) = registry.unwrap().file_name().into_string().ok() {
          if !registry.ends_with(".list") {
            return None;
          }

          return Some(registry.replace(".list", ""));
        }

        return None;
      });

    let mut reg_list: Vec<String> = reg_list.collect();

    if reg_list.len() == 0 {
      return vec![];
    }

    reg_list.sort();
    
    reg_list.insert(0, "ipsum".to_string());

    return reg_list;
  };
}

pub struct RegistrySearchResult {
  pub elapsed: f64,
  pub ipsum: Option<Vec<Ipsum>>,
  pub registry_count: usize,
}

pub struct Ipsum {
    pub index: Option<usize>,
    pub iterations: usize,
    pub record: String,
    pub registry: String,
}

pub fn read_ipsum_config() -> Table {
  fs::read_to_string("./ipsum.toml")
    .expect("Unable to read ipsum.toml")
    .parse::<Table>()
    .expect("Unable to parse ipsum.toml")
}

pub fn read_ipsum_registry(url: &str) -> Option<String> {
  let response = reqwest::blocking::get(url);

  if response.is_err() {
    return None;
  }

  let mut buf = String::new();
  
  response
    .unwrap()
    .read_to_string(&mut buf)
    .unwrap();

  return Some(buf);
}

// @deprecated
pub fn binary_search(arr: &[String], key: &str) -> Option<Ipsum> {
    let mut iterations: usize = 0;
    let mut low: usize = 0;
    let mut high: usize = arr.len() - 1;
    
    while low <= high {
        let mid = low + (high - low) / 2;
        
        if (high == 0 && low == 0) || mid == 0 { 
          break;
        }

        if arr[mid].starts_with(key) || arr[mid].as_str().ends_with(key) {
            return Some(
                Ipsum {
                   index: Some(mid),
                   iterations: iterations,
                   record: arr[mid].clone(),
                   registry: "IPSUM".to_string()
                }
            );
        } else if arr[mid].as_str() < key {
            iterations += 1;
            low = mid + 1;
        } else {
            iterations += 1;
            high = mid - 1;
        }
    }
    
    return None;
}

pub fn optimize_registry_lists() -> f64 {
  let now = Instant::now();
  let root_dir = CONFIG["dir_registry"].as_str().unwrap();

  for registry in REGISTRIES.iter() {
    let registry_path = format!("{}/{}.list", root_dir, registry);
    let mut vector = Vec::new();

    let file = File::open(&registry_path).expect("Unable to open file");

    let reader = BufReader::new(&file);

    for line in reader.lines() {
      let line = line.unwrap();

      if line.starts_with("#") {
        continue;
      }

      if line.is_empty() {
        continue;
      }
      
      vector.push(line);
    }

    vector.sort();

    fs::remove_file(&registry_path).expect("Unable to remove file");

    let mut file = File::create(&registry_path).expect("Unable to open file");

    file.write(vector.join("\n").as_bytes()).expect("Unable to write to file");
  }

  return now.elapsed().as_secs_f64();
}

pub fn search_ip_in_ipsum_registries(ip: &str, is_only_single_join: bool) -> Option<RegistrySearchResult> {
  let now = Instant::now();
  let mut vector = Vec::new();
  let registries_count = REGISTRIES.len();

  for registry in REGISTRIES.iter() {
    let found = search_ip_in_ipsum_registry(ip, registry.clone());
    
    if found.is_some() {
      vector.push(found.unwrap());

      if is_only_single_join {
        break;
      }
    }
  }

  if vector.is_empty() {
    return None;
  }

  vector.sort_by(|a, b| a.registry.cmp(&b.registry));

  return Some(
    RegistrySearchResult {
      elapsed: now.elapsed().as_secs_f64(),
      ipsum: Some(vector),
      registry_count: registries_count
    }
  )
}

pub fn search_ip_in_ipsum_registry(ip: &str, registry: String) -> Option<Ipsum> {
  let root_dir = CONFIG["dir_registry"].as_str().unwrap();
  let registry_file = format!("{}/{}.list", root_dir, registry);
  
  if !Path::new(&registry_file).exists() {
    return None;
  }

  let file = File::open(registry_file).expect("Unable to open file");
  let reader = BufReader::new(file);
  let mut index = 0;

  for line in reader.lines() {
    if line.is_err() {
      continue;
    }

    let line = line.unwrap();
    let line = line.trim();
    
    index += 1;

    if line.starts_with("#") || line.is_empty() {
      continue;
    }

    if line.starts_with(ip) || line.ends_with(ip) {
      return Some(
        Ipsum {
          index: Some(index - 1),
          iterations: index,
          record: line.to_string(),
          registry: registry
        }
      );
    }
  }

  return None;
}

// @deprecated
pub fn is_ip_in_ipsum(ip: &str) -> Option<Ipsum> {  
    return binary_search(&IPSUM.clone(), ip);
}