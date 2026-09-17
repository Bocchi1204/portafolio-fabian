#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$repo_dir"

export HOST=127.0.0.1
export PORT="${PORT:-4181}"
export PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-https://fyramirez.dev}"

node server.mjs &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT INT TERM

exec cloudflared tunnel --url "http://127.0.0.1:${PORT}" --no-autoupdate
