#!/bin/bash

echo """
----------------------------------
Welcome to Bellissimo Builder!

This script will build and start the Bellissimo server for you.
Automatically configure docker.env and build the binaries.
Traffic affiliate tools have never been so accessible and open before.
(!) We will answer some questions.
----------------------------------
"""

if [ "$(uname)" == "Darwin" ]; then
    echo "Sorry, this script is not supported on macOS"
    echo ""
    echo "Please, build server manually"
    echo " 1) bash configure.sh"
    echo " 2) bash build.sh"
    echo " 3) docker compose up --force-recreate -d --build"
    exit 0

elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    echo "Starting Bellissimo..."
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    echo "Sorry, this script is not supported on Windows"
    exit 0
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    echo "Sorry, this script is not supported on Windows"
    exit 0
fi

echo "Bellissimo have multiple Docker configurations."
echo "Which one do you want to use?"
echo "1) Classical (Bellissimo only)"
echo "2) Kibana (Bellissimo and Kibana)"

read -p "Choose: " ANSWER  

if [ "$ANSWER" == "1" ]; then
    echo "Starting classical docker compose..."
    echo "Thank you for using Bellissimo!"
    /bin/docker compose up --force-recreate -d
elif [ "$ANSWER" == "2" ]; then
    echo "Starting Kibana docker compose..."
    echo "Kibana is beautiful tool for analytics"
    echo "Thank you for using Bellissimo + Kibana!"
    /bin/docker compose -f docker-compose.kibana.yml up --force-recreate -d 
else
    echo "Invalid option"
    exit 0
fi

echo "Done!"
echo "Bellissimo started and listening on:"
echo "  - http://localhost:80 - API and router"
echo "  - http://localhost:1337 - Web"
echo "  - http://localhost:5601 - Kibana (if Kibana is enabled)"