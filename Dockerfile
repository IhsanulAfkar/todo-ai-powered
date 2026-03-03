# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY postinstall.js ./postinstall.js 
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm exec next telemetry disable

COPY . .

RUN pnpm run build

# Stage 2: Build
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/postinstall.js ./postinstall.js
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

RUN npm install -g pnpm
RUN npm r npm -g

EXPOSE 3000

CMD ["node", "./dist/server.js"]
