import { Search, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { brand } from "@/config/brand";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { SearchBox } from "./SearchBox";

export function MobileMenuSheet() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // 🔥 INTERCEPTOR PARA EL CELULAR
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        <span className="sr-only">Abrir menú</span>
      </SheetTrigger>
      
      <SheetContent side="left" className="flex w-[86vw] max-w-sm flex-col p-0">
        <SheetHeader className="border-b px-5 py-5 text-left">
          <SheetTitle className="font-heading text-xl">{brand.name}</SheetTitle>
          <SheetDescription>Catálogo artesanal curado para tu espacio.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto px-5 py-5">
          <SearchBox compact />

          <nav className="flex flex-col space-y-2">
            <SheetClose asChild>
              <a href="/#productos" onClick={(e) => handleNavClick(e, "productos")} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                Productos
              </a>
            </SheetClose>

            <SheetClose asChild>
              <a href="/#destacados" onClick={(e) => handleNavClick(e, "destacados")} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                Destacados
              </a>
            </SheetClose>

            <SheetClose asChild>
              <a href="/#box" onClick={(e) => handleNavClick(e, "box")} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                Opciones BOX
              </a>
            </SheetClose>

            <SheetClose asChild>
              <a href="/#nosotros" onClick={(e) => handleNavClick(e, "nosotros")} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                Nosotros
              </a>
            </SheetClose>

            <SheetClose asChild>
              <a href="/#contacto" onClick={(e) => handleNavClick(e, "contacto")} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                Contacto
              </a>
            </SheetClose>
          </nav>

          <div className="grid gap-2 border-t pt-4">
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary" type="button">
              <Search className="h-4 w-4" />
              Buscar
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary" type="button">
              <ShoppingBag className="h-4 w-4" />
              Carrito
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}