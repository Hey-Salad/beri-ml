import { Hono } from 'hono'
import { cors } from 'hono/cors'

export interface Env {
  DB: D1Database
  GEMINI_API_KEY: string
  ADMIN_KEY: string
}

const app = new Hono<{ Bindings: Env }>()
app.use('*', cors())

// ─── Auth ─────────────────────────────────────────────────────────────────────

function authCheck(c: any): boolean {
  const header = c.req.header('Authorization') || ''
  const xkey = c.req.header('X-API-Key') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : xkey
  return token === c.env.ADMIN_KEY
}

// ─── Gemini Research Call ─────────────────────────────────────────────────────

async function callGeminiResearch(
  query: string,
  apiKey: string,
  pipeline?: string
): Promise<{ answer: string; sources: string[]; thinkingSummary: string }> {

  const systemInstructions: Record<string, string> = {
    engineering: `You are a senior software engineering researcher for HeySalad Inc.
Research the query thoroughly. Focus on: implementation details, code patterns,
best practices, relevant libraries, potential pitfalls, and concrete examples.
Always include specific, actionable findings.`,

    qa: `You are a QA and testing research specialist.
Research testing strategies, bug patterns, automation approaches,
and quality metrics relevant to the query.`,

    architecture: `You are a cloud architecture researcher specializing in
Cloudflare Workers, GCP, and distributed systems.
Focus on scalability, cost optimization, and practical implementation patterns.`,

    competitive: `You are a product research analyst for HeySalad Inc.
Research competitors, market trends, and feature comparisons.
Focus on actionable insights for product decisions.`,

    default: `You are a thorough research assistant for HeySalad Inc.
Research the query comprehensively and provide structured, actionable findings.`,
  }

  const systemPrompt = systemInstructions[pipeline || 'default'] || systemInstructions.default

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: query }]
      }
    ],
    tools: [{ google_search: {} }],
    generationConfig: {
      thinkingConfig: { thinkingBudget: 8192 },
      temperature: 0.3,
      maxOutputTokens: 8192,
    }
  }

  // Model selection: gemini-3-flash-preview for speed, deep-research-pro-preview-12-2025 for deep research
  const modelName = pipeline === 'deep' ? 'deep-research-pro-preview-12-2025' : 'gemini-3-flash-preview'

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`Gemini API error ${resp.status}: ${err}`)
  }

  const data: any = await resp.json()
  const candidate = data.candidates?.[0]
  const parts = candidate?.content?.parts || []

  let answer = ''
  let thinkingSummary = ''
  const sources: string[] = []

  for (const part of parts) {
    if (part.text) answer += part.text
    if (part.thought) thinkingSummary += part.thought
  }

  // Extract grounding sources
  const groundingMetadata = candidate?.groundingMetadata
  if (groundingMetadata?.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.web?.uri) sources.push(chunk.web.uri)
    }
  }

  return { answer: answer.trim(), sources, thinkingSummary: thinkingSummary.slice(0, 500) }
}

// ─── Cache Helpers ─────────────────────────────────────────────────────────────

function hashQuery(query: string, pipeline: string): string {
  // Simple deterministic key - Workers don't have crypto.subtle sync hash
  // Use first 80 chars of query + pipeline as cache key
  const normalized = query.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80)
  return `${pipeline}::${normalized}`
}

async function getCached(db: D1Database, cacheKey: string): Promise<any | null> {
  try {
    const row = await db.prepare(
      `SELECT answer, sources, thinking_summary, created_at
       FROM research_cache
       WHERE cache_key = ? AND created_at > datetime('now', '-24 hours')`
    ).bind(cacheKey).first()
    return row || null
  } catch {
    return null
  }
}

