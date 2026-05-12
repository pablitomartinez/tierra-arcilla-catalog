import { ReactNode } from "react";
import { brand } from "@/config/brand";
import { StoreHeader } from "@/components/store/header/StoreHeader";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />

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
