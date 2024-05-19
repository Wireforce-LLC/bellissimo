#!/bin/bash

list_route() {
  curl --location -X GET "$BB_URI/api/route/list" | python3 -mjson.tool
}

list_route
