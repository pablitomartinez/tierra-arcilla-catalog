import { useState } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useActiveProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const { data: products = [], isLoading, isError } = useActiveProducts();

  const filtered = categoryId === "all" ? products : products.filter((p) => p.categoryId === categoryId);

  return (
    <PublicLayout>
      <section className="container py-10 md:py-16">
        <div className="mb-8 space-y-3">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Catálogo</h1>
          <p className="text-muted-foreground">Explorá nuestra colección de cerámica artesanal.</p>
        </div>
        <div className="mb-8">
          <CategoryFilter selected={categoryId} onChange={setCategoryId} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-destructive py-16">Error al cargar productos. Intentá de nuevo más tarde.</p>
        ) : filtered.length === 0 ? (
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
