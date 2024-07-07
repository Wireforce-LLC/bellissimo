use rocket::http::{ContentType, Status};
use crate::scenario_sdk::Scenario;

/**
 * Get scenario logs
 * @param limit Limit of logs to retrieve
 * @skip Skip the first n logs
 * @return List of scenario logs
 */
#[get("/scenario/logs/list")]
pub fn get_scenario_logs() -> (Status, (ContentType, String)) {
    let limit = 512;
    let skip = 0;

    let logs = Scenario::get_logs(limit, skip);

    let value = serde_json::json!({
        "isOk": true,
        "value": logs,
        "error": null
    });

    let result = value.to_string();
    
    return (Status::Ok, (ContentType::JSON, result));
}
