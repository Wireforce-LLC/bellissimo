#!/bin/bash

create_route() {
  read -p "Route name: " name
  read -p "Route path: " path
  read -p "Filter ID: " filter_id
  read -p "Resource ID: " resource_id

  curl \
    -X POST \
    --location "$BB_URI/api/route/create" \
    --form name="$name" \
    --form path="$path" \
    --form filter_id="$filter_id" \
    --form resource_id="$resource_id" | python3 -mjson.tool
}

create_route
