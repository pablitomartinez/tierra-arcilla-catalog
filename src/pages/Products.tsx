import { useState, useEffect } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getActiveProducts } from "@/services/products";
import { Product, ProductCategory } from "@/types/product";

const Products = () => {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getActiveProducts().then(setProducts).catch(() => {});
  }, []);

  const filtered = category === "all" ? products : products.filter((p) => p.category === category);

  return (
    <PublicLayout>
      <section className="container py-10 md:py-16">
        <div className="mb-8 space-y-3">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Catálogo</h1>
          <p className="text-muted-foreground">Explorá nuestra colección de cerámica artesanal.</p>
        </div>
        <div className="mb-8">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
};

export default Products;
