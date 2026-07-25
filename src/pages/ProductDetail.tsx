import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, PackageCheck, ShieldCheck, Sparkles, Share2, Copy, Check, AlertCircle } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductGallery } from "@/components/store/product/ProductGallery";
import { useProductImages } from "@/hooks/useProductImages";
import { useProductBySlug } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { handleShareProduct, formatProductShareText } from "@/utils/shareProduct";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  // 1. Obtención de datos con React Query
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  
  // 2. Solo solicitamos las imágenes si el producto existe y tiene un ID válido
  const { data: productImages = [] } = useProductImages(product?.id ?? null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      document.title = "Tierra Arcilla - Cerámica Artesanal";
    };
  }, []);

  // 3. Estado de Carga (Skeleton)
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

  // 4. Si hay error o el producto no existe (ej. /productos/test-1 si no fue creado en Supabase)
  if (isError || !product) {
    return (
      <PublicLayout>
        <Helmet>
          <title>Producto no encontrado | Tierra Arcilla</title>
        </Helmet>
        <div className="container py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-full mb-6 ring-8 ring-amber-50/50">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-3 font-heading text-3xl font-bold text-foreground">
            No encontramos este producto
          </h1>
          <p className="text-muted-foreground max-w-md mb-8 text-base">
            Es posible que el enlace esté roto, que el producto haya sido eliminado o que aún no exista en la base de datos.
          </p>
          <Button asChild className="gap-2 rounded-xl px-6 py-6 font-semibold shadow-md">
            <Link to="/productos">
              <ArrowLeft className="h-4 w-4" />
              Explorar el catálogo completo
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const shareData = {
    id: product.id,
    title: product.title,
    description: product.description || "",
    price: product.price,
    imageUrl: product.image || (productImages.length > 0 ? productImages[0]?.url : undefined)
  };

  const handleCopyText = () => {
    const text = formatProductShareText(shareData);
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("¡Información del producto copiada al portapapeles!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>{`${product.title} | Tierra Arcilla`}</title>
        <meta name="description" content={product.description || `Pieza artesanal exclusiva de Tierra Arcilla. Precio: $${product.price}`} />
        <meta property="og:title" content={`${product.title} | Tierra Arcilla`} />
        <meta property="og:description" content={product.description || "Pieza de cerámica artesanal modelada a mano."} />
        <meta property="og:image" content={shareData.imageUrl || "/placeholder.svg"} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
      </Helmet>

      <article className="container pt-4 pb-12 md:py-12 lg:py-16">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleShareProduct(shareData)}
              className="gap-2 text-xs font-medium border-emerald-600/30 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-600" />
              Compartir
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyText}
              className="gap-2 text-xs font-medium"
              title="Copiar información completa"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "¡Copiado!" : "Copiar texto"}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Columna Izquierda: Galería blindada */}
          <div className="w-full lg:col-span-7">
            <ProductGallery
              coverImage={product.image || "/placeholder.svg"}
              productTitle={product.title || "Producto"}
              images={productImages}
            />
          </div>

          {/* Columna Derecha: Información comercial */}
          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 bg-secondary/50 px-2.5 py-1 rounded-md">
                {product.category?.name ?? "Sin categoría"}
              </span>

              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
                  {product.title}
                </h1>
                <p className="text-3xl font-extrabold tracking-tight text-amber-900">
                  ${product.price?.toLocaleString("es-AR")}
                </p>
              </div>

              <p className="text-base leading-relaxed text-muted-foreground pt-2 whitespace-pre-line">
                {product.description || "Pieza creada a mano con dedicación y detalles únicos."}
              </p>
            </div>

            <div className="pt-2">
              <div className="transform transition-all hover:scale-[1.01]">
                <WhatsAppButton 
                  productName={product.title} 
                  className="w-full py-6 text-base font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-3" 
                />
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2 font-medium">
                💬 Atención personalizada directa con el taller artesanal
              </p>
            </div>

            <div className="grid gap-4 border-y border-border/60 py-6 my-2">
              <div className="flex gap-3 items-start">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Pieza artesanal</p>
                  <p className="text-sm text-muted-foreground">Cada producto puede tener variaciones propias del trabajo manual.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Consulta de disponibilidad</p>
                  <p className="text-sm text-muted-foreground">Coordinamos stock, tiempos y entrega de forma directa.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Compra asistida</p>
                  <p className="text-sm text-muted-foreground">Te acompañamos en todo el proceso antes de confirmar tu pedido.</p>
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