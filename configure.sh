#!/bin/bash

if [ "$(uname)" != "Linux" -a "$(uname)" != "Darwin" ]; then
    echo "Only Linux and macOS are supported" >&2
    exit 0
fi

# if linux 
if [ "$(uname)" == "Linux" ]; then
    # install 'sudo apt-get install apache2-utils -y'
    if ! command -v htpasswd &> /dev/null; then
        echo "HTPASSWD is not installed. Installing..."
        sudo apt update
        sudo apt install -y apache2-utils
    fi
fi

echo """
----------------------------------
Welcome to Bellissimo API Setup!
Please answer the following questions:
----------------------------------

What is your API host? (result of 'curl ipinfo.io/ip', without http:// or https://)
"""

read -p "API_HOST: " API_HOST

echo """
What is your HTPASSWD? (result of 'htpasswd -nb admin password')
"""
read -p "HTPASSWD: " HTPASSWD

echo """
NODE_ENV=production
API_HOST=$API_HOST
HTPASSWD=$HTPASSWD
""" >> docker.env

echo "Done!"