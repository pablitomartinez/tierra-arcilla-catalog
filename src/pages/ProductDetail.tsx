import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getProductBySlug } from "@/services/products";
import { CATEGORY_LABELS } from "@/types/product";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Tierra Arcilla`;
    }
    return () => {
      document.title = "Tierra Arcilla – Cerámica Artesanal";
    };
  }, [product]);

  if (!product) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
            Producto no encontrado
          </h1>
          <Link to="/productos" className="text-primary hover:underline">
            ← Volver al catálogo
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="container py-8 md:py-16">
        <Link
          to="/productos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[product.category]}
            </span>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {product.title}
            </h1>

            <p className="text-2xl font-semibold text-primary">
              ${product.price.toLocaleString("es-AR")}
            </p>

            <p className="text-muted-foreground leading-relaxed text-base">
              {product.description}
            </p>

            <WhatsAppButton productName={product.title} className="mt-4 w-full sm:w-auto" />
          </div>
        </div>
      </article>
    </PublicLayout>
  );
};

export default ProductDetail;
