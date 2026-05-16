#!/bin/sh
# cspell:ignore reuid regid
set -eu

ensure_node_writable() {
  target="$1"
  mkdir -p "$target"
  chown -R node:node "$target"
}

if [ "$(id -u)" -eq 0 ]; then
  # Earlier dev volumes may still be root-owned from the pre-hardening stack.
  ensure_node_writable /app/node_modules
  ensure_node_writable /app/.next

  exec setpriv --reuid node --regid node --init-groups \
    env \
    HOME=/home/node \
    USER=node \
    LOGNAME=node \
    npm_config_cache=/home/node/.npm \
    sh -c 'npm ci && exec npm run dev -- --hostname 0.0.0.0'
fi

exec sh -c 'npm ci && exec npm run dev -- --hostname 0.0.0.0'
