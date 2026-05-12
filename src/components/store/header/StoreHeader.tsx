import { useCategories } from "@/hooks/useCategories";
import { CategoryNav } from "./CategoryNav";
import { MainHeader } from "./MainHeader";
import { TopBar } from "./TopBar";

export function StoreHeader() {
  const { data: categories = [] } = useCategories();

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <MainHeader categories={categories} />
      <CategoryNav categories={categories} />
    </header>
  );
}
