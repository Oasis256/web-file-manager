FROM php:7.4-fpm

RUN apt-get update && add-apt-repository ppa:ondrej/php && apt update\
    apt-get install -y git zip php7.4-gd

RUN curl --silent --show-error https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Uncomment to have mysqli extension installed and enabled
# RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
