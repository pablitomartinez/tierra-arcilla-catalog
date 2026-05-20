import { brand } from "@/config/brand";
// Opcional: si usas lucide-react en tu proyecto, puedes descomentar la siguiente línea para agregar el ícono
// import { Phone } from "lucide-react"; 

export function TopBar() {
  // Código de país para Argentina (54) + código de área sin el 15 (9388) + número
  const whatsappUrl = "https://wa.me/5493886526325?text=Hola!%20Me%20interesa%20hacer%20una%20consulta%20sobre%20las%20piezas%20de%20Tierra%20Arcilla.";

  return (
    <div className="hidden border-b bg-clay-dark text-primary-foreground md:block">
      <div className="container flex h-9 items-center justify-between text-xs font-medium">
        <p>Envíos y consultas personalizadas para cada pieza</p>
        <div className="flex items-center gap-5">
          {/* <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground/80">
            Instagram
          </a> */}
          
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 hover:underline hover:text-primary-foreground/90 transition-all"
          >
            {/* <Phone className="h-3.5 w-3.5" /> */}
            Atención por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}