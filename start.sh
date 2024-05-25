#!/bin/bash

echo "Starting Bellissimo..."

echo "Checking dependencies..."
if [ "$(uname)" != "Linux" ] && [ "$(uname)" != "Darwin" ]; then
    echo "Only Linux and macOS are supported" >&2
    exit 0
fi

echo "Checking dependencies..."
if ! command -v curl &> /dev/null; then
    echo "CURL is not installed. Installing..."
    
    if [ "$(uname)" == "Linux" ]; then
        echo "Installing CURL..."
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

echo "Checking docker.env..."
if [ ! -f docker.env ]; then
    /bin/bash ./configure.sh    
fi

echo "Checking built binaries..."
if [ ! -f target/release/bellissimo ]; then
    /bin/bash ./build.sh    
fi


docker compose up --force-recreate -d