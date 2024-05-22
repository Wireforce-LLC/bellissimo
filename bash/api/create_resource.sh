#!/bin/bash

create_resource() {
  read -p "Resource ID: " resource_id
  read -p "Driver: " driver
  read -p "File path: " file_path
  read -p "Raw data: " raw_data

  curl \
    -X POST \
    --location "$BB_URI/api/resource/create" \
    --form resource_id="$resource_id" \
    --form driver="$driver" \
    --form file_path="$file_path" \
    --form raw_data="$raw_data" | python3 -mjson.tool
}

create_resource
