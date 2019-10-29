FROM node:dubnium-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY ./package*.json ./

RUN npm i

COPY ./src src

ENV PORT=80

ENTRYPOINT ["/usr/local/bin/npm", "run", "start"]