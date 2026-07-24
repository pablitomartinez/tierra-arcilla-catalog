export const brand = {
  name: "Tierra Arcilla",
  tagline: "Tejidos a crochet, jabones, velas y sahumos",
  description: "Somos emprendedoras, realizamos tejidos a crochet en algodón, y tomamos lo mejor de la tierra para elaborar jabones, velas y sahumos que hacen de tus espacios lugares únicos 🌷",
  address: "Juan B. Justo 386 dpto 4, Y4600 San Salvador de Jujuy, Jujuy, Argentina",
  whatsapp: {
    number: "5493886526325", // Número limpio para la API
    displayNumber: "+54 9 3886 52-6325", // Número formateado para que lo lea el humano
    defaultMessage: (productName: string) =>
      `Hola, quiero consultar por el producto ${productName} de Tierra Arcilla.`,
  },
  social: {
    instagram: "https://instagram.com/tierraarcilla", // Si no tienen, lo podemos quitar después
  },
} as const;