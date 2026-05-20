export const brand = {
  name: "Tierra Arcilla",
  tagline: "Cerámica artesanal hecha con alma",
  description: "Piezas únicas de cerámica artesanal, moldeadas a mano con técnicas tradicionales y materiales nobles.",
  whatsapp: {
    number: "5493886526325", // Replace with actual WhatsApp number
    defaultMessage: (productName: string) =>
      `Hola, quiero consultar por el producto ${productName} de Tierra Arcilla.`,
  },
  social: {
    instagram: "https://instagram.com/tierraarcilla",
  },
} as const;
