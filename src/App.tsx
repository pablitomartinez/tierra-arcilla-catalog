import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail"; // (Puedes dejarlo comentado o borrarlo después)
import ProductDetailV1 from "./pages/ProductDetailV1"; // Nuestra nueva versión limpia
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminLayout from "@/layouts/AdminLayout";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/productos" element={<Products />} />


          {/* Antes apuntaba al viejo: */}
          <Route path="/productos/:slug" element={<ProductDetail />} />

          {/* Ahora apunta al nuevo limpio estilo Mercado Libre / Tienda Nube: */}
          {/* <Route path="/productos/:slug" element={<ProductDetailV1 />} /> */}



          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Rutas Protegidas de Admin con Layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Aquí podrás agregar más rutas admin como /admin/pedidos, etc. */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
