import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { brand } from "@/config/brand";
import { Product, ProductCategory, CATEGORY_LABELS } from "@/types/product";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from "@/services/products";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  price: string;
  category: ProductCategory;
  image: string;
}

const emptyForm: ProductFormData = {
  title: "",
  slug: "",
  description: "",
  price: "",
  category: "bowls",
  image: "",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      toast.error("Error al cargar productos");
    }
  }, []);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
      return;
    }
    if (!loading && user && isAdmin) {
      refreshProducts();
    }
  }, [user, isAdmin, loading, navigate, refreshProducts]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: editing ? f.slug : slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Ingresá un precio válido");
      return;
    }

    try {
      if (editing) {
        await updateProduct(editing, {
          title: form.title,
          slug: form.slug,
          description: form.description,
          price,
          category: form.category,
          image: form.image,
        });
        toast.success("Producto actualizado");
      } else {
        await createProduct({
          title: form.title,
          slug: form.slug,
          description: form.description,
          price,
          category: form.category,
          image: form.image || "/placeholder.svg",
          active: true,
        });
        toast.success("Producto creado");
      }

      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
      refreshProducts();
    } catch {
      toast.error("Error al guardar el producto");
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await deleteProduct(id);
        toast.success("Producto eliminado");
        refreshProducts();
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleProductActive(id);
      refreshProducts();
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-bold text-foreground">{brand.name}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      <div className="container py-6 md:py-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="font-heading text-2xl font-bold text-foreground">Productos</h1>
          <Button
            onClick={() => {
              setForm(emptyForm);
              setEditing(null);
              setShowForm(!showForm);
            }}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {editing ? "Editar producto" : "Nuevo producto"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ProductCategory }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de imagen</Label>
              <Input id="image" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://... o /placeholder.svg" />
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editing ? "Guardar cambios" : "Crear producto"}</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-card border rounded-lg p-3 md:p-4">
              <img src={product.image} alt={product.title} className="h-14 w-14 rounded object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{product.title}</p>
                <p className="text-sm text-muted-foreground">
                  {CATEGORY_LABELS[product.category]} · ${product.price.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch checked={product.active} onCheckedChange={() => handleToggle(product.id)} aria-label="Toggle active" />
                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
