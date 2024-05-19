#!/bin/bash

list_filter() {
  curl --location -X GET "$BB_URI/api/filter/list" | python3 -mjson.tool
}

list_filter
