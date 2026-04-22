/**
 * IndexNow ping — notifies Bing, Yandex, Seznam, Naver that content has changed.
 *
 * Protocol: https://www.indexnow.org/documentation
 * Key must be served from the root of the site at /{KEY}.txt — see public/.
 *
 * Usage:
 *   npx tsx scripts/ping-indexnow.ts                # pings every URL in sitemap.xml
 *   npx tsx scripts/ping-indexnow.ts <url> [...url] # pings the specified URLs
 */

const HOST = "burnwiki.com";
const KEY = "1138cb77c45ea381d49c650c8aabf2f8";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

async function fetchUrlsFromSitemap(): Promise<string[]> {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
  return urls;
}

async function ping(urls: string[]): Promise<void> {
  if (urls.length === 0) {
    console.error("No URLs to ping.");
    process.exit(1);
  }
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  console.log(`IndexNow ${res.status} ${res.statusText}`);
  console.log(`  host: ${HOST}`);
  console.log(`  key:  ${KEY}`);
  console.log(`  urls: ${urls.length}`);
  urls.slice(0, 5).forEach((u) => console.log(`        ${u}`));
  if (urls.length > 5) console.log(`        …and ${urls.length - 5} more`);
  if (text) console.log(`  body: ${text}`);
  if (!res.ok && res.status !== 202) process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const urls = args.length > 0 ? args : await fetchUrlsFromSitemap();
  await ping(urls);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
