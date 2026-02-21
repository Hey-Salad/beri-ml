#!/usr/bin/env bash
# fix-missing-secrets.sh
# Re-uploads secrets that were stored empty in apple-pie-sk worker
# Run this from the beri-ml/cloudflare/apple-pie-sk directory, OR
# pass the path to the apple-pie-sk directory as an argument.
#
# Usage:
#   bash fix-missing-secrets.sh [path-to-p8-file]
#   bash fix-missing-secrets.sh ~/Downloads/AuthKey_KWV4RW4JTP.p8

set -e

WORKER_DIR="$(cd "$(dirname "$0")/../cloudflare/apple-pie-sk" && pwd)"
P8_FILE="${1:-}"

echo "=== HeySalad apple-pie-sk Secret Fix ==="
echo ""

# Check we're in the right place
if [ ! -f "$WORKER_DIR/wrangler.toml" ]; then
  echo "ERROR: Cannot find $WORKER_DIR/wrangler.toml"
  exit 1
fi

# ── 1. APPLE_API_KEY_P8 ──────────────────────────────────────────────────────
echo "── 1. APPLE_API_KEY_P8 ──"
echo "This is the App Store Connect private key (KWV4RW4JTP)."
echo "The file is named: AuthKey_KWV4RW4JTP.p8"
echo "You can download it from: https://appstoreconnect.apple.com → Users & Access → Integrations → App Store Connect API"
echo "(Note: If you already downloaded it, Apple won't let you download it again - use your saved copy)"
echo ""

if [ -n "$P8_FILE" ] && [ -f "$P8_FILE" ]; then
  echo "Uploading from: $P8_FILE"
  cd "$WORKER_DIR"
  npx wrangler secret put APPLE_API_KEY_P8 < "$P8_FILE"
  echo "✓ APPLE_API_KEY_P8 uploaded"
else
  echo "No P8 file provided. To upload manually:"
  echo "  cd $WORKER_DIR"
  echo "  npx wrangler secret put APPLE_API_KEY_P8 < ~/Downloads/AuthKey_KWV4RW4JTP.p8"
fi

echo ""

# ── 2. EXPO_TOKEN ─────────────────────────────────────────────────────────────
echo "── 2. EXPO_TOKEN (for EAS builds) ──"
echo "Get your token from: https://expo.dev/accounts/heysalad/settings/access-tokens"
echo ""
echo "Once you have the token, run:"
echo "  EXPO_TOKEN=eas_xxxx"
echo "  for repo in Hey-Salad/Pay Hey-Salad/heysalad-wallet Hey-Salad/heysalad-ai-app Hey-Salad/sally-mobile; do"
echo "    gh secret set EXPO_TOKEN --repo \$repo --body \"\$EXPO_TOKEN\""
echo "    echo \"Set EXPO_TOKEN in \$repo\""
echo "  done"
echo ""

# ── 3. AI API Keys ─────────────────────────────────────────────────────────────
echo "── 3. AI API Keys (optional - for /secrets/ai endpoint) ──"
echo "  cd $WORKER_DIR"
echo "  echo 'YOUR_OPENAI_KEY' | npx wrangler secret put OPENAI_API_KEY"
echo "  echo 'YOUR_ANTHROPIC_KEY' | npx wrangler secret put ANTHROPIC_API_KEY"
echo ""

echo "=== Done ==="
