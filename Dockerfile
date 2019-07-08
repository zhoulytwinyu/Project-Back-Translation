FROM alpine:3.10

# Install basic components
## FLASK BACKEND
### Install python3 for flask based backend
RUN apk add --no-cache python3
### Support PACKAGE compilation when running pip3 install PACKAGES
RUN apk add python3-dev build-base linux-headers
RUN pip3 install --upgrade pip
### Install dependencies
RUN pip3 install uwsgi flask

## NODEJS FRONTEND
RUN apk add --no-cache nodejs nodejs-npm

## NGINX BACK-PROXY 
RUN apk add --no-cache nginx
### For running nginx
RUN mkdir -p /run/nginx
### Copy config
COPY app-nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom frontend and beckend codes
RUN mkdir /app
COPY backend /app/backend
COPY frontend /app/frontend

WORKDIR /app/frontend
RUN npm install; npm run build

CMD uwsgi --ini /app/backend/wsgi.ini & \
    ls /app/frontend/build & \
    nginx -g "daemon off;"

