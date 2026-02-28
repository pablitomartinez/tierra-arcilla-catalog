export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  image: string;
  active: boolean;
  createdAt: string;
}
