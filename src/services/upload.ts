import { supabase } from "@/integrations/supabase/client";

export async function uploadProductImage(file: File) {
    const filename = `${crypto.randomUUID()}-${file.name}`

    const { error } = await supabase.storage.from("products").upload(filename, file)
    if (error) throw error;

    const { data } = supabase.storage.from("products").getPublicUrl(filename)
    return data.publicUrl;
}