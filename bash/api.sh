#!/bin/bash
if [ "$(uname)" != "Linux" -a "$(uname)" != "Darwin" ]; then
  echo "Only Linux and macOS are supported" >&2
  exit 0
fi

if ! command -v curl &> /dev/null; then
  echo "CURL is not installed. Installing..."
  if [ "$(uname)" == "Linux" ]; then
    sudo apt update
    sudo apt install -y curl
  elif [ "$(uname)" == "Darwin" ]; then
    if ! command -v brew &> /dev/null; then
      echo "Homebrew is not installed." >&2
      exit 1
    fi
    brew install curl
  fi
fi


if [ -z "$BB_URI" ]; then
  echo "Var 'BB_URI' is not set" >&2
  echo "Use 'export BB_URI=http://...' to set it"
  exit 1
fi

if [[ $BB_URI =~ ^(http|https)://[0-9a-zA-Z.-]+:[0-9]+ ]]; then
  echo 0 >> /dev/null
else
  echo "Var 'BB_URI' is not a valid URL" >&2
  echo $BB_URI
  exit 1
fi


echo "Select an action:"
echo "1. Create route"
echo "2. Create filter"
echo "3. Create resource"

echo "4. List routes"
echo "5. List filters"
echo "6. List resources"

read -p "Enter your choice: " choice

case $choice in
  1)
    /bin/bash $PWD/bash/api/create_route.sh
    ;;
  2)
    /bin/bash $PWD/bash/api/create_filter.sh
    ;;
  3) 
    /bin/bash $PWD/bash/api/create_resource.sh
    ;;
  4) 
    /bin/bash $PWD/bash/api/list_route.sh
    ;;
  5)
    /bin/bash $PWD/bash/api/list_filter.sh
    ;;
  6) 
    /bin/bash $PWD/bash/api/list_resource.sh
    ;;
  *)
    echo "Invalid choice" >&2
    ;;
esac
