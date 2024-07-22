<?php
include_once __DIR__ . "/Base.php";

class Aggregate extends Base
{
  /**
   * Explore the data in a MongoDB collection using an aggregation pipeline.
   *
   * @param string $database The name of the database.
   * @param string $collection The name of the collection.
   * @param array<string, mixed> $pipeline The aggregation pipeline.
   * @return array<string, mixed> The result of the aggregation pipeline.
   * @throws Exception If the MongoDB connection fails.
   */
  public static function explore(
    string $database,
    string $collection, 
    array $pipeline
  ): array|null
  {
    // Connect to MongoDB and call the 'aggregate_pipeline' function.
    self::construct();

    // Call the 'aggregate_pipeline' function with the given parameters.
    return Playground::call("aggregate_pipeline", [
      "database" => $database, 
      "collection" => $collection,
      "pipeline" => json_encode($pipeline),
    ]);
  }

  /**
   * Merge the query parameters and headers of requests from the same IP address.
   *
   * @param void
   * @return array The merged query parameters and headers.
   */
  public static function mergeSelfRequests($attr_window = 14, $key = "headers")
  {
    self::construct();

    if (!isset($_GET["ip"])) {
      return null;
    }

    if (!filter_var($_GET["ip"], FILTER_VALIDATE_IP)) {
      return null;
    }

    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => self::getBaseUrl() . '/api/playground',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => json_encode(
        array(
          "function" => "assign_requests_by_ip",
          "argv" => array(
            "ip" => $_GET["ip"],
            "window_days" => strval($attr_window),
            "key" => $key
          )
        )
      ),
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json'
      ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);

    return json_decode($response, true);
  }
}
