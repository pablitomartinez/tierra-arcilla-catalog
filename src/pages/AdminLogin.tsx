import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brand } from "@/config/brand";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
// 1. Importamos los íconos para el ojito de la contraseña
import { Eye, EyeOff } from "lucide-react"; 

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 2. Nuevo estado para manejar si se ve o no la contraseña
  const [showPassword, setShowPassword] = useState(false); 
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { user, isAdmin, loading, signIn } = useAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("Credenciales incorrectas");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Cargando...</p>
      </div>
    );
  }

  return (
    // 3. Agregamos el fondo.png. Usamos bg-cover y bg-center para que se adapte perfecto.
    <div 
      className="flex min-h-screen items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/logo/fondo1.png')" }}
    >
      {/* Capa oscura superpuesta opcional para oscurecer un poco el fondo y que resalte la caja */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* 4. Caja del formulario con efecto cristal (backdrop-blur) para un look moderno */}
      <div className="w-full max-w-sm space-y-6 bg-background/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl relative z-10 border border-border/50">
        
        <div className="text-center space-y-4">
          {/* 5. Reemplazamos el <h1> de texto por la imagen del logo */}
          <img 
            src="/logo/logotipo.png" 
            alt={brand.name} 
            className="h-24 md:h-28 mx-auto object-contain drop-shadow-sm" 
          />
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Panel de Administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario"
              required
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            {/* 6. Contenedor relativo para poder posicionar el ojito */}
            <div className="relative">
              <Input
                id="password"
                // Alternamos el tipo de input basado en el estado
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background pr-10" // pr-10 deja espacio a la derecha para que el texto no pise el ícono
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;