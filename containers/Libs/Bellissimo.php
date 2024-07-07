<?php

class BellissimoKit
{
    private static $host = "http://bellissimo:8000";

    /**
     * Merge the headers of requests from the same IP address.
     *
     * @param string|null $ip The IP address to merge headers for. If null, uses the value of $_GET["ip"].
     * @return array|null The merged headers, or null if the request failed.
     */
    static function mergeHeader($ip = null) {    
        // Define the base URL for the Bellissimo API.
        $base = self::$host;
        // Make a request to the API to merge the headers.
        $requestsHeaders = file_get_contents("$base/api/requests/merge/headers/" . ($ip ? $ip : $_GET["ip"]));

        // If the request failed, return null.
        if (!$requestsHeaders) {
            return false;
        }

        // Decode the JSON response from the API.
        $requestsHeaders = json_decode($requestsHeaders, true);
        // If the API request was successful, return the merged headers.
        // Otherwise, return null.
        return isset($requestsHeaders["value"]) ? $requestsHeaders["value"] : null;
    }

    /**
     * Merge the query parameters of requests from the same IP address.
     *
     * @param string|null $ip The IP address to merge queries for. If null, uses the value of $_GET["ip"].
     * @return array|null The merged query parameters, or null if the request failed.
     */
    static function mergeQuery($ip = null) {
        // Define the base URL for the Bellissimo API.
        $base = self::$host;

        // Make a request to the API to merge the query parameters.
        $requestsQuery = file_get_contents("$base/api/requests/merge/query/" . ($ip ? $ip : $_GET["ip"]));

        // If the request failed, return null.
        if (!$requestsQuery) {
            return false;
        }

        // Decode the JSON response from the API.
        $requestsQuery = json_decode($requestsQuery, true);

        // If the API request was successful, return the merged query parameters.
        // Otherwise, return null.
        return isset($requestsQuery["value"]) ? $requestsQuery["value"] : null;
    }
}
