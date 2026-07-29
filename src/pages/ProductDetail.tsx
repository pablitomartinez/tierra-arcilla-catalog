import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useProductBySlug } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

import { Helmet } from "react-helmet-async";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductBySlug(slug);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground animate-pulse">Cargando producto...</p>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !product) {
    return (
      <PublicLayout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-6">El producto que buscas no existe o fue eliminado.</p>
          <Button asChild>
            <Link to="/productos">← Volver al catálogo</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  // Generación del enlace directo a WhatsApp sin componentes externos complejos
  const whatsappNumber = "5493885000000"; // Reemplaza con tu número si es necesario
  const whatsappMessage = encodeURIComponent(`Hola! Me interesa este producto: ${product.title} (${window.location.href})`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <PublicLayout>
      {/* Aquí inyectamos las etiquetas dinámicas para WhatsApp/Redes */}
      <Helmet>
        <title>{product.title} | Tierra Arcilla</title>
        <meta property="og:title" content={`${product.title} | Tierra Arcilla`} />
        <meta property="og:description" content={product.description || "Pieza creada a mano con dedicación y detalles únicos."} />
        {/* Supabase ya te devuelve la URL absoluta de la imagen */}
        <meta property="og:image" content={product.image || "https://tierra-arcilla.vercel.app/logotipo.png"} />
        <meta name="twitter:image" content={product.image || "https://tierra-arcilla.vercel.app/logotipo.png"} />
      </Helmet>
      <div className="container py-8 md:py-12">
        <div className="mb-6">
          <Link to="/productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Imagen principal limpia y directa */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted border">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-heading mb-2">{product.title}</h1>
              <p className="text-3xl font-extrabold text-amber-900">
                ${product.price?.toLocaleString("es-AR")}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || "Pieza creada a mano con dedicación y detalles únicos."}
            </p>

            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetail;