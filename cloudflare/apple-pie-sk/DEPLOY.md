# Deploy apple-pie-sk.heysalad.app

Run all of these commands on your Mac (takes ~5 minutes).

---

## Step 1: Install dependencies

```bash
cd ~/heysalad-fastlane   # or anywhere
cd /path/to/beri-ml/cloudflare/apple-pie-sk
npm install
```

## Step 2: Login to Cloudflare

```bash
npx wrangler login
```
Browser opens → log in to your Cloudflare account.

## Step 3: Create KV namespace

```bash
npx wrangler kv:namespace create AGENT_KEYS
```

Copy the `id` from the output and paste it into `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "AGENT_KEYS"
id = "PASTE_ID_HERE"   ← replace this
```

## Step 4: Deploy the worker

```bash
npx wrangler deploy
```

## Step 5: Store all secrets

```bash
bash scripts/setup-secrets.sh
```

This script stores all Apple credentials automatically.
**Save the ADMIN_KEY it prints** — you'll need it to register agents.

## Step 6: Add custom domain

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Click `apple-pie-sk` → Settings → Domains & Routes
3. Add custom domain: `apple-pie-sk.heysalad.app`

## Step 7: Register agent keys

```bash
ADMIN_KEY="your_admin_key_here"

# Cheri-ML (apple + ai access)
curl -X POST https://apple-pie-sk.heysalad.app/agents/register \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "cheri-ml", "scopes": ["apple", "ai"]}'

# Beri-ML (apple + ai access)
curl -X POST https://apple-pie-sk.heysalad.app/agents/register \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "beri-ml", "scopes": ["apple", "ai"]}'

# Sheri-ML (apple + ai + deploy access)
curl -X POST https://apple-pie-sk.heysalad.app/agents/register \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "sheri-ml", "scopes": ["apple", "ai", "deploy"]}'

# GitHub Actions (apple + deploy)
curl -X POST https://apple-pie-sk.heysalad.app/agents/register \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "github-actions", "scopes": ["apple", "deploy"]}'

# Xcode Cloud (apple only)
curl -X POST https://apple-pie-sk.heysalad.app/agents/register \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "xcode-cloud", "scopes": ["apple"]}'
```

Each curl call returns a key like `hs_cheri_ml_abc12345` — save these.

---

## Test it works

```bash
curl https://apple-pie-sk.heysalad.app/health
# → {"status":"ok","service":"apple-pie-sk","version":"1.0.0"}

curl https://apple-pie-sk.heysalad.app/secrets/apple \
  -H "Authorization: Bearer hs_cheri_ml_abc12345"
# → {"keyId":"KWV4RW4JTP","issuerId":"fa3aacb8-...","matchPassword":"..."}
```

---

## API Reference

| Method | Endpoint | Scope | Description |
|--------|----------|-------|-------------|
| GET | `/health` | None | Health check |
| GET | `/secrets/apple` | `apple` | All Apple credentials |
| GET | `/secrets/ai` | `ai` | All AI API keys |
| GET | `/secrets/:name` | `admin` | Any individual secret |
| POST | `/agents/register` | `admin` | Create agent key |
| GET | `/agents` | `admin` | List all agents |
| DELETE | `/agents/:key` | `admin` | Revoke agent |
