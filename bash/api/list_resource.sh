#!/bin/bash

list_resource() {
  curl --location -X GET "$BB_URI/api/resource/list" | python3 -mjson.tool
}

list_resource
