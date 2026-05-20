import { Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { brand } from "@/config/brand";
// import { Category } from "@/types/product";
import { SearchBox } from "./SearchBox";
import { MobileMenuSheet } from "./MobileMenuSheet";

// interface MainHeaderProps {
//   categories: Category[];
// }

export function MainHeader() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container flex h-16 items-center gap-1 md:h-20">
        <MobileMenuSheet  />

        <Link to="/" className="min-w-0 flex-1 font-heading text-xl font-bold tracking-tight text-foreground md:flex-none md:text-2xl">
          {brand.name}
        </Link>

        <div className="hidden flex-1 justify-center px-6 md:flex">
          <div className="w-full max-w-xl">
            <SearchBox />
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 md:gap-2">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary md:hidden" type="button">
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </button>

          {/* <button className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:inline-flex" type="button">
            <HelpCircle className="h-4 w-4" />
            Ayuda
          </button>
          <button className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:inline-flex" type="button">
            <User className="h-4 w-4" />
            Cuenta
          </button> */}
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary" type="button">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              0
            </span>
            <span className="sr-only">Carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
}
