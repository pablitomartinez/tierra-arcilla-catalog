import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categories";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategories,
  });
}
