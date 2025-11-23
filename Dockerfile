FROM node:20-alpine

WORKDIR /usr/src/app

# lightweight shell for scripts
RUN apk add --no-cache bash

# copy package manifests first for better cache
COPY package.json package-lock.json* ./

# install dependencies (including dev deps so prisma CLI is available)
RUN npm install

# copy source
COPY . .

# generate prisma client at build time (best-effort)
RUN npm run db:gen || true

ENV PORT=4000
EXPOSE 4000

# Development entry (vite-node) — container runs dev server
CMD ["npm", "run", "dev"]
