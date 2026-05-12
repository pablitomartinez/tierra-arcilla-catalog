import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductGallery } from "@/components/store/product/ProductGallery";
import { useProductImages } from "@/hooks/useProductImages";
import { useProductBySlug } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { data: productImages = [] } = useProductImages(product?.id ?? null);

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Tierra Arcilla`;
    }
    return () => {
      document.title = "Tierra Arcilla - Cerámica Artesanal";
    };
  }, [product]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8 md:py-16">
          <Skeleton className="mb-6 h-4 w-32" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !product) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <h1 className="mb-4 font-heading text-2xl font-bold text-foreground">Producto no encontrado</h1>
          <Link to="/productos" className="text-primary hover:underline">
            ← Volver al catálogo
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="container py-6 md:py-12 lg:py-16">
        <Link to="/productos" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14">
          <ProductGallery coverImage={product.image} productTitle={product.title} images={productImages} />

          <div className="space-y-6 lg:sticky lg:top-36 lg:self-start">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {product.category?.name ?? "Sin categoría"}
              </span>
              <div className="space-y-3">
                <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">{product.title}</h1>
                <p className="text-2xl font-semibold text-primary">${product.price.toLocaleString("es-AR")}</p>
              </div>
              <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            <WhatsAppButton productName={product.title} className="w-full" />

            <div className="grid gap-3 border-y py-5">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Pieza artesanal</p>
                  <p className="text-sm text-muted-foreground">Cada producto puede tener variaciones propias del trabajo manual.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Consulta de disponibilidad</p>
                  <p className="text-sm text-muted-foreground">Coordinamos stock, tiempos y entrega por WhatsApp.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Compra asistida</p>
                  <p className="text-sm text-muted-foreground">Te acompañamos antes de confirmar tu pedido.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
};

export default ProductDetail;
