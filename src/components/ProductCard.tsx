import { Link } from "react-router-dom";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/productos/${product.slug}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-shadow duration-300 hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-1.5 p-3 md:p-4">
        <span className="block truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
          {product.category?.name ?? "Sin categoría"}
        </span>
        <h3 className="line-clamp-2 font-heading text-base font-semibold leading-tight text-foreground md:text-lg">
          {product.title}
        </h3>
        <p className="text-sm font-semibold text-primary md:text-base">
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>
    </Link>
  );
}
