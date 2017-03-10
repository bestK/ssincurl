# 使用官方 PHP-Apache 镜像
FROM php:5.6-apache
# docker-php-ext-install 为官方 PHP 镜像内置命令，用于安装 PHP 扩展依赖
RUN apt-get update && apt-get install -y php5-curl php5-gd
# pdo_mysql 为 PHP 连接 MySQL 扩展
#RUN docker-php-ext-install pdo_mysql
#RUN a2enmod rewrite

WORKDIR /var/www

COPY . /var/www
