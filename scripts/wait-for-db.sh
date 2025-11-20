#!/usr/bin/env bash
set -e

# Wait for Postgres TCP port to be available (works in bash via /dev/tcp)
host="${DB_HOST:-db}"
port="${DB_PORT:-5432}"
max_attempts=60
attempt=0

echo "Waiting for database at $host:$port..."
until (echo > /dev/tcp/"$host"/"$port") >/dev/null 2>&1; do
  attempt=$((attempt+1))
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Timed out waiting for database after $max_attempts seconds"
    exit 1
  fi
  sleep 1
done

echo "Database is available; generating Prisma client and pushing schema..."
npm run db:gen
npm run db:push

echo "Starting dev server"
npm run dev
