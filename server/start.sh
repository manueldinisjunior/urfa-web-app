#!/bin/sh
# Author: Manuel Dinis Júnior
set -eu

# Render supplies this URL at runtime; explicit configuration takes precedence.
PUBLIC_URL="${PUBLIC_URL:-${RENDER_EXTERNAL_URL:-}}"
ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-$PUBLIC_URL}"
export PUBLIC_URL ALLOWED_ORIGINS

# Stop on migration failure. Bootstrap never resets an existing admin password.
node server/setup.mjs --bootstrap-admin
exec node server/index.mjs
