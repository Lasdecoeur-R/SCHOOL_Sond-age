#!/bin/sh
set -e
cd /app

# Migrations synchrones avant Node : évite « tables absentes » au premier chargement.
# MIGRATE_BOOT_SLEEP : pause initiale (s) pour laisser Postgres démarrer (Dokploy). 0 = aucune (docker compose local).
# MIGRATE_MAX_ATTEMPTS / MIGRATE_RETRY_PAUSE : boucle si migrate échoue (réseau / ordre de démarrage).
if [ -n "$DATABASE_URL" ]; then
  BOOT_SLEEP="${MIGRATE_BOOT_SLEEP:-8}"
  MAX_ATT="${MIGRATE_MAX_ATTEMPTS:-10}"
  RETRY_PAUSE="${MIGRATE_RETRY_PAUSE:-3}"

  if [ "$BOOT_SLEEP" != "0" ] && [ -n "$BOOT_SLEEP" ]; then
    echo "docker-entrypoint: pause ${BOOT_SLEEP}s avant migrate (MIGRATE_BOOT_SLEEP)…"
    sleep "$BOOT_SLEEP"
  fi

  echo "docker-entrypoint: prisma migrate deploy (max ${MAX_ATT} essais, ${RETRY_PAUSE}s entre échecs)…"
  migrate_ok=0
  i=1
  while [ "$i" -le "$MAX_ATT" ]; do
    if command -v prisma >/dev/null 2>&1; then
      if prisma migrate deploy; then
        migrate_ok=1
        echo "docker-entrypoint: migrations appliquées (tentative $i)."
        break
      fi
    else
      if npx --yes prisma@7.8.0 migrate deploy; then
        migrate_ok=1
        echo "docker-entrypoint: migrations appliquées via npx (tentative $i)."
        break
      fi
    fi
    echo "docker-entrypoint: échec tentative $i/${MAX_ATT}, pause ${RETRY_PAUSE}s…"
    sleep "$RETRY_PAUSE"
    i=$((i + 1))
  done

  if [ "$migrate_ok" != "1" ]; then
    echo "docker-entrypoint: AVERTISSEMENT — migrations non appliquées après ${MAX_ATT} essais. Le serveur démarre ; exécutez « prisma migrate deploy » dans le conteneur si besoin."
  fi
fi

# Next.js standalone utilise HOSTNAME comme adresse d’écoute (voir server.js).
# Docker / K8s / Dokploy injectent souvent HOSTNAME = nom du conteneur → 502.
export HOSTNAME=0.0.0.0
PORT="${PORT:-3000}"
echo "docker-entrypoint: Next.js sur 0.0.0.0:${PORT} (HOSTNAME=${HOSTNAME})"

exec node server.js
