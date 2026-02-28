import { useQuery } from "@tanstack/react-query";
import { getActiveProducts, getAllProducts, getProductBySlug } from "@/services/products";

export const productKeys = {
  all: ["products"] as const,
  active: ["products", "active"] as const,
  bySlug: (slug: string) => ["products", "slug", slug] as const,
};

export function useActiveProducts() {
  return useQuery({
    queryKey: productKeys.active,
    queryFn: getActiveProducts,
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getAllProducts,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: productKeys.bySlug(slug!),
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });
}
