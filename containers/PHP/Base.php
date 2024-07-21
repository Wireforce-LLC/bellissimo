<?php

class Base {
    static private $baseUrl;

    /**
     * Get the base URL.
     *
     * @return string The base URL.
     */
    static protected function getBaseUrl()
    {
      return self::$baseUrl;
    }
  
    /**
     * Initialize the base URL of the remote function server.
     *
     * The base URL is obtained from the query parameter '__remote_function_endpoint__'.
     *
     * @return void
     */
    protected static function construct()
    {
      /**
       * The base URL of the remote function server.
       *
       * The base URL is the address of the remote function server, which is the server that
       * hosts the remote functions. The base URL is used to construct the full URL of the
       * remote function when calling it.
       *
       * @var string
       */
      self::$baseUrl = $_GET['__remote_function_endpoint__'];
    }  
}