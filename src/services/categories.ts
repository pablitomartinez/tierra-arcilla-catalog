import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/product";

interface DbCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

function mapDbCategory(row: DbCategory): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data as DbCategory[]).map(mapDbCategory);
}

export async function createCategory(category: { name: string; slug: string }): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();
  if (error) throw error;
  return mapDbCategory(data as DbCategory);
}

export async function updateCategory(id: string, updates: Partial<{ name: string; slug: string }>): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapDbCategory(data as DbCategory);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  return true;
}
