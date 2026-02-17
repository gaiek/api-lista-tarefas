FROM node:22-alpine AS builder

WORKDIR /api-lista-tarefas 

COPY ./ ./

RUN yarn && yarn build

FROM node:22-alpine

WORKDIR /api-lista-tarefas 

COPY --from=builder /api-lista-tarefas /dist ./dist
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn --production=true

CMD ["node", "./dist/server.js"]