import { useLocation } from "react-router-dom";

import { MainHeader } from "./MainHeader";
import { StoreNav } from "./StoreNav";
import { TopBar } from "./TopBar";

export function StoreHeader() {
  const location = useLocation();

  const showStoreNav =
    location.pathname === "/" ||
    location.pathname === "/productos";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <TopBar />
      <MainHeader />

      {showStoreNav && <StoreNav />}
    </header>
  );
}