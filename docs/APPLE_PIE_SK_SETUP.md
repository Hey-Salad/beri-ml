# apple-pie-sk.heysalad.app - HeySalad Secrets API

**Status**: LIVE ✅
**URL**: https://apple-pie-sk.heysalad.app
**Fallback**: https://apple-pie-sk.heysalad-o.workers.dev
**Deployed**: February 21, 2026
**Platform**: Cloudflare Workers + KV

---

## What It Is

A secure secrets API that stores all HeySalad Apple Developer credentials and
AI API keys. Every CI/CD agent (Cheri-ML, Beri-ML, Sheri-ML, GitHub Actions,
Xcode Cloud) fetches credentials from here instead of storing them locally.

This eliminates:
- Hardcoded secrets in repos
- Per-developer credential setup
- Human friction when onboarding new agents

---

## Architecture

```
apple-pie-sk.heysalad.app
├── Cloudflare Worker (apple-pie-sk)     ← Hono TypeScript app
├── Cloudflare KV (AGENT_KEYS)           ← Per-agent API keys
└── Worker Secrets (encrypted at rest)   ← All credentials
```

### Cloudflare Resources Created

| Resource | ID |
|----------|----|
| Worker | apple-pie-sk |
| KV Namespace (AGENT_KEYS) | 81e496299ec24dadbd01c469c69e1a81 |
| DNS Record | apple-pie-sk.heysalad.app AAAA proxied |
| Workers Route | apple-pie-sk.heysalad.app/* |
| Zone | heysalad.app (ca60adc1b8803fb4093eef4e36717441) |
| Account | 67a17ada4efeee4480283035cc0c5f90 |

---

## Secrets Stored

### Apple Developer

| Secret Name | Description | Value |
|-------------|-------------|-------|
| `APPLE_API_KEY_ID` | App Store Connect API Key ID | KWV4RW4JTP |
| `APPLE_API_ISSUER_ID` | App Store Connect Issuer ID | fa3aacb8-899f-4624-a592-029f56e10623 |
| `APPLE_API_KEY_P8` | Private key (.p8 content) | Encrypted |
| `MATCH_PASSWORD` | Fastlane Match encryption password | Encrypted |
| `MATCH_GIT_URL` | Certificates repo URL | https://github.com/Hey-Salad/heysalad-certificates.git |
| `TEAM_ID` | Apple Developer Team ID | A24823SWLS |
| `BUNDLE_ID_SALLY` | Sally app Bundle ID | com.heysalad.sally |
| `ADMIN_KEY` | Worker admin key | Encrypted |

### AI Keys (add when ready)

| Secret Name | Description |
|-------------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic/Claude API key |
| `CHERIML_API_KEY` | Cheri-ML (ai.heysalad.app) API key |
| `GOOGLE_VERTEX_KEY` | Google Vertex AI key |

---

## Agent Keys

| Agent | Key | Scopes |
|-------|-----|--------|
| Cheri-ML | `hs_cheri_ml_3b2cae06` | apple, ai |
| Beri-ML | `hs_beri_ml_c4e34854` | apple, ai |
| Sheri-ML | `hs_sheri_ml_8d396898` | apple, ai, deploy |
| GitHub Actions | `hs_github_actions_89e45a01` | apple, deploy |
| Xcode Cloud | `hs_xcode_cloud_ca9a13be` | apple |

**Admin Key**: `hs_admin_e9540aa97947077b12dda1b4c1da0925`
Store this in your password manager. Never commit it.

---

## API Reference

All requests require: `Authorization: Bearer <key>`

### Health Check (no auth)
```bash
GET /health
→ {"status":"ok","service":"apple-pie-sk","version":"1.0.0"}
```

### Get Apple Credentials (scope: apple)
```bash
GET /secrets/apple
→ {
    "keyId": "KWV4RW4JTP",
    "issuerId": "fa3aacb8-...",
    "keyP8": "-----BEGIN PRIVATE KEY-----...",
    "matchPassword": "...",
    "matchGitUrl": "https://github.com/Hey-Salad/heysalad-certificates.git",
    "teamId": "A24823SWLS",
    "bundleIds": { "sally": "com.heysalad.sally" }
  }
```

### Get AI Keys (scope: ai)
```bash
GET /secrets/ai
→ { "openai": "...", "anthropic": "...", "cheriml": "...", "googleVertex": "..." }
```

### Register New Agent (scope: admin)
```bash
POST /agents/register
Body: {"name": "my-agent", "scopes": ["apple", "ai"]}
→ {"key": "hs_my_agent_abc12345", "name": "my-agent", "scopes": [...]}
```

### List Agents (scope: admin)
```bash
GET /agents
```

### Revoke Agent (scope: admin)
```bash
DELETE /agents/:key
```

---

## Cloudflare Tokens Created

| Token Name | Purpose | Permissions |
|------------|---------|-------------|
| `beri-ml-workers-deploy` | Deploy Workers, manage KV | Workers Scripts/KV/Routes Write |
| `beri-ml-dns-workers-routes` | DNS + route management | DNS Write + Workers Routes Write (heysalad.app zone only) |

Bootstrap token (token-creation only): stored securely, not listed here.

---

## How Agents Use It

### In GitHub Actions
```yaml
- name: Fetch Apple credentials
  run: |
    CREDS=$(curl -s https://apple-pie-sk.heysalad.app/secrets/apple \
      -H "Authorization: Bearer ${{ secrets.APPLE_PIE_SK_KEY }}")
    echo "MATCH_PASSWORD=$(echo $CREDS | python3 -c "import sys,json; print(json.load(sys.stdin)['matchPassword'])")" >> $GITHUB_ENV

- name: Run Fastlane Match
  run: |
    MATCH_PASSWORD=$MATCH_PASSWORD fastlane match appstore --readonly
```

Store `hs_github_actions_89e45a01` as GitHub Secret: `APPLE_PIE_SK_KEY`

### In Any Agent (Node.js)
```typescript
const res = await fetch('https://apple-pie-sk.heysalad.app/secrets/apple', {
  headers: { Authorization: 'Bearer hs_cheri_ml_3b2cae06' }
})
const creds = await res.json()
// creds.keyId, creds.matchPassword, creds.teamId etc.
```

---

## Adding New Secrets

```bash
cd /home/admin/beri-ml/cloudflare/apple-pie-sk

CLOUDFLARE_API_TOKEN="lov5W3fKQaWIasMvyYUSWSu9YRUo3BnkcjnCLL8l" \
CLOUDFLARE_ACCOUNT_ID="67a17ada4efeee4480283035cc0c5f90" \
printf 'your-secret-value' | npx wrangler secret put SECRET_NAME
```

---

## Source Code

```
/home/admin/beri-ml/cloudflare/apple-pie-sk/
├── src/index.ts          ← Worker code (Hono)
├── wrangler.toml         ← Cloudflare config
├── package.json
├── tsconfig.json
├── scripts/setup-secrets.sh
└── DEPLOY.md             ← Deployment guide
```

GitHub: https://github.com/Hey-Salad/beri-ml/tree/main/cloudflare/apple-pie-sk

---

## Fastlane Match (Certificate Storage)

All iOS certificates are encrypted and stored at:
**https://github.com/Hey-Salad/heysalad-certificates** (private repo)

- Certificate: `Apple Distribution: SALADHR TECHNOLOGY LTD (A24823SWLS)`
- Certificate ID: `866QW6GXW9`
- Profile UUID: `5355bdfd-f876-4e52-b15e-d2a9823f7c7a`
- Coverage: All HeySalad apps (com.heysalad.*)

To fetch certificates in any CI/CD environment:
```bash
MATCH_PASSWORD="<from apple-pie-sk>" fastlane match appstore --readonly
```

---

**Owner**: HeySalad Inc / Peter Machona
**Next Review**: When adding new apps or rotating credentials
