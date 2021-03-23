# build stage
FROM node:14-alpine3.12 AS build
WORKDIR /usr/src/app/
COPY package*.json .
RUN npm ci --only=production

# production stage
FROM node:14-alpine3.12
LABEL maintainer="Ruslan Tereshchenko <mr.russell.swift@gmail.com>"
LABEL version="1.0.0"
LABEL description="ETL csv to mongo worker"

ENV NODE_ENV production
ENV WORKER_HOME /worker

WORKDIR $WORKER_HOME
COPY --chown=node:node . $WORKER_HOME
COPY --chown=node:node --from=build /usr/src/app/node_modules $WORKER_HOME/node_modules
RUN apk add --no-cache dumb-init
USER node

CMD ["dumb-init", "node", "--use-strict", "index.js"]
