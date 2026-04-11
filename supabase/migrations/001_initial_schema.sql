-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,                    -- slug: "critical-care"
  name TEXT NOT NULL,                     -- display: "Critical Care"
  description TEXT,                       -- short description for category page
  sort_order INTEGER NOT NULL DEFAULT 0,  -- display order on homepage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_id TEXT UNIQUE NOT NULL,       -- URL slug, matches frontmatter
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL REFERENCES categories(id),
  status TEXT NOT NULL DEFAULT 'draft',    -- draft | reviewed | published
  evidence_level TEXT,                     -- high | moderate | low | very-low
  target_roles TEXT[] DEFAULT '{}',
  related_topics TEXT[] DEFAULT '{}',      -- array of canonical_ids
  keywords TEXT[] DEFAULT '{}',
  aliases TEXT[] DEFAULT '{}',
  sources INTEGER[] DEFAULT '{}',          -- PMIDs
  last_updated DATE,
  body_markdown TEXT NOT NULL,             -- full markdown body (below frontmatter)
  body_html TEXT,                          -- pre-rendered HTML (optional, can render client-side)
  search_vector TSVECTOR,                  -- full-text search index
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index: weighted by field importance
CREATE OR REPLACE FUNCTION topics_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.aliases, ' '), '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.keywords, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.summary, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.body_markdown, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER topics_search_vector_trigger
  BEFORE INSERT OR UPDATE ON topics
  FOR EACH ROW
  EXECUTE FUNCTION topics_search_vector_update();

-- GIN index for fast full-text search
CREATE INDEX topics_search_idx ON topics USING GIN (search_vector);

-- Index for category lookups
CREATE INDEX topics_category_idx ON topics (category);

-- Index for canonical_id lookups (already UNIQUE, but explicit)
CREATE INDEX topics_canonical_id_idx ON topics (canonical_id);

-- Search RPC function: returns ranked results
CREATE OR REPLACE FUNCTION search_topics(query TEXT)
RETURNS TABLE (
  canonical_id TEXT,
  title TEXT,
  summary TEXT,
  category TEXT,
  evidence_level TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.canonical_id,
    t.title,
    t.summary,
    t.category,
    t.evidence_level,
    ts_rank(t.search_vector, websearch_to_tsquery('english', query)) AS rank
  FROM topics t
  WHERE t.search_vector @@ websearch_to_tsquery('english', query)
  ORDER BY rank DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- RLS: public read access, no write access from client
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
