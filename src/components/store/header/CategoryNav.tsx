import { Link } from "react-router-dom";
import { Category } from "@/types/product";

interface CategoryNavProps {
  categories: Category[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const items = categories.length > 0 ? categories : [];

  return (
    <div className="border-b bg-card/80">
      <div className="container">
        <nav className="-mx-4 flex h-12 items-center gap-2 overflow-x-auto px-4 text-sm md:mx-0 md:justify-center md:gap-7 md:overflow-visible md:px-0">
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
        </nav>
      </div>
    </div>
  );
}
