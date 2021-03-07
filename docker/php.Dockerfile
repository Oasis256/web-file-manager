FROM php:7.4-fpm
RUN useradd foo && mkdir /web && chown -R foo /web
USER foo
VOLUME /web
RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

CMD ["php-fpm"]

EXPOSE 9000
