#!/bin/sh
set -e
cd /app

if [ -z "$DATABASE_URL" ]; then
  echo "docker-entrypoint: DATABASE_URL absent — migrations ignorées."
else
  echo "docker-entrypoint: prisma migrate deploy…"
  npx --yes prisma@7.8.0 migrate deploy
fi

exec node server.js
