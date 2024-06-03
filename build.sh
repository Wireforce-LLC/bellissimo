#!/bin/bash

## Prebuild
mkdir -p plugins
mkdir -p public

if [ "$(uname)" != "Linux" -a "$(uname)" != "Darwin" ]; then
    echo "Only Linux and macOS are supported" >&2
    exit 0
fi

cd web || exit

npm install
npm run build

