import { Link } from "react-router-dom";
import { brand } from "@/config/brand";
import { MobileMenuSheet } from "./MobileMenuSheet";

export function MainHeader() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container relative flex h-16 items-center justify-center md:h-20">
        
        {/* MENÚ HAMBURGUESA */}
        <div className="absolute left-4 flex items-center">
          <MobileMenuSheet />
        </div>

        {/* LOGO DE LA MARCA CENTRADO */}
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