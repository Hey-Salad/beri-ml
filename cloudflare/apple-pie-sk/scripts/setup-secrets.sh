#!/bin/bash
# apple-pie-sk secrets setup script
# Run this once after deploying the worker to store all credentials
# Usage: bash scripts/setup-secrets.sh

set -e

echo "🍎 HeySalad apple-pie-sk secrets setup"
echo "======================================="
echo ""

# Check wrangler is available
if ! command -v wrangler &> /dev/null; then
  echo "❌ wrangler not found. Run: npm install -g wrangler"
  exit 1
fi

echo "Setting Apple Developer secrets..."
echo ""

# ── Section 1: App Store Connect API Key ──────────────────────────────────
echo "APPLE_API_KEY_ID:"
printf 'KWV4RW4JTP' | wrangler secret put APPLE_API_KEY_ID

echo "APPLE_API_ISSUER_ID:"
printf 'fa3aacb8-899f-4624-a592-029f56e10623' | wrangler secret put APPLE_API_ISSUER_ID

echo ""
echo "APPLE_API_KEY_P8 (paste the full .p8 key content, then press Ctrl+D):"
echo "Tip: cat ~/Downloads/AuthKey_KWV4RW4JTP.p8 | wrangler secret put APPLE_API_KEY_P8"
cat ~/Downloads/AuthKey_KWV4RW4JTP.p8 | wrangler secret put APPLE_API_KEY_P8

# ── Section 2: Fastlane Match ──────────────────────────────────────────────
echo ""
echo "Setting Fastlane Match secrets..."

printf 'obuYS8pOWjZCG+1vACxvFptg32wXT2eq/YDZsY/c0yc=' | wrangler secret put MATCH_PASSWORD
printf 'https://github.com/Hey-Salad/heysalad-certificates.git' | wrangler secret put MATCH_GIT_URL

# ── Section 3: Team + Bundle IDs ──────────────────────────────────────────
echo ""
echo "Setting Team and Bundle IDs..."

printf 'A24823SWLS' | wrangler secret put TEAM_ID
printf 'com.heysalad.sally' | wrangler secret put BUNDLE_ID_SALLY

# ── Section 4: Admin Key ───────────────────────────────────────────────────
echo ""
echo "Generating admin key..."
ADMIN_KEY="hs_admin_$(openssl rand -hex 16)"
printf "$ADMIN_KEY" | wrangler secret put ADMIN_KEY

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  SAVE THIS ADMIN KEY - IT WILL NOT BE SHOWN AGAIN           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  ADMIN_KEY: $ADMIN_KEY"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ── Section 5: AI Keys (optional - add later) ─────────────────────────────
echo "⏭  AI API keys skipped (add later with wrangler secret put OPENAI_API_KEY etc.)"
echo ""
echo "✅ Apple secrets deployed to apple-pie-sk worker!"
echo ""
echo "Next steps:"
echo "  1. Save the ADMIN_KEY above securely"
echo "  2. Add custom domain: apple-pie-sk.heysalad.app in Cloudflare Dashboard"
echo "  3. Register agent keys: curl -X POST https://apple-pie-sk.heysalad.app/agents/register"
echo "     -H 'Authorization: Bearer <ADMIN_KEY>'"
echo "     -d '{\"name\": \"cheri-ml\", \"scopes\": [\"apple\", \"ai\"]}'"
