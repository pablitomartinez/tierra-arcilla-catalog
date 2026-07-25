import { Link, useLocation } from "react-router-dom";
import { Category } from "@/types/product";

interface CategoryNavProps {
  categories: Category[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const items = categories.length > 0 ? categories : [];

  // 🔥 NUESTRO INTERCEPTOR: Frena el salto seco y lo hace suave
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
    <div className="border-b bg-card/80">
      <div className="container">
        <nav className="-mx-4 flex h-12 items-center gap-2 overflow-x-auto px-4 text-sm md:mx-0 md:justify-center md:gap-7 md:overflow-visible md:px-0">
          
          {isHome ? (
            /* =========================================
               VISTA INICIO: Scroll Suave a Secciones
               ========================================= */
            <>
              <a
                href="/#productos"
                onClick={(e) => handleNavClick(e, "productos")}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Productos
              </a>
              <a
                href="/#destacados"
                onClick={(e) => handleNavClick(e, "destacados")}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Destacados
              </a>
              <a
                href="/#box"
                onClick={(e) => handleNavClick(e, "box")}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Opciones BOX
              </a>
              <a
                href="/#nosotros"
                onClick={(e) => handleNavClick(e, "nosotros")}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Nosotros
              </a>
              <a
                href="/#contacto"
                onClick={(e) => handleNavClick(e, "contacto")}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Contacto
              </a>
            </>
          ) : (
            /* =========================================
               VISTA CATÁLOGO: Filtros por Categoría
               ========================================= */
            <>
              <Link
                to="/productos"
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Todos
              </Link>
              {items.map((category) => (
                <Link
                  key={category.id}
                  to="/productos" 
                  className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {category.name}
                </Link>
              ))}
            </>
          )}

        </nav>
      </div>
    </div>
  );
}