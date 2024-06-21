use std::fs::{self, File};
use std::io::{BufRead, BufReader};

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
}

pub struct Ipsum {
    pub index: Option<usize>,
    pub iterations: usize,
    pub record: String
}

pub fn binary_search(arr: &[String], key: &str) -> Option<Ipsum> {
    let mut iterations = 0;
    let mut low = 0;
    let mut high = arr.len() - 1;
    
    while low <= high {
        let mid = low + (high - low) / 2;
        
        if arr[mid].starts_with(key) {
            return Some(
                Ipsum {
                   index: Some(mid),
                   iterations: iterations,
                   record: arr[mid].clone()
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

pub fn is_ip_in_ipsum(ip: &str) -> Option<Ipsum> {  
    return binary_search(&IPSUM.clone(), ip);
}

pub async fn update_database_with_ip() -> bool {
    let url = CONFIG["ipsum_registry"].as_str().unwrap();

    let client = reqwest::Client::new();
    let res = client.get(url).send().await.unwrap();

    let content = res.text().await.unwrap();
    let content = content.as_bytes();

    let content = std::str::from_utf8(content).unwrap();

    fs::write("./containers/ipsum.txt", content).unwrap();

    return true;
}