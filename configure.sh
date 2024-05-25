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

export _TIP_API_HOST="$(curl -s https://ipinfo.io/ip)"
export _TIP_PASSWORD="$(openssl rand -base64 10)"
export _TIP_HTTPPASS="$(htpasswd -nb admin $_TIP_PASSWORD)"

echo """
----------------------------------
Welcome to Bellissimo API Setup!
Please answer the following questions:
----------------------------------

What is your API host? (result of 'curl ipinfo.io/ip', without http:// or https://)
Or use default: $_TIP_API_HOST (its your public IP by default)
"""

read -p "API_HOST: " API_HOST

echo """
What is your HTPASSWD? (result of 'htpasswd -nb admin password')
Or use default: $_TIP_HTTPPASS
If you want to use it also remember your password: $_TIP_PASSWORD
"""
read -p "HTPASSWD: " HTPASSWD

rm docker.env

echo """
NODE_ENV=production
API_HOST=$API_HOST
HTPASSWD=$HTPASSWD
FORWARD_HOST=bellissimo-web
FORWARD_PORT=3000
""" >> docker.env

echo """
export default {
    API_HOST: '$API_HOST'
}
""" >> web/app/production.ts


echo "Done!"