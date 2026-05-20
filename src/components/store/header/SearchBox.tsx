import { Search } from "lucide-react";

interface SearchBoxProps {
  compact?: boolean;
}

export function SearchBox({ compact = false }: SearchBoxProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        placeholder="Buscar productos, categorías o colecciones"
        className={`w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 ${
          compact ? "h-10" : "h-11"
        }`}
        aria-label="Buscar productos"
      />
    </div>
  );
}
