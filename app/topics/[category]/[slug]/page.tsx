import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopic, getAllTopicSlugs, getRelatedTopics, getCategory } from "@/lib/content";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import TableOfContents from "@/components/TableOfContents";
import EvBadge from "@/components/EvBadge";
import RelatedTopics from "@/components/RelatedTopics";
import KeyPointsCallout from "@/components/KeyPointsCallout";
import type { Metadata } from "next";
import type { Topic } from "@/lib/types";

export const revalidate = 3600;

const SITE_URL = "https://burnwiki.com";

export async function generateStaticParams() {
  const slugs = await getAllTopicSlugs();
  return slugs;
}

type Props = { params: Promise<{ category: string; slug: string }> };

function topicUrl(topic: Topic): string {
  return `${SITE_URL}/topics/${topic.category}/${topic.canonical_id}`;
}

function topicDescription(topic: Topic): string {
  return topic.summary || `${topic.title} — Burn Wiki clinical reference.`;
}

function extractPmids(markdown: string): string[] {
  const seen = new Set<string>();
  const re = /PMID:\s*(\d+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    seen.add(match[1]);
  }
  return Array.from(seen);
}

function buildJsonLd(topic: Topic): Record<string, unknown> {
  const url = topicUrl(topic);
  const description = topicDescription(topic);
  const pmids = extractPmids(topic.body_markdown);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": url,
    url,
    name: topic.title,
    headline: topic.title,
    description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    datePublished: topic.created_at,
    dateModified: topic.updated_at,
    author: {
      "@type": "Organization",
      name: "Burn Wiki Editorial",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Burn Wiki",
      url: SITE_URL,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Burn Wiki",
      url: SITE_URL,
    },
    about: {
      "@type": "MedicalCondition",
      name: topic.title,
    },
    citation: pmids.map((pmid) => ({
      "@type": "ScholarlyArticle",
      identifier: `PMID:${pmid}`,
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) return {};
  const description = topicDescription(topic);
  const url = topicUrl(topic);
  return {
    title: topic.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: topic.title,
      description,
      url,
      siteName: "Burn Wiki",
      locale: "en_US",
      publishedTime: topic.created_at,
      modifiedTime: topic.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description,
    },
  };
}

function countRefs(markdown: string): number {
  return extractPmids(markdown).length;
}

function estimateReadTime(markdown: string): number {
  const words = markdown.split(/\s+/).length;
  return Math.max(1, Math.round(words / 225));
}

export default async function TopicPage({ params }: Props) {
  const { category: categoryId, slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();

  const category = await getCategory(categoryId);
  const relatedTopics = await getRelatedTopics(topic.related_topics || []);
  const headings = extractHeadings(topic.body_markdown);

  const keyPointsMatch = topic.body_markdown.match(
    /## Key Points\s*\n([\s\S]*?)(?=\n## |\n*$)/
  );
  const keyPointsMarkdown = keyPointsMatch ? keyPointsMatch[1] : null;

  let mainMarkdown = topic.body_markdown;
  if (keyPointsMatch) {
    mainMarkdown = mainMarkdown.replace(
      /## Key Points\s*\n[\s\S]*?(?=\n## |\n*$)/,
      ""
    );
  }

  const bodyHtml = await renderMarkdown(mainMarkdown);
  const keyPointsHtml = keyPointsMarkdown
    ? await renderMarkdown(keyPointsMarkdown)
    : null;

  const htmlWithIds = bodyHtml.replace(
    /<h([23])>(.*?)<\/h[23]>/g,
    (_match, level: string, text: string) => {
      const id = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );

  const jsonLd = buildJsonLd(topic);
  const refCount = countRefs(topic.body_markdown);
  const readMin = estimateReadTime(topic.body_markdown);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
        <Link href="/" className="hover:text-codex-ink">
          Index
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/topics/${categoryId}`}
          className="capitalize hover:text-codex-ink"
        >
          {category?.name || categoryId.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-codex-ink2">{topic.title}</span>
      </nav>

      {/* Three-column layout: left TOC · center article · right see-also */}
      <div className="mt-6 grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)_240px]">
        {/* LEFT — TOC */}
        <div className="order-2 lg:order-1">
          <TableOfContents headings={headings} />
        </div>

        {/* CENTER — article */}
        <article className="order-1 min-w-0 lg:order-2">
          <h1 className="font-serif text-4xl font-medium leading-[1.04] tracking-[-0.02em] text-codex-ink sm:text-[44px]">
            {topic.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-codex-rule pb-4">
            {topic.evidence_level && <EvBadge level={topic.evidence_level} />}
            {topic.evidence_level && (
              <span className="hidden sm:inline-flex">
                <EvBadge level={topic.evidence_level} mode="bar" />
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-wider text-codex-muted">
              {refCount > 0 && `${refCount} ref${refCount === 1 ? "" : "s"} · `}
              {readMin} min read
              {topic.last_updated && (
                <span className="hidden sm:inline">
                  {` · rev ${topic.last_updated}`}
                </span>
              )}
            </span>
          </div>

          {keyPointsHtml && <KeyPointsCallout html={keyPointsHtml} />}

          <div
            className="topic-content mt-6"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />
        </article>

        {/* RIGHT — see also */}
        <aside className="order-3 lg:order-3">
          <div className="lg:sticky lg:top-6">
            <RelatedTopics topics={relatedTopics} />
          </div>
        </aside>
      </div>
    </div>
  );
}
