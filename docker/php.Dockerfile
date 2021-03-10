FROM php:7.4-fpm

ARG CERTBOT_EMAIL=oasis.sybill@webshule.online
ARG DOMAIN_LIST

RUN apt-get update && apt-get install -y cron certbot python-certbot-nginx bash wget \ 
    && certbot certonly --nginx --standalone --agree-tos -m "${CERTBOT_EMAIL}" -n -d ${DOMAIN_LIST} \ 
    && rm -rf /var/lib/apt/lists/* \
    && echo "@monthly certbot renew --nginx >> /var/log/cron.log 2>&1" >/etc/cron.d/certbot-renew \ 
    && crontab /etc/cron.d/certbot-renew \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && sync && \
    install-php-extensions mysqli pdo_mysql sockets imagick mcrypt swoole exif gettext memcache redis bz2 zip intl ldap memcached
VOLUME /etc/letsencrypt
CMD ["php-fpm", "sh", "-c", "cron && nginx -g 'daemon off;'"]

EXPOSE 9000
