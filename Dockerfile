# syntax=docker/dockerfile:1
#
# Racine du dépôt Git (Dokploy, etc.) : le code applicatif est dans nextjs-sondage/.
#
# Dokploy (exemples) :
#   • Dockerfile = Dockerfile, contexte = ., build path = /
#   • ou Dockerfile = nextjs-sondage/Dockerfile, contexte = nextjs-sondage
#
# Variables utiles au runtime (optionnel) : MIGRATE_BOOT_SLEEP (défaut 8), MIGRATE_MAX_ATTEMPTS (10), MIGRATE_RETRY_PAUSE (3).

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY nextjs-sondage/package.json nextjs-sondage/package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY nextjs-sondage/ .
ENV NEXT_TELEMETRY_DISABLED=1
# generate n’appelle pas la base ; env() exige DATABASE_URL au chargement de prisma.config.ts
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public" npx prisma generate
RUN npm run build

# CLI Prisma isolé : ne pas fusionner avec node_modules Next standalone (postinstall engines cassé).
FROM base AS prisma_cli
WORKDIR /prisma
RUN printf '%s\n' '{"private":true}' > package.json \
  && npm install prisma@7.8.0 --omit=dev --no-audit --no-fund

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/app/generated ./app/generated
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/adapter-pg ./node_modules/@prisma/adapter-pg
COPY --from=prisma_cli /prisma/node_modules /prisma/node_modules

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv ./node_modules/dotenv

USER root
RUN sed -i "s#const hostname = process.env.HOSTNAME || '0.0.0.0'#const hostname = '0.0.0.0'#" /app/server.js \
  && chmod +x /app/docker-entrypoint.sh \
  && chown -R nextjs:nodejs /prisma
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/app/docker-entrypoint.sh"]
