export interface Topic {
  id: string;
  canonical_id: string;
  title: string;
  summary: string | null;
  category: string;
  status: string;
  evidence_level: string | null;
  target_roles: string[];
  related_topics: string[];
  parent_topic: string | null;
  subtopics: string[];
  keywords: string[];
  aliases: string[];
  sources: number[];
  last_updated: string | null;
  body_markdown: string;
  body_html: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  topic_count?: number;
}

export interface SearchResult {
  canonical_id: string;
  title: string;
  summary: string | null;
  category: string;
  evidence_level: string | null;
  rank: number;
}
