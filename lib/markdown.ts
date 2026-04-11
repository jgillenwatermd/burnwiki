import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkHtml, { sanitize: false });

export async function renderMarkdown(markdown: string): Promise<string> {
  // Split at ## References to apply different transforms above and below
  const refSplit = markdown.split(/^(## References)/m);
  let bodyMd: string;
  let refsMd: string | null;

  if (refSplit.length >= 3) {
    bodyMd = refSplit[0];
    refsMd = refSplit.slice(1).join("");
  } else {
    bodyMd = markdown;
    refsMd = null;
  }

  // Render body markdown to HTML
  let bodyHtml = String(await processor.process(bodyMd));

  // Transform inline citations [1], [2,3], [1-4] into superscript links (body only)
  bodyHtml = bodyHtml.replace(/\[(\d+(?:[,-]\d+)*)\]/g, (_match, inner: string) => {
    const parts = inner.split(",").flatMap((part: string) => {
      part = part.trim();
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        const range: number[] = [];
        for (let i = start; i <= end; i++) range.push(i);
        return range;
      }
      return [Number(part)];
    });

    const links = parts
      .map(
        (n: number) =>
          `<a href="#ref-${n}" class="citation-link" title="Reference ${n}">${n}</a>`
      )
      .join(",");

    return `<sup class="citation">[${links}]</sup>`;
  });

  // Transform [VERIFY] tags into callout badges (body only)
  bodyHtml = bodyHtml.replace(
    /\[VERIFY\]/g,
    '<span class="verify-badge">VERIFY</span>'
  );

  if (!refsMd) return bodyHtml;

  // Render references markdown to HTML
  let refsHtml = String(await processor.process(refsMd));

  // Add anchor IDs to reference list items: [1], [2], etc. at the start of a paragraph
  refsHtml = refsHtml.replace(
    /<p>\[(\d+)\]\s/g,
    '<p id="ref-$1" class="reference-item"><span class="ref-number">[$1]</span> '
  );

  // Transform PMID references into PubMed links (references only)
  refsHtml = refsHtml.replace(
    /PMID:\s*(\d+)/g,
    '<a href="https://pubmed.ncbi.nlm.nih.gov/$1/" target="_blank" rel="noopener noreferrer" class="pmid-link">PMID: $1</a>'
  );

  return bodyHtml + refsHtml;
}

export function extractHeadings(
  markdown: string
): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ id, text, level });
    }
  }

  return headings;
}
