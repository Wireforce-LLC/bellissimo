<?php

class TelegramBot
{
  private static $token = "";


  /**
   * Sends a message to a Telegram chat
   * 
   * @param int $chat_id The chat ID to send the message to
   * @param string $message The message to send
   * 
   * @return string The response from Telegram
   * 
   * @throws Exception If the Telegram token is not set
   */
  public static function sendMessage(string $chat_id, string $message)
  {
    if (self::$token == "") {
      throw new Exception("Telegram token not set");
    }

    $url = "https://api.telegram.org/bot" . self::$token . "/sendMessage";
    $data = [
      'chat_id' => $chat_id,
      'text' => $message
    ];
    $options = [
      'http' => [
        'method' => 'POST',
        'header' => "Content-type: application/json\r\n",
        'content' => json_encode($data)
      ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if (isset($_GET['debugger']) && $_GET['debugger'] == "unwrap") {
      var_dump($result);
    }

    return json_decode($result, true);
  }

  /**
   * Sends a message to a Telegram chat
   * 
   * @param int $chat_id The chat ID to send the message to
   * @param string $message The message to send
   * 
   * @return string The response from Telegram
   * 
   * @throws Exception If the Telegram token is not set
   */
  public static function sendPhoto($chat_id, $photo, $message)
  {
    if (self::$token == "") {
      throw new Exception("Telegram token not set");
    }

    $url = "https://api.telegram.org/bot" . self::$token . "/sendPhoto";
    $data = [
      'chat_id' => $chat_id,
      'photo' => $photo,
      'caption' => $message
    ];
    $options = [
      'http' => [
        'method' => 'POST',
        'header' => "Content-type: application/json\r\n",
        'content' => json_encode($data)
      ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if (isset($_GET['debugger']) && $_GET['debugger'] == "unwrap") {
      var_dump($result);
    }

    return json_decode($result, true);
  }

  /**
   * Sends a message to a Telegram chat
   * 
   * @param int $chat_id The chat ID to send the message to
   * @param string $message The message to send
   * 
   * @return string The response from Telegram
   * 
   * @throws Exception If the Telegram token is not set
   */
  public static function sendDocument($chat_id, $document, $message)
  {
    if (self::$token == "") {
      throw new Exception("Telegram token not set");
    }

    $url = "https://api.telegram.org/bot" . self::$token . "/sendDocument";
    $data = [
      'chat_id' => $chat_id,
      'document' => $document,
      'caption' => $message
    ];
    $options = [
      'http' => [
        'method' => 'POST',
        'header' => "Content-type: application/json\r\n",
        'content' => json_encode($data)
      ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if (isset($_GET['debugger']) && $_GET['debugger'] == "unwrap") {
      var_dump($result);
    }

    return json_decode($result, true);
  }

  /**
   * Sends a message to a Telegram chat
   * 
   * @param int $chat_id The chat ID to send the message to
   * @param string $message The message to send
   * 
   * @return string The response from Telegram
   * 
   * @throws Exception If the Telegram token is not set
   */
  public static function sendVideo($chat_id, $video, $message)
  {
    if (self::$token == "") {
      throw new Exception("Telegram token not set");
    }

    $url = "https://api.telegram.org/bot" . self::$token . "/sendVideo";
    $data = [
      'chat_id' => $chat_id,
      'video' => $video,
      'caption' => $message
    ];
    $options = [
      'http' => [
        'method' => 'POST',
        'header' => "Content-type: application/json\r\n",
        'content' => json_encode($data)
      ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if (isset($_GET['debugger']) && $_GET['debugger'] == "unwrap") {
      var_dump($result);
    }

    return json_decode($result, true);
  }

  /**
   * Sets the Telegram token
   * 
   * @param string $token The token to set
   */
  public static function setToken($token)
  {
    self::$token = $token;
  }

  /**
   * Gets the Telegram token
   * 
   * @return string The token
   */
  public static function getToken()
  {
    return self::$token;
  }

  /**
   * Sets the webhook
   * 
   * @param string $url The webhook URL
   */
  public static function setWebhook($url)
  {
    $url = "https://api.telegram.org/bot" . self::$token . "/setWebhook?url=" . $url;
    $data = [
      'url' => $url
    ];
    $options = [
      'http' => [
        'method' => 'POST',
        'header' => "Content-type: application/json\r\n",
        'content' => json_encode($data)
      ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    return json_decode($result, true);
  }

  /**
   * Gets the webhook
   * 
   * @return string The webhook URL
   */
  public static function getWebhookInfo()
  {
    $url = "https://api.telegram.org/bot" . self::$token . "/getWebhookInfo";
    $options = [
      'http' => [
        'method' => 'GET',
        'header' => "Content-type: application/json\r\n"
      ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $result = json_decode($result, true);

    return json_decode($result, true);
  }

  /**
   * Gets the bot username
   */
  public static function getMe()
  {
    $url = "https://api.telegram.org/bot" . self::$token . "/getMe";
    $options = [
      'http' => [
        'method' => 'GET',
        'header' => "Content-type: application/json\r\n"
      ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $result = json_decode($result, true);

    return json_decode($result, true);
  }
}
