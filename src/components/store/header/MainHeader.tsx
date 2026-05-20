import { Link } from "react-router-dom";
import { brand } from "@/config/brand";
import { MobileMenuSheet } from "./MobileMenuSheet";

export function MainHeader() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      {/* Cambiamos Grid por Flexbox. Usamos justify-center para que por defecto 
        todo el contenido se alinee perfectamente en el centro.
      */}
      <div className="container relative flex h-16 items-center justify-center md:h-20">
        
        {/* MENÚ HAMBURGUESA: 
          Al ponerle 'absolute left-4', lo sacamos del flujo normal del texto.
          Flota a la izquierda sin importar qué tan largo sea el logo, y no le roba espacio.
        */}
        <div className="absolute left-4 flex items-center">
          <MobileMenuSheet />
        </div>

        {/* LOGO DE LA MARCA: 
          Ahora tiene espacio de sobra a los lados para mostrarse completo.
          'max-w-[70%]' evita que se choque con los bordes en celulares muy pequeños.
        */}
        <Link 
          to="/" 
          className="max-w-[70%] text-center font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl transition-opacity hover:opacity-90"
        >
          {brand.name}
        </Link>

      </div>
    </div>
  );
}