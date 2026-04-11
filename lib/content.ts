import { supabase } from "./supabase";
import type { Topic, Category } from "./types";

export async function getAllCategories(): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  // Get topic counts per category
  const { data: counts, error: countError } = await supabase
    .from("topics")
    .select("category");

  if (countError) throw countError;

  const countMap: Record<string, number> = {};
  for (const row of counts || []) {
    countMap[row.category] = (countMap[row.category] || 0) + 1;
  }

  return (categories || []).map((cat) => ({
    ...cat,
    topic_count: countMap[cat.id] || 0,
  }));
}

export async function getCategory(categoryId: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();

  if (error) return null;
  return data;
}

export async function getTopicsByCategory(categoryId: string): Promise<Topic[]> {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("category", categoryId)
    .order("title", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getTopic(canonicalId: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("canonical_id", canonicalId)
    .single();

  if (error) return null;
  return data;
}

export async function getAllTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("title", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAllTopicSlugs(): Promise<
  { category: string; slug: string }[]
> {
  const { data, error } = await supabase
    .from("topics")
    .select("canonical_id, category");

  if (error) throw error;
  return (data || []).map((t) => ({
    category: t.category,
    slug: t.canonical_id,
  }));
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("categories").select("id");

  if (error) throw error;
  return (data || []).map((c) => c.id);
}

export async function getRelatedTopics(
  canonicalIds: string[]
): Promise<Pick<Topic, "canonical_id" | "title" | "category">[]> {
  if (canonicalIds.length === 0) return [];

  const { data, error } = await supabase
    .from("topics")
    .select("canonical_id, title, category")
    .in("canonical_id", canonicalIds);

  if (error) throw error;
  return data || [];
}
