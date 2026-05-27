#!/bin/bash
# KVL Central — Wildcard SSL Setup (Let's Encrypt + Cloudflare DNS)
# Run on VPS as root: bash setup-wildcard.sh

set -e

DOMAIN="kvl-central.com"
EMAIL="admin@kvl-central.com"
CF_TOKEN="${CF_TOKEN:?'CF_TOKEN env var required. Run: export CF_TOKEN=your_token'}"

# ── 1. Install certbot + cloudflare plugin ────────────────────────────
echo "→ Installing certbot..."
apt-get update -q
apt-get install -y certbot python3-certbot-dns-cloudflare

# ── 2. Cloudflare credentials ─────────────────────────────────────────
CF_CREDS="/root/.cloudflare.ini"
cat > "$CF_CREDS" << EOF
dns_cloudflare_api_token = ${CF_TOKEN}
EOF
chmod 600 "$CF_CREDS"

# ── 3. Issue wildcard certificate ─────────────────────────────────────
echo "→ Issuing wildcard cert for *.${DOMAIN}..."
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials "$CF_CREDS" \
  --dns-cloudflare-propagation-seconds 30 \
  -d "${DOMAIN}" \
  -d "*.${DOMAIN}" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive

echo "✅ Wildcard SSL issued for *.${DOMAIN}"

# ── 4. Install Nginx config ───────────────────────────────────────────
echo "→ Installing Nginx config..."
cp "$(dirname "$0")/../nginx/kvl-central.conf" /etc/nginx/sites-available/kvl-central.conf
ln -sf /etc/nginx/sites-available/kvl-central.conf /etc/nginx/sites-enabled/kvl-central.conf

nginx -t && systemctl reload nginx
echo "✅ Nginx configured and reloaded"

# ── 5. Auto-renew cron ────────────────────────────────────────────────
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
echo "✅ Auto-renew cron set (daily 3AM)"

echo ""
echo "══════════════════════════════════════"
echo " KVL Central SSL setup complete!"
echo " Main:     https://${DOMAIN}"
echo " Wildcard: https://*.${DOMAIN}"
echo "══════════════════════════════════════"
