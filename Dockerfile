FROM node:6-alpine

ADD ./package.json /app/package.json
WORKDIR /app

RUN npm install

ADD . /app

ENV NODE_ENV production

CMD node index.js