import { ReactNode, useState, useEffect, useRef } from "react";
import { brand } from "@/config/brand";
import { StoreHeader } from "@/components/store/header/StoreHeader";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Al principio de la página (menos de 50px de scroll), siempre visible
      if (currentScrollY < 50) {
        setIsVisible(true);
      }
      // Si scrollea hacia abajo, oculta el header
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }
      // Si scrollea hacia arriba, lo vuelve a mostrar
      else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">

      {/* 🔥 EL TRUCO ACÁ: Volvemos al StoreHeader "fixed" para que flote sobre la pantalla,
        y le aplicamos transiciones de Tailwind para sacarlo o meterlo del tope (-translate-y-full).
      */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <StoreHeader />
      </div>

      {/* 🔥 COMPENSACIÓN: Al hacer el header fixed, deja de ocupar espacio físico.
        Le metemos un padding-top (pt-28 o md:pt-32 según lo que midan tu TopBar + Nav juntas) 
        al main para que el Hero del index no se meta abajo del menu al cargar la página por primera vez.
      */}
      <main className="flex-1 pt-28 md:pt-32">{children}</main>

      <footer className="border-t bg-card py-8">
        <div className="container flex flex-col items-center text-center space-y-3">

          {/* Reemplazamos el <p> del título por el logotipo */}
          <img
            src="/logo/logotipo.png"
            alt={brand.name}
            // Le damos un tamaño un poco más sutil para el footer y lo centramos
            className="h-24 md:h-28 w-auto object-contain"
          />

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{brand.tagline}</p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}