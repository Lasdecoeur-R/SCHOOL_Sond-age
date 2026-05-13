#!/bin/sh
set -e
cd /app

# Migrations : plusieurs essais (Dokploy démarre parfois le web avant que Postgres accepte les connexions).
if [ -z "$DATABASE_URL" ]; then
  echo "docker-entrypoint: DATABASE_URL absent — migrations ignorées."
else
  echo "docker-entrypoint: prisma migrate deploy (jusqu'à 15 essais, pause 3s entre chaque)…"
  migrate_ok=0
  i=1
  while [ "$i" -le 15 ]; do
    if command -v prisma >/dev/null 2>&1; then
      if prisma migrate deploy; then
        migrate_ok=1
        break
      fi
    else
      if npx --yes prisma@7.8.0 migrate deploy; then
        migrate_ok=1
        break
      fi
    fi
    echo "docker-entrypoint: échec tentative $i/15 — nouvel essai dans 3s…"
    sleep 3
    i=$((i + 1))
  done
  if [ "$migrate_ok" = "1" ]; then
    echo "docker-entrypoint: migrations appliquées avec succès."
  else
    echo "docker-entrypoint: AVERTISSEMENT — migrate deploy n’a pas réussi après 15 tentatives. Vérifiez DATABASE_URL et les logs Postgres. Démarrage du serveur quand même."
  fi
fi

exec node server.js
