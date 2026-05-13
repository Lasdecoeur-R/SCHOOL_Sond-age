# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# generate n’appelle pas la base ; env() exige DATABASE_URL au chargement de prisma.config.ts
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public" npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Client Prisma (output personnalisé dans app/generated)
COPY --from=builder --chown=nextjs:nodejs /app/app/generated ./app/generated
# Dépendance parfois absente du trace standalone : évite MODULE_NOT_FOUND au runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/adapter-pg ./node_modules/@prisma/adapter-pg

# Migrations au démarrage (PostgreSQL vide → tables + schéma)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv ./node_modules/dotenv

# CLI Prisma : global pour `prisma migrate` + paquet local dans /app/node_modules pour que
# prisma.config.ts puisse résoudre `prisma/config` (absent du trace Next standalone).
USER root
# Next standalone : `const hostname = process.env.HOSTNAME || …` — K8s/Dokploy
# injectent HOSTNAME (nom du pod) et écrasent l’ENV de l’image → écoute injoignable → 502.
RUN sed -i "s#const hostname = process.env.HOSTNAME || '0.0.0.0'#const hostname = '0.0.0.0'#" /app/server.js \
  && npm install prisma@7.8.0 --no-save --omit=dev --prefix /app \
  && npm install -g prisma@7.8.0 \
  && chmod +x /app/docker-entrypoint.sh \
  && chown -R nextjs:nodejs /app/node_modules
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/app/docker-entrypoint.sh"]
