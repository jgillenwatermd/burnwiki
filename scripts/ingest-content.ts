import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const CONTENT_ROOT =
  "/Users/jgillenwater/Library/Mobile Documents/com~apple~CloudDocs/BURN_ROOT/wiki/topics";

const dryRun = process.argv.includes("--dry-run");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!dryRun && (!supabaseUrl || !serviceRoleKey)) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

interface TopicFrontmatter {
  type?: string;
  canonical_id: string;
  title: string;
  summary?: string;
  category: string;
  status?: string;
  publication_status?: string;
  evidence_level?: string;
  target_roles?: string[];
  related_topics?: string[];
  parent_topic?: string | null;
  subtopics?: string[];
  keywords?: string[];
  aliases?: string[];
  sources?: unknown; // legacy int[] OR new EFP {pmid, published}[]
  last_updated?: string | Date;
  [key: string]: unknown; // Allow extra fields
}

// EFP v2.1+ pages emit `sources` as [{pmid: "12345", published: 2024}, ...].
// Older legacy pages emit `sources` as [12345, 67890, ...] (int[]).
// Supabase column is int[]; coerce both shapes to int[] of PMIDs.
function normalizeSources(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  const out: number[] = [];
  for (const item of raw) {
    let pmid: number | null = null;
    if (typeof item === "number") {
      pmid = item;
    } else if (typeof item === "string") {
      const parsed = parseInt(item, 10);
      pmid = Number.isFinite(parsed) ? parsed : null;
    } else if (item && typeof item === "object" && "pmid" in item) {
      const v = (item as { pmid: unknown }).pmid;
      if (typeof v === "number") pmid = v;
      else if (typeof v === "string") {
        const parsed = parseInt(v, 10);
        pmid = Number.isFinite(parsed) ? parsed : null;
      }
    }
    if (pmid !== null && Number.isFinite(pmid)) out.push(pmid);
  }
  return out;
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

function parseCategories(): CategoryInfo[] {
  const categories: CategoryInfo[] = [];
  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });

  // Try to read root index.md for sort order
  let sortMap: Record<string, number> = {};
  const rootIndex = path.join(CONTENT_ROOT, "index.md");
  if (fs.existsSync(rootIndex)) {
    const content = fs.readFileSync(rootIndex, "utf-8");
    const lines = content.split("\n");
    let order = 0;
    for (const line of lines) {
      const match = line.match(/\[([^\]]+)\]\(([^)]+)\/?/);
      if (match) {
        const dirName = match[2].replace(/\/$/, "");
        sortMap[dirName] = order++;
      }
    }
  }

  let sortCounter = Object.keys(sortMap).length;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const categoryId = entry.name;
    const indexPath = path.join(CONTENT_ROOT, categoryId, "index.md");

    let name = categoryId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    let description: string | null = null;

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, "utf-8");
      const lines = content
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("# ")) {
          name = line.replace(/^#\s+/, "").trim();
        } else if (!line.startsWith("#") && !line.startsWith("|") && !line.startsWith("---")) {
          if (!description) {
            description = line;
          }
        }
      }
    }

    categories.push({
      id: categoryId,
      name,
      description,
      sort_order: sortMap[categoryId] ?? sortCounter++,
    });
  }

  return categories.sort((a, b) => a.sort_order - b.sort_order);
}

function parseTopics(): {
  topics: {
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
  }[];
  errors: string[];
} {
  const topics: ReturnType<typeof parseTopics>["topics"] = [];
  const errors: string[] = [];

  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const categoryDir = path.join(CONTENT_ROOT, entry.name);
    const files = fs.readdirSync(categoryDir).filter(
      (f) => f.endsWith(".md") && f !== "index.md"
    );

    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        const fm = data as TopicFrontmatter;

        // Publication boundary: only ingest pages EIC has signed off as published.
        // Per wiki/.claude/CLAUDE.md DD-56/Fix-4: passing G-8 produces internal
        // canon at wiki/topics/...; EIC sets publication_status: published in
        // frontmatter to promote to burnwiki.com. Skip non-published silently —
        // skeleton/draft files are expected and not an error.
        if (fm.publication_status !== "published") {
          continue;
        }

        if (!fm.canonical_id || !fm.title) {
          errors.push(`${filePath}: published page missing canonical_id or title, skipping`);
          continue;
        }

        topics.push({
          canonical_id: fm.canonical_id,
          title: fm.title,
          summary: fm.summary || null,
          category: fm.category || entry.name,
          status: fm.status || "draft",
          evidence_level: fm.evidence_level || null,
          target_roles: fm.target_roles || [],
          related_topics: fm.related_topics || [],
          parent_topic: fm.parent_topic || null,
          subtopics: fm.subtopics || [],
          keywords: fm.keywords || [],
          aliases: fm.aliases || [],
          sources: normalizeSources(fm.sources),
          last_updated: fm.last_updated
            ? fm.last_updated instanceof Date
              ? fm.last_updated.toISOString().split("T")[0]
              : String(fm.last_updated).split("T")[0]
            : null,
          body_markdown: content.trim(),
        });
      } catch (err) {
        errors.push(
          `${filePath}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  }

  return { topics, errors };
}

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== INGESTING CONTENT ===");
  console.log(`Source: ${CONTENT_ROOT}\n`);

  // Parse categories
  const categories = parseCategories();
  console.log(`Found ${categories.length} categories:`);
  for (const cat of categories) {
    console.log(`  ${cat.id}: ${cat.name} — ${cat.description || "(no description)"}`);
  }

  // Parse topics
  const { topics, errors } = parseTopics();
  console.log(`\nFound ${topics.length} topics`);

  if (errors.length > 0) {
    console.log(`\n${errors.length} error(s):`);
    for (const err of errors) {
      console.log(`  WARNING: ${err}`);
    }
  }

  if (dryRun) {
    console.log("\nTopics that would be upserted:");
    for (const t of topics) {
      console.log(
        `  [${t.category}] ${t.canonical_id}: ${t.title} (${t.body_markdown.length} chars, ${t.sources.length} refs)`
      );
    }
    console.log("\nDry run complete. No data written.");
    return;
  }

  // Upsert categories
  console.log("\nUpserting categories...");
  const { error: catError } = await supabase!
    .from("categories")
    .upsert(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        sort_order: c.sort_order,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "id" }
    );

  if (catError) {
    console.error("Category upsert failed:", catError);
    process.exit(1);
  }
  console.log(`  ${categories.length} categories upserted`);

  // Upsert topics
  console.log("\nUpserting topics...");
  let upserted = 0;
  let failed = 0;

  for (const topic of topics) {
    const { error } = await supabase!.from("topics").upsert(
      {
        canonical_id: topic.canonical_id,
        title: topic.title,
        summary: topic.summary,
        category: topic.category,
        status: topic.status,
        evidence_level: topic.evidence_level,
        target_roles: topic.target_roles,
        related_topics: topic.related_topics,
        parent_topic: topic.parent_topic,
        subtopics: topic.subtopics,
        keywords: topic.keywords,
        aliases: topic.aliases,
        sources: topic.sources,
        last_updated: topic.last_updated,
        body_markdown: topic.body_markdown,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "canonical_id" }
    );

    if (error) {
      console.error(`  FAILED: ${topic.canonical_id}: ${error.message}`);
      failed++;
    } else {
      upserted++;
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Categories: ${categories.length} upserted`);
  console.log(`Topics: ${upserted} upserted, ${failed} failed`);
  if (errors.length > 0) {
    console.log(`Parse warnings: ${errors.length}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
