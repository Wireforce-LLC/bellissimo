<?php

include_once __DIR__ . "/Base.php";

class Dataset extends Base
{
  /**
   * Get datasets from Playground API
   * 
   * @return array|null List of datasets or null if no datasets found
   */
  public static function getDatasets()
  {
    // Call payload function
    $data = Playground::call(
      function_name: "get_datesets_list",
      argv: (object) [
        "time" => strval(time())
      ]
    );

    if (!isset($data['value']['datasets'])) {
      return null; // Return null if datasets not found
    }

    return (array) $data['value']['datasets']; // Return datasets as an array
  }


  /**
   * Writes data into a dataset
   * 
   * @param string $dataset_name The name of the dataset to write into
   * @param object $data The data to write into the dataset
   * @return array|null The JSON-decoded response from the API or null if the request fails
   */
  public static function writeDataset(string $dataset_name, object $data)
  {
    // Initialize a cURL session
    $curl = curl_init();

    // Set the cURL options
    curl_setopt_array($curl, array(
      CURLOPT_URL => self::getBaseUrl() . '/api/dataset/write/' . strval($dataset_name), // Set the URL
      CURLOPT_RETURNTRANSFER => true, // Return the response as a string
      CURLOPT_ENCODING => '', // Don't decode the response
      CURLOPT_MAXREDIRS => 10, // Maximum number of redirects
      CURLOPT_TIMEOUT => 0, // No timeout
      CURLOPT_FOLLOWLOCATION => true, // Follow redirects
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1, // Use HTTP version 1.1
      CURLOPT_CUSTOMREQUEST => 'POST', // Use a POST request
      CURLOPT_POSTFIELDS => json_encode($data), // Set the payload
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json' // Set the content type header
      ),
    ));

    // Execute the cURL session and get the response
    $response = curl_exec($curl);

    // Close the cURL session
    curl_close($curl);
    
    // Decode the JSON response and return it
    return json_decode($response, true);
  }
}
