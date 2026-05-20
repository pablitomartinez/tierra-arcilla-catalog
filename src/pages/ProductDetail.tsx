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
          <h1 className="mb-4 font-heading text-2xl font-bold text-foreground">
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
      {/* Añadido pt-4 en móvil para evitar que la navbar tape el botón de regreso */}
      <article className="container pt-4 pb-12 md:py-12 lg:py-16">
        <Link
          to="/productos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        {/* Ajuste de columnas equilibrado 50/50 en pantallas grandes */}
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Columna de la Galería */}
          <div className="w-full">
            <ProductGallery
              coverImage={product.image}
              productTitle={product.title}
              images={productImages}
            />
          </div>

          {/* Columna de la Información - lg:top-24 calibra la distancia con tu Navbar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                {product.category?.name ?? "Sin categoría"}
              </span>
              
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
                  {product.title}
                </h1>
                <p className="text-2xl font-medium tracking-tight text-amber-800">
                  ${product.price.toLocaleString("es-AR")}
                </p>
              </div>
              
              <p className="text-base leading-relaxed text-muted-foreground pt-2">
                {product.description}
              </p>
            </div>

            <div className="pt-2">
              <WhatsAppButton productName={product.title} className="w-full" />
            </div>

            {/* Listado de características de confianza */}
            <div className="grid gap-4 border-y border-border/60 py-6 my-2">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Pieza artesanal</p>
                  <p className="text-sm text-muted-foreground">
                    Cada producto puede tener variaciones propias del trabajo manual.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Consulta de disponibilidad</p>
                  <p className="text-sm text-muted-foreground">
                    Coordinamos stock, tiempos y entrega por WhatsApp.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Compra asistida</p>
                  <p className="text-sm text-muted-foreground">
                    Te acompañamos antes de confirmar tu pedido.
                  </p>
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