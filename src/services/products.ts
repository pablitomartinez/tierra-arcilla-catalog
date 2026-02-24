import { Product } from "@/types/product";

import bowlImg from "@/assets/products/bowl-terracotta.jpg";
import vaseImg from "@/assets/products/vase-cream.jpg";
import plateImg from "@/assets/products/plate-set.jpg";
import mugImg from "@/assets/products/mug-brown.jpg";
import planterImg from "@/assets/products/planter-sage.jpg";
import trayImg from "@/assets/products/tray-sand.jpg";

const STORAGE_KEY = "tierra-arcilla-products";

const defaultProducts: Product[] = [
  {
    id: "1",
    title: "Bowl Terracota Clásico",
    slug: "bowl-terracota-clasico",
    description: "Bowl artesanal de terracota, ideal para ensaladas y servir en la mesa. Acabado suave al tacto con esmalte natural.",
    price: 2800,
    category: "bowls",
    image: bowlImg,
    active: true,
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    title: "Jarrón Crema Orgánico",
    slug: "jarron-crema-organico",
    description: "Jarrón de formas orgánicas con esmalte crema mate. Perfecto como pieza decorativa o para flores secas.",
    price: 4500,
    category: "vases",
    image: vaseImg,
    active: true,
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    title: "Set de Platos Rústicos",
    slug: "set-platos-rusticos",
    description: "Set de 3 platos en gres con esmalte moteado y borde de terracota. Aptos para uso diario y lavavajillas.",
    price: 5200,
    category: "plates",
    image: plateImg,
    active: true,
    createdAt: "2025-02-01",
  },
  {
    id: "4",
    title: "Taza Drip Marrón",
    slug: "taza-drip-marron",
    description: "Taza con efecto drip en esmalte marrón sobre base clara. Capacidad 350ml, perfecta para café o té.",
    price: 1800,
    category: "mugs",
    image: mugImg,
    active: true,
    createdAt: "2025-02-05",
  },
  {
    id: "5",
    title: "Maceta Sage con Suculenta",
    slug: "maceta-sage-suculenta",
    description: "Maceta artesanal con esmalte verde salvia y base de terracota expuesta. Incluye suculenta de regalo.",
    price: 2200,
    category: "planters",
    image: planterImg,
    active: true,
    createdAt: "2025-02-10",
  },
  {
    id: "6",
    title: "Bandeja Ovalada Arena",
    slug: "bandeja-ovalada-arena",
    description: "Bandeja ovalada en tono arena con textura moteada. Ideal para servir aperitivos o como pieza decorativa.",
    price: 3400,
    category: "trays",
    image: trayImg,
    active: true,
    createdAt: "2025-02-15",
  },
];

function getStoredProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultProducts;
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Initialize storage
if (!localStorage.getItem(STORAGE_KEY)) {
  saveProducts(defaultProducts);
}

export function getAllProducts(): Product[] {
  return getStoredProducts();
}

export function getActiveProducts(): Product[] {
  return getStoredProducts().filter((p) => p.active);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getStoredProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getStoredProducts().find((p) => p.id === id);
}

export function createProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const products = getStoredProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function toggleProductActive(id: string): Product | undefined {
  const product = getProductById(id);
  if (!product) return undefined;
  return updateProduct(id, { active: !product.active });
}
