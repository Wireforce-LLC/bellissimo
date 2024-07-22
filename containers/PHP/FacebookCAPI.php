<?php

class FacebookCAPI
{
  /**
   * Send a Facebook event into a dataset
   *
   * @param string $fbcid the Facebook click ID
   * @param string $ua the user agent
   * @param string $dataset the dataset ID
   * @param string $access_token the access token
   *
   * @return array the response from the API
   */
  static function trackEventLite(
    string $fbcid = "",
    string $ua = "",
    string $dataset = "",
    string $access_token = "",
    string $event_name = "Purchase",
    array $data = [
      "currency" => "usd",
      "value" => 1.0,
      "contents" => [
        [
          "id" => "Popcorn",
          "quantity" => 1,
        ],
      ],
    ]
  ) {
    if (!is_string($fbcid) || !is_string($ua) || !is_string($dataset) || !is_string($access_token)) {
      throw new TypeError();
    }

    if ($fbcid == "") {
      throw new Exception("Facebook click ID not set");
    }

    if ($ua == "") {
      throw new Exception("User agent not set");
    }

    if ($dataset == "") {
      throw new Exception("Dataset ID not set");
    }

    if ($access_token == "") {
      throw new Exception("Access token not set");
    }

    $fbtime = intval($_GET["time"]) * 1000;
    $fbc = "fb.1." . strval($fbtime) . "." . strval($fbcid);

    $curl = curl_init();

    // Create the payload for the Facebook request
    $jayParsedAry = [
      [
        "event_name" => $event_name,
        "event_time" => $_GET["time"],
        "custom_data" => $data,
        "user_data" => [
          "client_ip_address" => $_GET["ip"],
          "fbc" => $fbc,
          "client_user_agent" => $ua
        ],
        "action_source" => "physical_store",
      ],
    ];

    curl_setopt_array($curl, [
      CURLOPT_URL => "https://graph.facebook.com/v15.0/$dataset/events",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => [
        "data" => json_encode($jayParsedAry),
        "access_token" => $access_token,
      ],
    ]);

    $response = curl_exec($curl);
    
    curl_close($curl);

    return json_decode($response);
  }
}
