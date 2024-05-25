#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)

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
export _TIP_HTTPPASS=$(htpasswd -nb admin "$_TIP_PASSWORD")

export _Python="print('$_TIP_HTTPPASS'.replace('\$', '\$\$'))"
export _TIP_HTTPPASS="$(python3 -c "$_Python")"

echo """
----------------------------------
Welcome to Bellissimo API Setup!
Please answer the following questions:
----------------------------------

What is your API host? (result of 'curl ipinfo.io/ip', without http:// or https://)
Or use default: ${bold}$_TIP_API_HOST${normal} (its your public IP by default)
"""

read -p "API_HOST: " API_HOST

echo """
What is your HTPASSWD? (result of 'htpasswd -nb admin password')
Or use default: ${bold}$_TIP_HTTPPASS${normal}
If you want to use it also remember your ${bold}$password${normal}: ${bold}$_TIP_PASSWORD${normal}
"""
read -p "HTPASSWD: " HTPASSWD


echo """
Your host is http://$API_HOST or https://$API_HOST?
If http, type 'http'.
If https, type 'https':
"""
read -p "HTTP/s: " HTTP

echo "Removing old config..."
rm docker.env
rm ./web/app/production.ts

echo "Writing new config..."
echo """
NODE_ENV=production
API_HOST=$API_HOST
HTPASSWD=$HTPASSWD
FORWARD_HOST=bellissimo-web
FORWARD_PORT=3000
""" >> docker.env

echo "Writing new production.ts..."
echo """
export default {
    API_HOST: '$HTTP://$API_HOST'
}
""" >> ./web/app/production.ts

echo "Running build..."
/bin/bash ./build.sh

echo "Running docker compose..."
/bin/docker compose up --force-recreate -d bellissimo-web

echo "Done!"