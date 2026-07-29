import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Tag, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { brand } from "@/config/brand";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'productos' | 'categorias'>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { name: "Resumen", icon: LayoutDashboard, id: 'resumen' },
    { name: "Productos", icon: Package, id: 'productos' },
    { name: "Categorías", icon: Tag, id: 'categorias' },
  ] as const;

  return (
    // 1. Contenedor principal con imagen de fondo y altura fija para scrollear solo el contenido
    <div 
      className="h-screen w-full flex bg-cover bg-center bg-fixed relative overflow-hidden"
      style={{ backgroundImage: "url('/logo/fondo.png')" }}
    >
      {/* 2. Capa Glassmorphism: Oscurece y desenfoca ligeramente el fondo para mejorar la lectura */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-0"></div>

      {/* Sidebar Desktop y Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur-md border-r shadow-2xl transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          
          {/* 3. Logo oficial en lugar de texto plano */}
          <img 
            src="/logo/logotipo.png" 
            alt={brand.name} 
            className="h-24 md:h-30 w-auto object-contain"
          />
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="px-4 py-6 space-y-2 flex-1">
          {menuItems.map((item) => (
            <Button 
              key={item.name} 
              variant={activeTab === item.id ? "secondary" : "ghost"} 
              className={`w-full justify-start gap-3 font-medium transition-all ${activeTab === item.id ? "shadow-sm bg-secondary/80" : ""}`}
              onClick={() => {
                setActiveTab(item.id as any);
                setSidebarOpen(false);
              }}
            >
              <item.icon className={`h-4 w-4 ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`} /> 
              {item.name}
            </Button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border/50 mt-auto">
          <Button 
            variant="outline" 
            className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors" 
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
      </aside>

      {/* Main Content (Área Dinámica) */}
      <div className="flex-1 md:pl-64 relative z-10 flex flex-col h-full w-full">
        {/* Header Superior transparente */}
        <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-md flex items-center px-4 md:px-8 shadow-sm shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-lg capitalize text-foreground">{activeTab}</h2>
        </header>
        
        {/* Contenedor escrolleable interno (El fondo queda fijo, el contenido se mueve) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet context={{ activeTab }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;