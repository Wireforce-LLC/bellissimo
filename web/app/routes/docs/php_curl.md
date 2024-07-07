## CURL Functionality

Bellissimo supports the usage of CURL to make HTTP requests. Below is an example of how you can use CURL in your PHP code:

```
<?php
$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, "http://api.example.com/data");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);

curl_close($curl);

echo $response;
?>
```