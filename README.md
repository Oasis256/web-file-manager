# Docker Compose Web File Manager

This repository contains a little `docker-compose` configuration to start a `LEMP (Linux, Nginx, File manger, PHP)` stack.


## Configuration

The Nginx configuration can be found in `config/nginx/`.

You can also set the following environment variables, for example in the included `.env` file:

| Key | Description |
|-----|-------------|
|APP_NAME|The name used when creating a container.|
|MYSQL_ROOT_PASSWORD|The MySQL root password used when creating the container.|

## Usage

To use it, simply follow the following steps:

##### Clone this repository.

Clone this repository with the following command: `git clone https://github.com/stevenliebregt/docker-compose-lemp-stack.git`.

##### Start the server.

Start the server using the following command inside the directory you just cloned: `docker-compose up`.

## Entering the containers

You can use the following command to enter a container:

Where `{CONTAINER_NAME}` is one of:

`docker exec -ti {CONTAINER_NAME} /bin/bash`

* `{APP_NAME}-php`
* `{APP_NAME}-nginx`
