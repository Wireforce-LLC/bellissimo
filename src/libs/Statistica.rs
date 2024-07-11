use crate::asn_record::AsnRecord;
use crate::config::CONFIG;
use crate::dynamic_router::ELASTIC;
use crate::mongo_sdk::MongoDatabase;
use elasticsearch::IndexParts;
use serde_json::json;
use tokio::runtime::Handle;
use tokio::task;

pub struct Converter {}

pub struct Statistica {}

impl Statistica {
    pub fn register_request(request_id: &str, insert_data: &AsnRecord) {
        task::block_in_place(move || {
            Handle::current().block_on(async move {
                let collection =
                    MongoDatabase::use_collection::<AsnRecord>("requests", "asn_records");

                let insert_json_raw = json!(insert_data);

                if CONFIG["is_save_requests_in_mongodb"].as_bool().unwrap() {
                    collection.insert_one(insert_data, None).unwrap();
                }

                if CONFIG["is_save_requests_in_elastic"].as_bool().unwrap() {
                    ELASTIC
                        .index(IndexParts::IndexId("requests", &request_id))
                        .body(insert_json_raw.to_owned())
                        .send()
                        .await
                        .unwrap();
                }
            })
        });
    }

    pub fn new() -> Statistica {
        Statistica {}
    }

}
