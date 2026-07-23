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
        <p className="text-muted-foreground">Cargando...</p>
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
    <div className="min-h-screen bg-muted/20 flex">
      {/* Sidebar Desktop y Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-6 flex items-center justify-between">
          <span className="font-heading font-bold text-xl">{brand.name}</span>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <Button 
              key={item.name} 
              variant={activeTab === item.id ? "secondary" : "ghost"} 
              className="w-full justify-start gap-3" 
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="h-4 w-4" /> {item.name}
            </Button>
          ))}
        </nav>
        <div className="absolute bottom-4 w-full px-4">
          <Button variant="outline" className="w-full gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <header className="h-14 border-b bg-card flex items-center px-4 md:px-8">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-lg capitalize">{activeTab}</h2>
        </header>
        <main className="p-4 md:p-8">
          {/* Pasamos activeTab al hijo mediante el contexto */}
          <Outlet context={{ activeTab }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
