// import { Link } from "react-router-dom";
// import { Product } from "@/types/product";

// interface ProductCardProps {
//   product: Product;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   return (
//     <Link
//       to={`/productos/${product.slug}`}
//       className="group block overflow-hidden rounded-lg border bg-card transition-shadow duration-300 hover:shadow-md"
//     >
//       <div className="aspect-square overflow-hidden bg-muted">
//         <img
//           src={product.image}
//           alt={product.title}
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           loading="lazy"
//         />
//       </div>
//       <div className="space-y-1.5 p-3 md:p-4">
//         <span className="block truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
//           {product.category?.name ?? "Sin categoría"}
//         </span>
//         <h3 className="line-clamp-2 font-heading text-base font-semibold leading-tight text-foreground md:text-lg">
//           {product.title}
//         </h3>
//         <p className="text-sm font-semibold text-primary md:text-base">
//           ${product.price.toLocaleString("es-AR")}
//         </p>
//       </div>
//     </Link>
//   );
// }
// src/components/ProductCard.tsx

import { Link } from "react-router-dom";

import { Product } from "@/types/product";

import { ui } from "@/lib/ui";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/productos/${product.slug}`}
      className={`
        group
        block
        overflow-hidden
        border
        bg-card
        ${ui.radius.card}
        ${ui.shadow.hover}
        ${ui.transition.default}
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />
      </div>

      <div className="space-y-2 p-3 md:p-4">
        <span
          className="
            block truncate
            text-[11px] font-medium uppercase tracking-[0.18em]
            text-muted-foreground
            md:text-xs
          "
        >
          {product.category?.name ?? "Sin categoría"}
        </span>

        <h3
          className={`
            ${ui.typography.cardTitle}
            line-clamp-2
            font-heading
            font-semibold
            text-foreground
          `}
        >
          {product.title}
        </h3>

        <p
          className="
            text-sm font-semibold
            text-primary
            md:text-base
          "
        >
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>
    </Link>
  );
}