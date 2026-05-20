// import { useState } from "react";
// import { PublicLayout } from "@/layouts/PublicLayout";
// import { ProductCard } from "@/components/ProductCard";
// import { CategoryFilter } from "@/components/CategoryFilter";
// import { useActiveProducts } from "@/hooks/useProducts";
// import { Skeleton } from "@/components/ui/skeleton";

// const Products = () => {
//   const [categoryId, setCategoryId] = useState<string | "all">("all");
//   const { data: products = [], isLoading, isError } = useActiveProducts();

//   const filtered = categoryId === "all" ? products : products.filter((p) => p.categoryId === categoryId);

//   return (
//     <PublicLayout>
//       <section className="container py-8 md:py-14">
//         <div className="mb-6 space-y-2 md:mb-8">
//           <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Catálogo</h1>
//           <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
//             Explorá nuestra colección de cerámica artesanal.
//           </p>
//         </div>
//         <div className="mb-6 md:mb-8">
//           <CategoryFilter selected={categoryId} onChange={setCategoryId} />
//         </div>

//         {isLoading ? (
//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="space-y-3">
//                 <Skeleton className="aspect-square w-full rounded-lg" />
//                 <Skeleton className="h-4 w-1/3" />
//                 <Skeleton className="h-5 w-2/3" />
//                 <Skeleton className="h-4 w-1/4" />
//               </div>
//             ))}
//           </div>
//         ) : isError ? (
//           <p className="py-16 text-center text-destructive">Error al cargar productos. Intentá de nuevo más tarde.</p>
//         ) : filtered.length === 0 ? (
//           <p className="py-16 text-center text-muted-foreground">No hay productos en esta categoría.</p>
//         ) : (
//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
//             {filtered.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}
//       </section>
//     </PublicLayout>
//   );
// };

// export default Products;

// src/pages/Products.tsx

import { useState } from "react";

import { PublicLayout } from "@/layouts/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";

import { useActiveProducts } from "@/hooks/useProducts";

import { Skeleton } from "@/components/ui/skeleton";

import { ui } from "@/lib/ui";

const Products = () => {
  const [categoryId, setCategoryId] = useState<string | "all">("all");

  const {
    data: products = [],
    isLoading,
    isError,
  } = useActiveProducts();

  const filtered =
    categoryId === "all"
      ? products
      : products.filter((p) => p.categoryId === categoryId);

  return (
    <PublicLayout>
      <section className={`${ui.container} ${ui.section.md}`}>
        <div className="mb-6 space-y-2 md:mb-8">
          <h1
            className={`
              ${ui.typography.sectionTitle}
              font-heading
              font-bold
              text-foreground
            `}
          >
            Catálogo
          </h1>

          <p
            className={`
              ${ui.typography.body}
              max-w-2xl
              text-muted-foreground
            `}
          >
            Explorá nuestra colección de cerámica artesanal.
          </p>
        </div>

        <div className="mb-6 md:mb-8">
          <CategoryFilter
            selected={categoryId}
            onChange={setCategoryId}
          />
        </div>

        {isLoading ? (
          <div
            className={`
              grid
              grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              ${ui.grid.default}
            `}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton
                  className={`
                    aspect-square
                    w-full
                    ${ui.radius.card}
                  `}
                />

                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="py-16 text-center text-destructive">
            Error al cargar productos. Intentá de nuevo más tarde.
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div
            className={`
              grid
              grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              ${ui.grid.default}
            `}
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
};

export default Products;