-- Gemini Research Cache + Log
-- Run: wrangler d1 execute gemini-research-cache --file=schema.sql

CREATE TABLE IF NOT EXISTS research_cache (
  cache_key      TEXT PRIMARY KEY,
  query          TEXT NOT NULL,
  pipeline       TEXT NOT NULL DEFAULT 'default',
  answer         TEXT NOT NULL,
  sources        TEXT NOT NULL DEFAULT '[]',  -- JSON array of URLs
  thinking_summary TEXT,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS research_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  query          TEXT NOT NULL,
  pipeline       TEXT NOT NULL,
  answer_length  INTEGER,
  source_count   INTEGER,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cache_pipeline ON research_cache(pipeline);
CREATE INDEX IF NOT EXISTS idx_cache_created  ON research_cache(created_at);
CREATE INDEX IF NOT EXISTS idx_log_pipeline   ON research_log(pipeline);
