# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./

RUN npm install

COPY . /app

ARG VITE_API_URL
ARG VITE_USER_API_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USER_API_URL=$VITE_USER_API_URL

RUN npm run build

# Serve stage
FROM nginx:1.27-alpine

COPY .docker/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