async function setCache(
  db: D1Database,
  cacheKey: string,
  query: string,
  pipeline: string,
  answer: string,
  sources: string[],
  thinkingSummary: string
): Promise<void> {
  try {
    await db.prepare(
      `INSERT OR REPLACE INTO research_cache
       (cache_key, query, pipeline, answer, sources, thinking_summary, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(cacheKey, query, pipeline, answer, JSON.stringify(sources), thinkingSummary).run()
  } catch {
    // Cache write failure is non-fatal
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health
app.get('/health', (c) =>
  c.json({ status: 'ok', service: 'gemini-research', model: 'gemini-3-flash-preview', deepResearchModel: 'deep-research-pro-preview-12-2025', timestamp: new Date().toISOString() })
)

// ─── POST /research — main research endpoint ──────────────────────────────────
//
// Body: { query: string, pipeline?: string, noCache?: boolean }
// Pipelines: engineering | qa | architecture | competitive | default
//
app.post('/research', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.json<{ query: string; pipeline?: string; noCache?: boolean }>()
  const { query, pipeline = 'default', noCache = false } = body

  if (!query || typeof query !== 'string') {
    return c.json({ error: 'query (string) required' }, 400)
  }

  const cacheKey = hashQuery(query, pipeline)

  // Check cache first (saves Gemini tokens)
  if (!noCache) {
    const cached = await getCached(c.env.DB, cacheKey)
    if (cached) {
      return c.json({
        answer: cached.answer,
        sources: JSON.parse(cached.sources || '[]'),
        thinkingSummary: cached.thinking_summary,
        cached: true,
        cachedAt: cached.created_at,
        pipeline,
        query,
      })
    }
  }

  // Call Gemini
  try {
    const { answer, sources, thinkingSummary } = await callGeminiResearch(
      query,
      c.env.GEMINI_API_KEY,
      pipeline
    )

    // Store in cache
    await setCache(c.env.DB, cacheKey, query, pipeline, answer, sources, thinkingSummary)

    // Store in research log
    try {
      await c.env.DB.prepare(
        `INSERT INTO research_log (query, pipeline, answer_length, source_count, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`
      ).bind(query, pipeline, answer.length, sources.length).run()
    } catch {}

    return c.json({ answer, sources, thinkingSummary, cached: false, pipeline, query })

  } catch (err: any) {
    return c.json({ error: err.message || 'Research failed' }, 500)
  }
})

// ─── POST /research/batch — run multiple queries in parallel ──────────────────
app.post('/research/batch', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.json<{ queries: Array<{ query: string; pipeline?: string; id?: string }> }>()
  const { queries } = body

  if (!Array.isArray(queries) || queries.length === 0) {
    return c.json({ error: 'queries array required' }, 400)
  }
  if (queries.length > 5) {
    return c.json({ error: 'Max 5 queries per batch' }, 400)
  }

  const results = await Promise.allSettled(
    queries.map(async ({ query, pipeline = 'default', id }) => {
      const cacheKey = hashQuery(query, pipeline)
      const cached = await getCached(c.env.DB, cacheKey)
      if (cached) {
        return { id, query, pipeline, answer: cached.answer, sources: JSON.parse(cached.sources || '[]'), cached: true }
      }
      const result = await callGeminiResearch(query, c.env.GEMINI_API_KEY, pipeline)
      await setCache(c.env.DB, cacheKey, query, pipeline, result.answer, result.sources, result.thinkingSummary)
      return { id, query, pipeline, ...result, cached: false }
    })
  )

  return c.json({
    results: results.map((r, i) =>
      r.status === 'fulfilled'
        ? { ...r.value, status: 'ok' }
        : { id: queries[i].id, query: queries[i].query, status: 'error', error: (r.reason as any)?.message }
    )
  })
})

// ─── GET /research/cache — list recent cached research ───────────────────────
app.get('/research/cache', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)

  const pipeline = c.req.query('pipeline')
  const limit = parseInt(c.req.query('limit') || '20')

  try {
    const query = pipeline
      ? `SELECT cache_key, query, pipeline, answer, created_at FROM research_cache WHERE pipeline = ? ORDER BY created_at DESC LIMIT ?`
      : `SELECT cache_key, query, pipeline, answer, created_at FROM research_cache ORDER BY created_at DESC LIMIT ?`

    const rows = pipeline
      ? await c.env.DB.prepare(query).bind(pipeline, limit).all()
      : await c.env.DB.prepare(query).bind(limit).all()

    return c.json({ results: rows.results, count: rows.results.length })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// ─── DELETE /research/cache — clear cache ─────────────────────────────────────
app.delete('/research/cache', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)
  await c.env.DB.prepare(`DELETE FROM research_cache`).run()
  return c.json({ message: 'Cache cleared' })
})

// ─── GET /research/pipelines — list available pipelines ───────────────────────
app.get('/research/pipelines', (c) =>
  c.json({
    pipelines: [
      { id: 'engineering', description: 'Software engineering, code patterns, libraries, best practices' },
      { id: 'qa', description: 'Testing strategies, bug patterns, QA automation' },
      { id: 'architecture', description: 'Cloud architecture, Cloudflare, GCP, distributed systems' },
      { id: 'competitive', description: 'Market research, competitor analysis, product intelligence' },
      { id: 'default', description: 'General-purpose research' },
      { id: 'deep', description: 'Deep research using deep-research-pro model — slower, thorough, best for complex topics' },
    ]
  })
)

// ─── Facts / Knowledge Base ────────────────────────────────────────────────────

// GET /facts — list all facts, optionally filtered by category
app.get('/facts', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)
  const category = c.req.query('category')
  try {
    const rows = category
      ? await c.env.DB.prepare(`SELECT key, value, category, description, updated_at FROM facts WHERE category = ? ORDER BY category, key`).bind(category).all()
      : await c.env.DB.prepare(`SELECT key, value, category, description, updated_at FROM facts ORDER BY category, key`).all()
    return c.json({ facts: rows.results, count: rows.results.length })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// GET /facts/:key — get a single fact
app.get('/facts/:key', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)
  const key = c.req.param('key')
  try {
    const row = await c.env.DB.prepare(`SELECT key, value, category, description, updated_at FROM facts WHERE key = ?`).bind(key).first()
    if (!row) return c.json({ error: 'Not found' }, 404)
    return c.json(row)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// PUT /facts/:key — upsert a fact
app.put('/facts/:key', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)
  const key = c.req.param('key')
  const body = await c.req.json<{ value: string; category?: string; description?: string }>()
  if (!body.value) return c.json({ error: 'value required' }, 400)
  try {
    await c.env.DB.prepare(
      `INSERT OR REPLACE INTO facts (key, value, category, description, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))`
    ).bind(key, body.value, body.category || 'general', body.description || null).run()
    return c.json({ key, value: body.value, category: body.category || 'general', message: 'Stored' })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// DELETE /facts/:key — remove a fact
app.delete('/facts/:key', async (c) => {
  if (!authCheck(c)) return c.json({ error: 'Unauthorized' }, 401)
  const key = c.req.param('key')
  await c.env.DB.prepare(`DELETE FROM facts WHERE key = ?`).bind(key).run()
  return c.json({ message: `Deleted ${key}` })
})

export default app
