import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductImages } from "@/services/productImages";

export const productImageKeys = {
  byProduct: (productId: string) => ["product-images", productId] as const,
};

export function useProductImages(productId: string | null) {
  return useQuery({
    queryKey: productImageKeys.byProduct(productId!),
    queryFn: () => getProductImages(productId!),
    enabled: !!productId,
  });
}

export function useInvalidateProductImages() {
  const qc = useQueryClient();
  return (productId: string) =>
    qc.invalidateQueries({ queryKey: productImageKeys.byProduct(productId) });
}
