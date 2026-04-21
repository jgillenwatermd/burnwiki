import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopic, getAllTopicSlugs, getRelatedTopics, getCategory } from "@/lib/content";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import TableOfContents from "@/components/TableOfContents";
import EvidenceBadge from "@/components/EvidenceBadge";
import RelatedTopics from "@/components/RelatedTopics";
import KeyPointsCallout from "@/components/KeyPointsCallout";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllTopicSlugs();
  return slugs;
}

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.summary || `${topic.title} — Burn Wiki clinical reference.`,
  };
}

export default async function TopicPage({ params }: Props) {
  const { category: categoryId, slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();

  const category = await getCategory(categoryId);
  const relatedTopics = await getRelatedTopics(topic.related_topics || []);
  const headings = extractHeadings(topic.body_markdown);

  // Split body into main content and key points
  const keyPointsMatch = topic.body_markdown.match(
    /## Key Points\s*\n([\s\S]*?)(?=\n## |\n*$)/
  );
  const keyPointsMarkdown = keyPointsMatch ? keyPointsMatch[1] : null;

  // Remove key points from the main body for separate rendering
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

  // Add heading IDs to rendered HTML
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="text-[#0645ad] hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/topics/${categoryId}`}
          className="capitalize text-[#0645ad] hover:underline"
        >
          {category?.name || categoryId.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <span>{topic.title}</span>
      </nav>

      {/* Title + metadata */}
      <h1 className="text-3xl font-bold text-[#1a1a2e]">{topic.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        {topic.evidence_level && (
          <EvidenceBadge level={topic.evidence_level} />
        )}
        {topic.last_updated && (
          <span className="text-gray-400">
            Updated {topic.last_updated}
          </span>
        )}
      </div>

      {/* Mobile TOC */}
      <div className="mt-6 lg:hidden">
        <TableOfContents headings={headings} />
      </div>

      {/* Content + sidebar grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_220px]">
        <div>
          {/* Key points callout */}
          {keyPointsHtml && <KeyPointsCallout html={keyPointsHtml} />}

          {/* Body */}
          <div
            className="topic-content"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <TableOfContents headings={headings} />
            <RelatedTopics topics={relatedTopics} />
          </div>
        </div>
      </div>

      {/* Mobile related topics */}
      <div className="mt-8 lg:hidden">
        <RelatedTopics topics={relatedTopics} />
      </div>
    </div>
  );
}
