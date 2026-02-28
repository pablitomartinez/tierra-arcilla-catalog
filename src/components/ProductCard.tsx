import { Link } from "react-router-dom";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/productos/${product.slug}`}
      className="group block overflow-hidden rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category?.name ?? "Sin categoría"}
        </span>
        <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
          {product.title}
        </h3>
        <p className="text-primary font-semibold text-base">
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>
    </Link>
  );
}
