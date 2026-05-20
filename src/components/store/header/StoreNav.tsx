import { ui } from "@/lib/ui";

const navigationItems = [
  { label: "Productos", id: "productos" },
  { label: "Destacados", id: "destacados" },
  { label: "Combos", id: "combos" },
  { label: "Nosotros", id: "nosotros" },
  { label: "Contacto", id: "contacto" },
];

export function StoreNav() {
  const handleScroll = (id: string) => {
    const section = document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur">
      <div className={ui.container}>
        <nav className="no-scrollbar -mx-4 flex h-12 items-center gap-2 overflow-x-auto px-4 md:mx-0 md:justify-center md:px-0">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className="
                shrink-0 whitespace-nowrap rounded-full
                px-4 py-2 text-sm font-medium
                text-muted-foreground
                transition-all duration-300
                hover:bg-secondary
                hover:text-foreground
              "
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}