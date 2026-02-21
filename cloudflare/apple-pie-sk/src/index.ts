import { Hono } from 'hono'
import { cors } from 'hono/cors'

export interface Env {
  // KV for agent keys
  AGENT_KEYS: KVNamespace

  // Admin key (Worker Secret)
  ADMIN_KEY: string

  // Apple Developer credentials (Worker Secrets)
  APPLE_API_KEY_ID: string
  APPLE_API_ISSUER_ID: string
  APPLE_API_KEY_P8: string
  MATCH_PASSWORD: string
  MATCH_GIT_URL: string
  TEAM_ID: string
  BUNDLE_ID_SALLY: string

  // AI API keys (Worker Secrets)
  OPENAI_API_KEY: string
  ANTHROPIC_API_KEY: string
  CHERIML_API_KEY: string
  GOOGLE_VERTEX_KEY: string

  // MCP Server
  MCP_API_KEY: string
  MCP_GATEWAY_URL: string

  // Mac Build Infrastructure (Worker Secrets)
  MAC_SSH_KEY: string
  MAC_HOST_IP: string
}

interface AgentKey {
  name: string
  scopes: string[]
  createdAt: string
}

type Variables = {}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

app.use('*', cors())

// ─── Auth Helper ────────────────────────────────────────────────────────────

async function authenticate(
  c: any,
  requiredScopes: string[] = []
): Promise<boolean> {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false

  const token = authHeader.slice(7).trim()

  // Admin key has full access
  if (token === c.env.ADMIN_KEY) return true

  // Look up agent key in KV
  const raw = await c.env.AGENT_KEYS.get(token)
  if (!raw) return false

  const agent: AgentKey = JSON.parse(raw)

  // Admin scope in agent grants full access
  if (agent.scopes.includes('admin')) return true

  // Check required scopes
  if (requiredScopes.length > 0) {
    const hasAll = requiredScopes.every((s) => agent.scopes.includes(s))
    if (!hasAll) return false
  }

  return true
}

// ─── Health ─────────────────────────────────────────────────────────────────

app.get('/health', (c) =>
  c.json({
    status: 'ok',
    service: 'apple-pie-sk',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
)

// ─── Apple Secrets ───────────────────────────────────────────────────────────

app.get('/secrets/apple', async (c) => {
  const ok = await authenticate(c, ['apple'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  return c.json({
    keyId: c.env.APPLE_API_KEY_ID,
    issuerId: c.env.APPLE_API_ISSUER_ID,
    keyP8: c.env.APPLE_API_KEY_P8,
    matchPassword: c.env.MATCH_PASSWORD,
    matchGitUrl: c.env.MATCH_GIT_URL,
    teamId: c.env.TEAM_ID,
    bundleIds: {
      sally: c.env.BUNDLE_ID_SALLY,
    },
  })
})

// ─── AI Secrets ─────────────────────────────────────────────────────────────

app.get('/secrets/ai', async (c) => {
  const ok = await authenticate(c, ['ai'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  return c.json({
    openai: c.env.OPENAI_API_KEY,
    anthropic: c.env.ANTHROPIC_API_KEY,
    cheriml: c.env.CHERIML_API_KEY,
    googleVertex: c.env.GOOGLE_VERTEX_KEY,
  })
})

// ─── MCP Secrets ─────────────────────────────────────────────────────────────

app.get('/secrets/mcp', async (c) => {
  const ok = await authenticate(c, ['ai'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  return c.json({
    apiKey: c.env.MCP_API_KEY,
    gatewayUrl: c.env.MCP_GATEWAY_URL,
    domains: ['engineering', 'sales', 'customer-success', 'marketing', 'people', 'finance', 'data', 'executive'],
  })
})

// ─── Mac Build Infrastructure ────────────────────────────────────────────────

app.get('/secrets/mac', async (c) => {
  const ok = await authenticate(c, ['mac'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  return c.json({
    sshKey: c.env.MAC_SSH_KEY,
    hostIp: c.env.MAC_HOST_IP || null,
    keyName: 'heysalad-mac-builder',
    region: 'eu-west-1',
    instanceType: 'mac2.metal',
    sshUser: 'ec2-user',
    sshPort: 22,
  })
})

// ─── Individual Secret (admin only) ──────────────────────────────────────────

app.get('/secrets/:name', async (c) => {
  const ok = await authenticate(c, ['admin'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  const name = c.req.param('name').toUpperCase()
  const value = (c.env as any)[name]

  if (!value) return c.json({ error: 'Secret not found' }, 404)

  return c.json({ name, value })
})

// ─── Agent Management ────────────────────────────────────────────────────────

app.post('/agents/register', async (c) => {
  const ok = await authenticate(c, ['admin'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.json<{ name: string; scopes: string[] }>()
  const { name, scopes } = body

  if (!name || !scopes || !Array.isArray(scopes)) {
    return c.json({ error: 'name (string) and scopes (array) required' }, 400)
  }

  const validScopes = ['apple', 'ai', 'deploy', 'mac', 'admin']
  const invalidScopes = scopes.filter((s) => !validScopes.includes(s))
  if (invalidScopes.length > 0) {
    return c.json(
      { error: `Invalid scopes: ${invalidScopes.join(', ')}. Valid: ${validScopes.join(', ')}` },
      400
    )
  }

  const suffix = crypto.randomUUID().split('-')[0]
  const key = `hs_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${suffix}`

  const agentData: AgentKey = {
    name,
    scopes,
    createdAt: new Date().toISOString(),
  }

  await c.env.AGENT_KEYS.put(key, JSON.stringify(agentData))

  return c.json({ key, name, scopes, message: 'Agent registered' }, 201)
})

app.get('/agents', async (c) => {
  const ok = await authenticate(c, ['admin'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  const list = await c.env.AGENT_KEYS.list()
  const agents = await Promise.all(
    list.keys.map(async (k) => {
      const raw = await c.env.AGENT_KEYS.get(k.name)
      return { key: k.name, ...(raw ? JSON.parse(raw) : {}) }
    })
  )

  return c.json({ agents })
})

app.delete('/agents/:key', async (c) => {
  const ok = await authenticate(c, ['admin'])
  if (!ok) return c.json({ error: 'Unauthorized' }, 401)

  const key = c.req.param('key')
  await c.env.AGENT_KEYS.delete(key)

  return c.json({ message: `Agent ${key} revoked` })
})

export default app
// This is appended - see full file for context
