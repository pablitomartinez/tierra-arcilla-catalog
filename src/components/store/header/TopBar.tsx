import { brand } from "@/config/brand";

export function TopBar() {
  return (
    <div className="hidden border-b bg-clay-dark text-primary-foreground md:block">
      <div className="container flex h-9 items-center justify-between text-xs font-medium">
        <p>Envíos y consultas personalizadas para cada pieza</p>
        <div className="flex items-center gap-5">
          {/* <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground/80">
            Instagram
          </a> */}
          <span>Atención por WhatsApp</span>
        </div>
      </div>
    </div>
  );
}
