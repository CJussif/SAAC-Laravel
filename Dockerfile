# =============================================================
# SAAC-Laravel — imagen de producción (multi-stage)
#
#  stage "build" : PHP 8.4 + Node 22 → compila vendor (composer)
#                  y los assets de Vite (npm run build).
#  stage "app"   : php-fpm con el código + vendor + public/build.
#  stage "web"   : nginx con SOLO public/ (assets estáticos horneados).
#
# SQLite: la BD vive en database/database.sqlite persistida en un
# volumen Docker — no hay servicio de base de datos separado.
# =============================================================

# ---------- helper para extensiones PHP ----------
FROM mlocati/php-extension-installer:latest AS php-ext

# =============================================================
# Stage 1 — BUILD (PHP + Node)
# =============================================================
FROM php:8.4-cli-bookworm AS build

COPY --from=php-ext /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_sqlite intl zip bcmath gd \
 && apt-get update && apt-get install -y --no-install-recommends git unzip ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Node 22
COPY --from=node:22-bookworm-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-bookworm-slim /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# --- deps PHP (cacheable) ---
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# --- deps Node (cacheable) ---
COPY package.json package-lock.json ./
RUN npm ci

# --- código fuente completo ---
COPY . .

# Entorno mínimo para que `artisan` arranque durante el build.
# SQLite efímero — solo para que Vite/Ziggy puedan ejecutar artisan.
ENV APP_ENV=production \
    APP_DEBUG=false \
    APP_KEY=base64:0000000000000000000000000000000000000000000= \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/app/database/build.sqlite

RUN touch /app/database/build.sqlite \
 && composer install --no-dev --optimize-autoloader --no-interaction \
 && npm run build \
 && rm -rf node_modules /app/database/build.sqlite

# =============================================================
# Stage 2 — APP (php-fpm)
# =============================================================
FROM php:8.4-fpm-bookworm AS app

COPY --from=php-ext /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_sqlite intl zip bcmath pcntl opcache gd

WORKDIR /var/www/html

COPY --from=build --chown=www-data:www-data /app /var/www/html

# Permisos de Laravel + directorio de la BD SQLite
RUN mkdir -p storage/framework/cache storage/framework/sessions \
              storage/framework/views storage/logs bootstrap/cache database \
 && chown -R www-data:www-data storage bootstrap/cache database \
 && chmod -R 775 storage bootstrap/cache database

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/zz-opcache.ini

USER www-data
EXPOSE 9000
CMD ["php-fpm"]

# =============================================================
# Stage 3 — WEB (nginx con assets estáticos horneados)
# =============================================================
FROM nginx:1.27-alpine AS web

COPY --from=build /app/public /var/www/html/public
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
