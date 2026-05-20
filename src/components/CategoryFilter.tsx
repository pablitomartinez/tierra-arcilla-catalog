import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  selected: string;
  onChange: (categoryId: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
      <button
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          selected === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
        type="button"
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            selected === cat.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          type="button"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
