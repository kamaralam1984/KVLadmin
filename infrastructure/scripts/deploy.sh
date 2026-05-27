#!/bin/bash
# KVL Central — VPS Deploy Script
# Run: bash deploy.sh

set -e

APP_DIR="/var/www/kvl-admin"
REPO="https://github.com/kamaralam1984/KVLadmin.git"
SERVICE="kvl-admin"

echo "→ Pulling latest code..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR" && git pull origin main
else
  git clone "$REPO" "$APP_DIR" && cd "$APP_DIR"
fi

echo "→ Installing dependencies..."
npm install --production=false

echo "→ Building..."
npm run build

echo "→ Restarting service..."
pm2 restart "$SERVICE" 2>/dev/null || pm2 start npm --name "$SERVICE" -- start

echo "✅ Deployed!"
pm2 status "$SERVICE"
