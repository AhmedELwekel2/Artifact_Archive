#!/bin/sh
set -e

# Sync the Prisma schema to the database (creates tables on first run; idempotent).
echo "==> Syncing database schema (prisma db push)..."
npx prisma db push --skip-generate

# Optionally seed the database once. Set SEED_ON_START=true to enable.
if [ "$SEED_ON_START" = "true" ]; then
  echo "==> Seeding database..."
  npx tsx prisma/seed.ts || echo "(seed skipped or already applied)"
fi

echo "==> Starting app..."
exec "$@"
