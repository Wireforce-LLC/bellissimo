use crate::config::CONFIG;

// Get website content
// https://docs.rs/reqwest/latest/reqwest/fn.get.html
pub async fn get_website_content(url: &str) -> reqwest::Response {
  let mut res = reqwest::Client::new().get(url);

  if CONFIG["driver_proxy_ua_enabled"].as_bool().unwrap() {
    res = res.header(
      "User-Agent",
      include_str!("../../containers/htmlproxy_ua.txt"),
    );
  }

  if CONFIG["driver_proxy_referer_enabled"].as_bool().unwrap() {
    res = res.header(
      "Referer",
      include_str!("../../containers/htmlproxy_referer.txt"),
    );
  }

  if CONFIG["driver_proxy_origin_enabled"].as_bool().unwrap() {
    res = res.header(
      "Origin",
      include_str!("../../containers/htmlproxy_origin.txt"),
    );
  }

  return res.send().await.unwrap();
}
