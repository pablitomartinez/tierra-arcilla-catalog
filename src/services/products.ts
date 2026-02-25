import { supabase } from "@/integrations/supabase/client";
import { Product, ProductCategory } from "@/types/product";

interface DbProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

function mapDbProduct(row: DbProduct): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    category: row.category as ProductCategory,
    image: row.image,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function getActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDbProduct(data as DbProduct) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDbProduct(data as DbProduct) : null;
}

export async function createProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      active: product.active,
    })
    .select()
    .single();
  if (error) throw error;
  return mapDbProduct(data as DbProduct);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.active !== undefined) dbUpdates.active = updates.active;

  const { data, error } = await supabase
    .from("products")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapDbProduct(data as DbProduct);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function toggleProductActive(id: string): Promise<Product> {
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");
  return updateProduct(id, { active: !product.active });
}
