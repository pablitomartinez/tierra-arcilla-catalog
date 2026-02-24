import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brand } from "@/config/brand";
import { toast } from "sonner";

const MOCK_CREDENTIALS = { email: "admin@tierraarcilla.com", password: "admin123" };

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      sessionStorage.setItem("admin-auth", "true");
      navigate("/admin");
    } else {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">{brand.name}</h1>
          <p className="text-sm text-muted-foreground">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tierraarcilla.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Demo: admin@tierraarcilla.com / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
