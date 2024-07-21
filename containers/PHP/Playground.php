<?php
include_once (__DIR__ . "/Base.php");

class Playground extends Base
{
    /**
     * Calls a remote function with the given function name and data.
     *
     * @param string $function The name of the function to call.
     * @param array $data The data to pass to the function.
     * @return array The JSON-decoded response from the API.
     */
    public static function call($function_name, $argv)
    {
        self::construct();

        // Initialize a cURL session
        $curl = curl_init();

        // Construct the payload as a JSON-encoded array
        $payload = json_encode([
            "function" => $function_name,
            "argv" => $argv
        ]);

        // Set the cURL options
        curl_setopt_array($curl, array(
            CURLOPT_URL => self::getBaseUrl() . '/api/playground', // Set the URL
            CURLOPT_RETURNTRANSFER => true, // Return the response as a string
            CURLOPT_ENCODING => '', // Don't decode the response
            CURLOPT_MAXREDIRS => 10, // Maximum number of redirects
            CURLOPT_TIMEOUT => 0, // No timeout
            CURLOPT_FOLLOWLOCATION => true, // Follow redirects
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1, // Use HTTP version 1.1
            CURLOPT_CUSTOMREQUEST => 'POST', // Use a POST request
            CURLOPT_POSTFIELDS => $payload, // Set the payload
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