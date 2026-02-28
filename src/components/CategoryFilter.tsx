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
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
          selected === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selected === cat.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
