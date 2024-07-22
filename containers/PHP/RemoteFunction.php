<?php

include_once __DIR__ . "/Base.php";

class RemoteFunction extends Base
{
    /**
     * Calls a remote function with the given function name and data.
     *
     * @param string $function The name of the function to call.
     * @param object $data The data to pass to the function.
     * @return array The JSON-decoded response from the API.
     */
    public static function call(string $function_name, object $argv)
    {

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => self::getBaseUrl() . '/api/function/run',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode([
                "id" => strval($function_name),
                "argv" => (object) $argv
            ]),
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        
        return json_decode($response, true);
    }
}
