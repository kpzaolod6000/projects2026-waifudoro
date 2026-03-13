# ── Stage 1: Base (Shared dependencies) ────────────────────────────────────────
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# ── Stage 2: Development ──────────────────────────────────────────────────────
FROM base AS development

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

# ── Stage 3: Build (Production preparation) ───────────────────────────────────
FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build

# ── Stage 4: Production (Runner) ──────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4000

CMD ["node", "dist/server.js"]

