#!/bin/bash

all_conditions=()

add_condition() {
  local name=$1
  local value=$2
  local operator=$3
  local plugin=$4
  local resource_id=$5
  local index=$6
  all_conditions+=("conditions[$index][name]=\"$name\"")
  all_conditions+=("conditions[$index][value]=\"$value\"")
  all_conditions+=("conditions[$index][operator]=\"$operator\"")
  all_conditions+=("conditions[$index][plugin]=\"$plugin\"")
  all_conditions+=("conditions[$index][resource_id]=\"$resource_id\"")
}

create_filter() {
  read -p "Filter name: " name
  read -p "Filter ID: " filter_id

  conditions=()
  routes=()
  index=0

  echo "Please enter conditions like 'name value operator plugin resource' or 'next' to finish"
  echo "  name - condition name"
  echo "  value - condition value"
  echo "  operator - condition operator"
  echo "  plugin - condition plugin"
  echo "  resource - condition resource (resource_id)"

  while true; do
    read -p "Enter condition: " route_input
  
    if [ "$route_input" == "next" ]; then
        break
    fi

    raw=$(echo $route_input | tr -s ' ')

    add_condition $raw $index
    
    index=$((index+1))
  done

  curl_request="curl --location '$BB_URI/api/filter/create' --form 'name=\"$name\"' --form 'filter_id=\"$filter_id\"'"

  index=0
  for condition in "${all_conditions[@]}"
  do
    curl_request+=" --form '$condition'"
    ((index++))
  done
    
  /bin/bash -c "$curl_request" | python3 -mjson.tool
}

create_filter
