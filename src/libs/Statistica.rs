use crate::asn_record::AsnRecord;
use crate::config::CONFIG;
use crate::mongo_sdk::MongoDatabase;
use tokio::runtime::Handle;
use tokio::task;

pub struct Converter {}

pub struct Statistica {}

impl Statistica {
    pub fn register_request(request_id: &str, insert_data: &AsnRecord) {
        task::block_in_place(move || {
            Handle::current().block_on(async move {
                let collection = MongoDatabase::use_requests_collection();

                if CONFIG["is_save_requests_in_mongodb"].as_bool().unwrap() {
                    collection.insert_one(insert_data, None).unwrap();
                }
            })
        });
    }
}
