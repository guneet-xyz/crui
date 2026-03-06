FROM node:22-alpine AS build

ARG BUILD_VERSION=0.1.0

WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV SKIP_ENV_VALIDATION=1
ENV NEXT_PUBLIC_APP_VERSION=$BUILD_VERSION
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /src/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /src/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
