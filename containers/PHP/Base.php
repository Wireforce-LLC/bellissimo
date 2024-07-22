<?php

class Base
{
  /**
   * Get the base URL.
   *
   * @return string The base URL.
   */
  static protected function getBaseUrl()
  {
    return $_GET['__remote_function_endpoint__'];
  }
}
