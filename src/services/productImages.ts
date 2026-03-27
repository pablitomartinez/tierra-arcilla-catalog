import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/types/productImage";

interface DbProductImage {
  id: string;
  product_id: string;
  url: string;
  position: number;
  created_at: string;
}

function mapRow(row: DbProductImage): ProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    url: row.url,
    position: row.position,
    createdAt: row.created_at,
  };
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data as DbProductImage[]).map(mapRow);
}

export async function uploadProductImage(
  productId: string,
  file: File,
  position: number,
): Promise<ProductImage> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("products").getPublicUrl(path);

  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, url: urlData.publicUrl, position })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as DbProductImage);
}

export async function deleteProductImage(image: ProductImage): Promise<void> {
  // Extract storage path from URL
  const url = new URL(image.url);
  const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/products\/(.+)/);
  if (pathMatch) {
    await supabase.storage.from("products").remove([pathMatch[1]]);
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", image.id);
  if (error) throw error;
}

export async function updateImagePositions(
  images: { id: string; position: number }[],
): Promise<void> {
  // Update each image's position
  const promises = images.map(({ id, position }) =>
    supabase.from("product_images").update({ position }).eq("id", id),
  );
  const results = await Promise.all(promises);
  const err = results.find((r) => r.error);
  if (err?.error) throw err.error;
}
