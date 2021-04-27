# Build it
FROM node:15.4.0-alpine3.10 AS build

WORKDIR /app

COPY package.json /app

RUN yarn install && yarn cache clean

COPY . /app

RUN yarn run build

# Serve it
FROM nginx:1.19.6

COPY .docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html
