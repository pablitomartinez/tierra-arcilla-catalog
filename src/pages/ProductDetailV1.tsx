import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductBySlug } from "@/services/products";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";

export default function ProductDetailV1() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductData() {
      if (!slug) return;
      try {
        setLoading(true);
        // 1. Obtener producto por slug
        const data = await getProductBySlug(slug);
        if (!data) {
          setError("El producto no existe o fue desactivado.");
          return;
        }
        setProduct(data);

        // Imagen principal inicial
        const initialImages = [data.image];

        // 2. Buscar imágenes adicionales en product_images (si las hubiera)
        const { data: galleryData } = await supabase
          .from("product_images")
          .select("url")
          .eq("product_id", data.id)
          .order("position", { ascending: true });

        if (galleryData && galleryData.length > 0) {
          galleryData.forEach((img) => {
            if (img.url && !initialImages.includes(img.url)) {
              initialImages.push(img.url);
            }
          });
        }

        setImages(initialImages);
        setSelectedImage(initialImages[0]);
      } catch (err: any) {
        setError(err.message || "Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [slug]);

  // Función para disparar la consulta por WhatsApp con formato profesional
  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const phoneNumber = "5493880000000"; // Reemplaza con tu número o variable de configuración
    const message = encodeURIComponent(
      `¡Hola! Me interesa este producto y quiero consultar stock/detalles:\n\n*${product.title}*\nPrecio: $${product.price.toLocaleString()}\nLink: ${window.location.href}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-red-500 text-lg font-medium mb-4">{error || "Producto no encontrado"}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          <ArrowLeft size={18} /> Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Botón de retorno */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition"
        >
          <ArrowLeft size={20} /> Volver al catálogo
        </button>

        {/* Tarjeta principal estilo Mercado Libre */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10">
          
          {/* Columna Izquierda: Galería y Carrusel */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Imagen principal grande */}
            <div className="w-full h-96 sm:h-[450px] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
              <img
                src={selectedImage || product.image}
                alt={product.title}
                className="w-full h-full object-contain p-2 transition-all duration-300"
              />
            </div>

            {/* Carrusel / Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === imgUrl ? "border-primary ring-2 ring-primary/20" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Información y CTA WhatsApp */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Categoría y Estado */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium uppercase tracking-wider">
                  {product.category?.name || "General"}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium text-xs">
                  <CheckCircle2 size={14} /> Stock disponible
                </span>
              </div>

              {/* Título */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* Precio */}
              <div className="py-3 border-y border-gray-100">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Lo que tenés que saber de este producto:
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {product.description || "Sin descripción detallada."}
                </p>
              </div>
            </div>

            {/* Botón de Acción por WhatsApp (Cierre de Venta) */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-base"
              >
                <MessageCircle size={22} className="fill-current" />
                Consultar por WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Atención personalizada directa con el vendedor
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}