import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductGallery } from "@/components/store/product/ProductGallery";
import { useProductImages } from "@/hooks/useProductImages";
import { useProductBySlug } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente: ProductDetail
 * Descripción: Página de detalle de un producto específico en la tienda pública.
 * Sigue una estructura inspirada en plataformas de e-commerce (tipo Mercado Libre / Tienda Nube),
 * optimizada para la conversión mediante un llamado a la acción (CTA) directo por WhatsApp
 * y respaldada por una galería visual interactiva y sellos de confianza artesanal.
 */
const ProductDetail = () => {
  // 1. Obtención de parámetros de la URL (el slug único del producto)
  const { slug } = useParams<{ slug: string }>();

  // 2. Hooks de React Query para obtener la información del producto y sus imágenes adicionales
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { data: productImages = [] } = useProductImages(product?.id ?? null);

  // 3. Efecto para actualizar dinámicamente el título de la pestaña del navegador
  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Tierra Arcilla`;
    }
    return () => {
      document.title = "Tierra Arcilla - Cerámica Artesanal";
    };
  }, [product]);

  // 4. Estado de Carga (Skeleton UI para evitar saltos visuales bruscos)
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

  // 5. Manejo de errores o productos inexistentes / inactivos
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

  // 6. Renderizado principal de la vista del producto
  return (
    <PublicLayout>
      <article className="container pt-4 pb-12 md:py-12 lg:py-16">
        
        {/* Enlace superior para regresar al listado general del catálogo */}
        <Link
          to="/productos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        {/* Estructura en grilla de dos columnas (Galería e Información) */}
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12 lg:gap-16 items-start">

          {/* Columna Izquierda: Galería de imágenes con miniaturas y visualizador */}
          <div className="w-full lg:col-span-7">
            <ProductGallery
              coverImage={product?.image || "/placeholder.svg"}
              productTitle={product?.title ?? "Producto"}
              images={productImages}
            />
          </div>

          {/* Columna Derecha: Información comercial, precio, descripción y botón de contacto */}
          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            
            {/* Bloque de Categoría, Título y Precio */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 bg-secondary/50 px-2.5 py-1 rounded-md">
                {product.category?.name ?? "Sin categoría"}
              </span>

              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
                  {product.title}
                </h1>
                <p className="text-3xl font-extrabold tracking-tight text-amber-900">
                  ${product.price.toLocaleString("es-AR")}
                </p>
              </div>

              <p className="text-base leading-relaxed text-muted-foreground pt-2 whitespace-pre-line">
                {product.description || "Pieza creada a mano con dedicación y detalles únicos."}
              </p>
            </div>

            {/* Bloque de Acción Principal: Botón de WhatsApp destacado */}
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

            {/* Listado de características y beneficios de confianza (Valor agregado) */}
            <div className="grid gap-4 border-y border-border/60 py-6 my-2">
              
              <div className="flex gap-3 items-start">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Pieza artesanal</p>
                  <p className="text-sm text-muted-foreground">
                    Cada producto puede tener variaciones propias del trabajo manual.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Consulta de disponibilidad</p>
                  <p className="text-sm text-muted-foreground">
                    Coordinamos stock, tiempos y entrega de forma directa.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Compra asistida</p>
                  <p className="text-sm text-muted-foreground">
                    Te acompañamos en todo el proceso antes de confirmar tu pedido.
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