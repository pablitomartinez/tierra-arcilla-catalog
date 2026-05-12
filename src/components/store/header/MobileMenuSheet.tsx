import { Link } from "react-router-dom";
import { HelpCircle, Menu, Search, ShoppingBag, User } from "lucide-react";
import { brand } from "@/config/brand";
import { Category } from "@/types/product";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBox } from "./SearchBox";

interface MobileMenuSheetProps {
  categories: Category[];
}

export function MobileMenuSheet({ categories }: MobileMenuSheetProps) {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[86vw] max-w-sm flex-col p-0">
        <SheetHeader className="border-b px-5 py-5 text-left">
          <SheetTitle className="font-heading text-xl">{brand.name}</SheetTitle>
          <SheetDescription>Catálogo artesanal curado para tu espacio.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto px-5 py-5">
          <SearchBox compact />

          <nav className="space-y-1">
            <Link className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary" to="/">
              Inicio
            </Link>
            <Link className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary" to="/productos">
              Productos
            </Link>
          </nav>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categorías</p>
            <div className="grid gap-1">
              {categories.length === 0 ? (
                <Link className="rounded-md px-3 py-2 text-sm hover:bg-secondary" to="/productos">
                  Ver catálogo completo
                </Link>
              ) : (
                categories.map((category) => (
                  <Link key={category.id} className="rounded-md px-3 py-2 text-sm hover:bg-secondary" to="/productos">
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-2 border-t pt-4">
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary" type="button">
              <Search className="h-4 w-4" />
              Buscar
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary" type="button">
              <User className="h-4 w-4" />
              Cuenta
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary" type="button">
              <HelpCircle className="h-4 w-4" />
              Ayuda
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
