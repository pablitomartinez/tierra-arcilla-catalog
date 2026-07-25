export interface ShareProductData {
    id: string;
    title: string;
    description?: string;
    price?: number;
    imageUrl?: string;
  }
  
  export const formatProductShareText = (product: ShareProductData) => {
    // Construimos la URL pública del producto
    const productUrl = `${window.location.origin}/producto/${product.id}`;
  
    const priceText = product.price
      ? `\n💰 *Precio:* $${product.price.toLocaleString("es-AR")}`
      : "";
  
    const descriptionSnippet = product.description
      ? `\n\n${product.description.slice(0, 120)}${product.description.length > 120 ? "..." : ""}`
      : "";
  
    return `✨ *${product.title}* - Tierra Arcilla${priceText}${descriptionSnippet}\n\n🔗 *Ver más fotos y detalles aquí:*\n${productUrl}`;
  };
  
  export const handleShareProduct = async (product: ShareProductData) => {
    const shareText = formatProductShareText(product);
    const productUrl = `${window.location.origin}/producto/${product.id}`;
  
    // Si el navegador soporta Web Share API (móviles)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: productUrl,
        });
        return;
      } catch (error) {
        // El usuario canceló o no soportó la acción
        console.log("Compartir cancelado o no disponible:", error);
      }
    }
  
    // Fallback para PC / Navegadores web: Abrir WhatsApp Web
    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };