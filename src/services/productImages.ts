import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/types/productImage";

interface DbProductImage {
  id: string;
  product_id: string;
  url: string;
  position: number;
  created_at: string;
}

interface ProductImageInsert {
  product_id: string;
  url: string;
  position: number;
}

interface UploadedProductImage {
  path: string;
  publicUrl: string;
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

export async function uploadImageToProductStorage(
  productId: string,
  file: File,
  index: number,
): Promise<UploadedProductImage> {
  const path = `products/${productId}/${index}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, file, {
      upsert: false,
      contentType: file.type || "image/jpeg",
    });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return {
    path,
    publicUrl: data.publicUrl,
  };
}

export async function removeImagesFromStorage(paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from("products").remove(paths);
  if (error) throw error;
}

export async function insertProductImages(images: ProductImageInsert[]): Promise<ProductImage[]> {
  if (images.length === 0) return [];

  const { data, error } = await supabase
    .from("product_images")
    .insert(images)
    .select("*");
  if (error) throw error;

  return (data as DbProductImage[]).map(mapRow);
}

export async function deleteProductImage(image: ProductImage): Promise<void> {
  const url = new URL(image.url);
  const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/products\/(.+)/);
  if (pathMatch) {
    await removeImagesFromStorage([pathMatch[1]]);
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
  const promises = images.map(({ id, position }) =>
    supabase.from("product_images").update({ position }).eq("id", id),
  );
  const results = await Promise.all(promises);
  const err = results.find((result) => result.error);
  if (err?.error) throw err.error;
}
