import { Link } from "react-router-dom";
import { brand } from "@/config/brand";
import { SearchBox } from "./SearchBox";
import { MobileMenuSheet } from "./MobileMenuSheet";

export function MainHeader() {
  const whatsappUrl = "https://wa.me/5493886526325?text=Hola!%20Me%20interesa%20hacer%20una%20consulta%20sobre%20las%20piezas%20de%20Tierra%20Arcilla.";

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container flex h-16 items-center gap-1 md:h-20">
        
        {/* Menú hamburguesa (Se mantiene en móviles para navegar) */}
        <MobileMenuSheet />

        {/* Logo: En móvil ocupa el espacio restante de forma limpia */}
        <Link to="/" className="min-w-0 flex-1 font-heading text-xl font-bold tracking-tight text-foreground md:flex-none md:text-2xl">
          {brand.name}
        </Link>

        {/* Barra de búsqueda (Oculta en móvil, visible en escritorio) */}
        <div className="hidden flex-1 justify-center px-6 md:flex">
          <div className="w-full max-w-xl">
            <SearchBox />
          </div>
        </div>

        {/* Contenedor de la derecha */}
        <div className="flex items-center justify-end gap-2">
          
          {/* 🔥 BOTÓN CONSULTAR OPTIMIZADO:
            Cambiamos 'inline-flex' por 'hidden md:inline-flex'.
            Ahora queda 100% oculto en móviles y reaparece en pantallas grandes.
          */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center justify-center rounded-full bg-clay-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-clay-dark/90 md:inline-flex"
          >
            Consultar por WhatsApp
          </a>

        </div>
      </div>
    </div>
  );
}