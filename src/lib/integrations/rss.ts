// Parser de RSS/Atom minimalista, sem dependências externas.
// Extrai title, link, description/summary e data de publicação de cada item.

import { fetchText } from "./http";
import type { RawUpdateInput } from "./types";

export interface RssItem {
  title: string;
  link: string;
  description: string | null;
  publishedAt: string | null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "") // remove tags HTML residuais
    .trim();
}

function pick(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : null;
}

// Link pode vir como <link>url</link> (RSS) ou <link href="url"/> (Atom).
function pickLink(block: string): string | null {
  const rss = pick(block, "link");
  if (rss) return rss;
  const atom = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>(?:<\/link>)?/i);
  return atom ? atom[1] : null;
}

function toISO(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function parseRss(xml: string): RssItem[] {
  // Aceita <item> (RSS) e <entry> (Atom).
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  return blocks
    .map((block) => {
      const title = pick(block, "title");
      const link = pickLink(block);
      if (!title || !link) return null;
      const description = pick(block, "description") ?? pick(block, "summary");
      const date =
        pick(block, "pubDate") ??
        pick(block, "updated") ??
        pick(block, "published") ??
        pick(block, "dc:date");
      return {
        title,
        link,
        description: description ?? null,
        publishedAt: toISO(date),
      } satisfies RssItem;
    })
    .filter((x): x is RssItem => x !== null);
}

// Busca um feed e converte em RawUpdateInput[]. Filtra por recência se pedido.
export async function fetchRssAsRawUpdates(params: {
  url: string;
  sourceName: string;
  sourceType: string;
  limit: number;
  sinceDays?: number;
}): Promise<RawUpdateInput[]> {
  const xml = await fetchText(params.url);
  if (!xml) return [];

  const cutoff = params.sinceDays
    ? Date.now() - params.sinceDays * 24 * 60 * 60 * 1000
    : null;

  return parseRss(xml)
    .filter((item) => {
      if (!cutoff || !item.publishedAt) return true;
      return new Date(item.publishedAt).getTime() >= cutoff;
    })
    .slice(0, params.limit)
    .map((item) => ({
      title: item.title,
      source_name: params.sourceName,
      source_url: item.link,
      source_type: params.sourceType,
      published_at: item.publishedAt,
      raw_summary: item.description
        ? item.description.slice(0, 400)
        : null,
      raw_payload: { via: "rss", feed: params.url },
    }));
}
