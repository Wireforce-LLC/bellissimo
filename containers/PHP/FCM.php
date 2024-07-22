<?php

class FCM
{
    /**
     * Sends a notification to a device using Firebase Cloud Messaging.
     *
     * @param string $to The recipient's registration token.
     * @param string $token The API key for authentication.
     * @param string $message The message to be sent.
     * @param string $title The title of the notification.
     * @return string The response from the FCM server.
     * @throws TypeError If any of the arguments are of the wrong type.
     */
    public static function sendNotification(
        string $to,
        string $token,
        string $message,
        string $title
    )
    {
        if (!is_string($to) || !is_string($token) || !is_string($message) || !is_string($title)) {
            throw new TypeError();
        }

        if ($token == "") {
            throw new Exception("FCM token not set");
        }

        if (substr_count($token, ":") == 0) {
            throw new Exception("FCM token not formatted correctly. Format should be project_id:api_key");
        }

        if ($to == "") {
            throw new Exception("FCM recipient not set");
        }

        if ($message == "") {
            throw new Exception("FCM message not set");
        }

        if ($title == "") {
            throw new Exception("FCM title not set");
        }

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://fcm.googleapis.com/fcm/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode([
                "to" => $to,
                "notification" => [
                    "title" => trim($title),
                    "body" => trim($message)
                ]
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-type: application/json',
                'Authorization: key=' . $token
            ],
        ]);

        $response = curl_exec($curl);

        curl_close($curl);

        return json_decode($response, true);
    }
}
