#!/bin/sh
set -e
cd /app

# Si migrate échoue (DB, réseau npm, etc.), on démarre quand même le serveur — sinon Traefik renvoie 502.
if [ -z "$DATABASE_URL" ]; then
  echo "docker-entrypoint: DATABASE_URL absent — migrations ignorées."
else
  echo "docker-entrypoint: prisma migrate deploy…"
  if ! npx --yes prisma@7.8.0 migrate deploy; then
    echo "docker-entrypoint: AVERTISSEMENT — migrate deploy a échoué. Vérifiez DATABASE_URL et les logs. Démarrage du serveur."
  fi
fi

exec node server.js
