FROM node:12-alpine
MAINTAINER Andre Lima <aferlim@gmail.com>


WORKDIR /home/node/cognito_middleware

ADD package*.json ./
ADD .env ./
RUN npm i

ADD ./src ./src/

EXPOSE 3002

CMD npm start