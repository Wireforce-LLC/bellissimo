#!/bin/bash

if [ "$(uname)" != "Linux" -a "$(uname)" != "Darwin" ]; then
    echo "Only Linux and macOS are supported" >&2
    exit 0
fi

echo """
----------------------------------
Bellissimo Build Tools
----------------------------------
"""

## Prebuild
echo "Prebuilding..."
echo "Creating folders..."
mkdir -p plugins
mkdir -p public

echo "Creating plugins.toml..."
touch plugins.toml

echo "Creating config.local.toml..."
touch config.local.toml

## Build
echo "Building core..."
echo "Do you want to build binaries of bellissimo-core? (y/n)"\
&& read -r answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    docker compose build
fi

echo "Building Web..."
echo "Do you want to build web of bellissimo? (y/n)"\
&& read -r answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    cd web || exit

    npm install
    npm run build
fi
