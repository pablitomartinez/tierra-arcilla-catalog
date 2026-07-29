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
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo/logotipo.png"
            alt="Tierra Arcilla"
            className="h-36 md:h-40 w-auto object-contain"
          />
        </Link>

      </div>
    </div>
  );
}