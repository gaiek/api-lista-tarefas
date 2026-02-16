FROM node:22-alpine AS builder

WORKDIR /api-blog

COPY ./ ./

RUN yarn && yarn build

FROM node:22-alpine

WORKDIR /api-blog

COPY --from=builder /api-blog/dist ./dist
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn --production=true

CMD ["node", "./dist/server.js"]