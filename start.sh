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

echo "Pulling latest changes..."
git pull

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

echo "Checking docker.env..."
if [ ! -f docker.env ]; then
    /bin/bash ./configure.sh    
fi

echo "Checking built binaries..."
if [ ! -f target/release/bellissimo ]; then
    /bin/bash ./build.sh    
fi


docker compose up --force-recreate -d