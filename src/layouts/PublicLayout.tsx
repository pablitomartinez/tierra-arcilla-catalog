import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { brand } from "@/config/brand";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/productos", label: "Productos" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-heading text-xl font-bold text-foreground tracking-tight">
            {brand.name}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t bg-background px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card py-8">
        <div className="container text-center space-y-2">
          <p className="font-heading text-lg font-semibold text-foreground">{brand.name}</p>
          <p className="text-sm text-muted-foreground">{brand.tagline}</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
