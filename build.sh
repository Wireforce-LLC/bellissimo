#!/bin/bash

echo """
----------------------------------
  ___      _ _ _       _             ___      _ _    _   _____         _    
 | _ ) ___| | (_)_____(_)_ __  ___  | _ )_  _(_) |__| | |_   _|__  ___| |___
 | _ \/ -_) | | (_-<_-< | '  \/ _ \ | _ \ || | | / _  |   | |/ _ \/ _ \ (_-<
 |___/\___|_|_|_/__/__/_|_|_|_\___/ |___/\_,_|_|_\__,_|   |_|\___/\___/_/__/

 Build and start server for Bellissimo      
 Automatically configure docker.env and build the binaries                                
----------------------------------
"""

# If not Linux or macOS
if [ "$(uname)" != "Linux" -a "$(uname)" != "Darwin" ]; then
    echo "Only Linux and macOS are supported" >&2
    exit 0
fi

echo "Starting build..."

## Build
echo "Building core..."
echo "Do you want to build binaries of bellissimo-core? (y/n)"\
&& read -r answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    ## Prebuild
    echo "Prebuilding..."
    if [ ! -d "plugins" ]; then
        echo "🔨 Creating folder 'plugins'..."
        mkdir -p plugins || exit
    fi

    if [ ! -d "public" ]; then
        echo "🔨 Creating folder 'public'..."
        mkdir -p public || exit
    fi

    if [ ! -f "config.local.toml" ]; then
        echo "🔨 Creating config.local.toml..."
        touch config.local.toml || exit
    fi

    if [ ! -f "plugins.toml" ]; then
        echo "🔨 Creating plugins.toml..."
        touch plugins.toml || exit
    fi
    
    echo "🔨 Building bin..."
    docker compose build
fi

echo "Building Web..."
echo "Do you want to build web of bellissimo? (y/n)"\
&& read -r answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    cd web || exit

    npm install -force || exit
    npm run build || exit

    cd ..
fi


if [ ! -f "docker.env" ]; then
    echo "🔨 Creating docker.env..."
    echo "Do you want continue? (y/n)"\
    && read -r answer
    if [ "$answer" != "${answer#[Yy]}" ] ;then
        /bin/bash configure.sh
    fi
fi

echo "Do you want to start server? (y/n)"\
&& read -r answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    echo "🚀 Starting server..."
    /bin/bash start.sh
fi

echo "Done!"
