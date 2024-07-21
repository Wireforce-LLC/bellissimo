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

echo "Starting classical docker compose..."
echo "Thank you for using Bellissimo!"
/bin/docker compose up --force-recreate -d

echo "Done!"
echo "Bellissimo started and listening on:"
echo "  - http://localhost:80 - API and router"
echo "  - http://localhost:1337 - Web"
