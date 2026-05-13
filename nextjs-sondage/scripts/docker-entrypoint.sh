#!/bin/sh
set -e
cd /app

# Migrations en arrière-plan : le serveur écoute tout de suite (évite 502 Traefik pendant migrate).
# Plusieurs essais si Postgres démarre après le conteneur web (Dokploy).
if [ -n "$DATABASE_URL" ]; then
  (
    set +e
    echo "docker-entrypoint: migrations en arrière-plan (jusqu'à 25 essais, 2s entre chaque)…"
    i=1
    while [ "$i" -le 25 ]; do
      if command -v prisma >/dev/null 2>&1; then
        if prisma migrate deploy; then
          echo "docker-entrypoint: migrations appliquées (tentative $i)."
          exit 0
        fi
      else
        if npx --yes prisma@7.8.0 migrate deploy; then
          echo "docker-entrypoint: migrations appliquées via npx (tentative $i)."
          exit 0
        fi
      fi
      echo "docker-entrypoint: migrate tentative $i/25 échouée, pause 2s…"
      sleep 2
      i=$((i + 1))
    done
    echo "docker-entrypoint: AVERTISSEMENT — migrations non appliquées après 25 essais (vérifiez DATABASE_URL)."
  ) &
fi

exec node server.js
