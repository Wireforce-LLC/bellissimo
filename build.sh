#!/bin/bash

## Prebuild
mkdir -p plugins
mkdir -p public

touch plugins.toml

if [ "$(uname)" != "Linux" -a "$(uname)" != "Darwin" ]; then
    echo "Only Linux and macOS are supported" >&2
    exit 0
fi

docker compose build

cd web || exit

npm install
npm run build

