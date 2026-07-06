# Build it
FROM node:15.4.0-alpine3.10 AS build

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . /app

ARG REACT_APP_API_URL
ARG REACT_APP_USER_API_URL

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_USER_API_URL=$REACT_APP_USER_API_URL

RUN yarn run build

# Serve it
FROM nginx:1.19.6

COPY .docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html
