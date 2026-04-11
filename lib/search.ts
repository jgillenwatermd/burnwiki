import { supabase } from "./supabase";
import type { SearchResult } from "./types";

export async function searchTopics(
  query: string
): Promise<{ results: SearchResult[]; error: boolean }> {
  if (!query.trim()) {
    return { results: [], error: false };
  }

  try {
    const { data, error } = await supabase.rpc("search_topics", {
      query: query.trim(),
    });

    if (error) {
      console.error("Search error:", error);
      return { results: [], error: true };
    }

    return { results: data || [], error: false };
  } catch {
    console.error("Search failed");
    return { results: [], error: true };
  }
}
