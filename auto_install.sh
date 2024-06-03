#!/bin/bash

echo """
----------------------------------
Welcome to Bellissimo Installer!

This script will automatically download and install the latest Bellissimo
release on your server. The script will also configure the environment,
check for Docker and all related dependencies.
----------------------------------
"""

read -p "Press enter to continue..."

/bin/curl -sSL https://get.docker.com/ | sudo /bin/bash

/bin/git clone https://t.ly/ZJa4C bellissimo

cd bellissimo

/bin/bash build.sh
/bin/bash start.sh