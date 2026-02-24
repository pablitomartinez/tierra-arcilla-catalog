export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  active: boolean;
  createdAt: string;
}

export type ProductCategory = "bowls" | "vases" | "plates" | "mugs" | "planters" | "trays";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  bowls: "Bowls",
  vases: "Jarrones",
  plates: "Platos",
  mugs: "Tazas",
  planters: "Macetas",
  trays: "Bandejas",
};
