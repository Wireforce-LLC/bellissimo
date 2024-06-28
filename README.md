<img src="https://i.ibb.co/KKs27vd/icon.png" align="right" width="100" height="100">

<h1>w/bellissimo<br/><br/></h1>

**Tracker** and **cloaking system** in one tool. Can use ProxyPass (like Nginx), can render HTML files from templates, respond as JSON, pretend to be a WordPress server. Have Web UI and API.

**Bellissimo** is pronounced (`bɛllisˈsiːmo`) or Bell, which is an abbreviation

![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)

## Setup Guide
Get the app running locally in the following way:

```bash
git clone https://t.ly/ZJa4C bellissimo

cd bellissimo

/bin/bash build.sh
/bin/bash start.sh
```

## Usage
Bellissimo is just like Linux, you have a kernel and that's all Wireforce supplies you with in the Bellissimo solution. . Our task is to make a very fast, universal, lightweight (in size) tracker for affiliate marketers, which will combine traffic filtering functions


## Tour of Bellissimo
### Create a new resource
In Bell. you create a resource. The URL will link to this resource through the filter. It can be anything, as deep as you like. One resource can be referenced an unlimited number of times, and depending on the parameters of your router, the resource can be modified in Runtime

![](https://i.ibb.co/CWLnPxC/2024-06-29-1-11-48-AM.png)
<small>In Bell. you are free to create as many resources as you like, which you can then link to as many different routes as you like on different domains</small>

### Filters
Bellissimo does not strictly use one filter per route. You are free to create as many filters as you like and reuse them. We also have ready-made presets for filtering bots from Facebook / Google or for reflecting spam traffic or low-quality users that can harm your advertising campaign or your infrastructure

![](https://i.ibb.co/VTQ0X3B/2024-06-29-1-17-13-AM.png)
<small>In Bell. you can direct traffic to different sources, depending on the filters. And we have a lot of plugins</small>

### Will help when the IDE is not nearby
Bellissimo has a wide range of functions for working with files inside Bell. You can create, open, edit files of different formats, HTML, PHP, JS, CSS, Rust, XML, MD

![](https://i.ibb.co/42ZtggV/2024-06-29-1-25-56-AM.png)
<small>In Bell. you can direct traffic to different sources, depending on the filters. And we have a lot of plugins</small>


## Templating 
Almost every content display driver in Bell. supports templating implemented natively in each language.

#### HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    Hello! 
    Now {{time}} seconds!
    Also you can use {{nanoid}}

    Your ip {{ip}}

    And your GET query key 'utm_source' is {{utm_source}}
</body>
</html>
```
<small>HTML implements all meta parameters in {{NAME}}. No spaces, strictly two curly braces</small>

#### PHP
```php
<?php

echo "Hello! Your IP: " . $_GET["ip"];
```
<small>PHP implements all meta parameters in $_GET</small>

#### JSON
```json
{
    "ip": {
        "description": "Hello! Your IP: {{ip}}",
        "utm_source_from_get": "{{utm_source}}"
    }
}
```
<small>
JSON implements all meta parameters in {{NAME}}. Like HTML
</small>

## Basic configuration
All _Bell_ settings are stored in the see [config.toml](./config.local.toml) file. Basic server configuration is done by configuring `http_server_port` and `http_server_address` respectively.

```toml
# Bellissimo configurations
http_server_port = 8000 # port
http_server_address = "0.0.0.0" # host or ip
```

