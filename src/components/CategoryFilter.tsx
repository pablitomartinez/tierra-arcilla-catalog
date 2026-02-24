import { ProductCategory, CATEGORY_LABELS } from "@/types/product";

interface CategoryFilterProps {
  selected: ProductCategory | "all";
  onChange: (category: ProductCategory | "all") => void;
}

const categories: (ProductCategory | "all")[] = ["all", "bowls", "vases", "plates", "mugs", "planters", "trays"];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selected === cat
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {cat === "all" ? "Todos" : CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
