import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { brand } from "@/config/brand";
import { Product, Category } from "@/types/product";
import {
  DraftImage,
  EditableImage,
  ExistingEditableImage,
} from "@/types/productImage";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from "@/services/products";
import {
  deleteProductImage,
  getProductImages,
  insertProductImages,
  removeImagesFromStorage,
  updateImagePositions,
  uploadImageToProductStorage,
} from "@/services/productImages";
import { createCategory, deleteCategory } from "@/services/categories";
import { useAllProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { productKeys } from "@/hooks/useProducts";
import { categoryKeys } from "@/hooks/useCategories";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import ProductImageUploader from "@/components/admin/ProductImageUploader";

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
  categoryId: string;
  image: string;
}

const emptyForm: ProductFormData = {
  title: "",
  slug: "",
  description: "",
  price: "",
  categoryId: "",
  image: "",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();

  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [draftImages, setDraftImages] = useState<DraftImage[]>([]);
  const [editableImages, setEditableImages] = useState<EditableImage[]>([]);
  const [originalImages, setOriginalImages] = useState<ExistingEditableImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
    console.log("original", originalImages);
    console.log("editable", editableImages);
  }, [originalImages, editableImages, user, isAdmin, authLoading, navigate]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.invalidateQueries({ queryKey: productKeys.active });
  };

  const clearDraftImages = () => {
    for (const image of draftImages) {
      URL.revokeObjectURL(image.previewUrl);
    }
    setDraftImages([]);
  };

  const clearEditableImages = () => {
    for (const image of editableImages) {
      if (image.kind === "new") {
        URL.revokeObjectURL(image.previewUrl);
      }
    }
    setEditableImages([]);
    setOriginalImages([]);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: editing ? f.slug : slugify(title) }));
  };
  // LOGGER
  const logStep = (step: string, status: "OK" | "ERROR", detail?: any) => {
    if (status === "OK") {
      console.log(`✅ ${step}`);
    } else {
      console.error(`❌ ${step}`, detail);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const price = parseFloat(form.price);

    if (isNaN(price) || price <= 0) {
      toast.error("Ingresá un precio válido");
      return;
    }

    if (!form.categoryId) {
      toast.error("Seleccioná una categoría");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editing) {
        console.log("EDIT MODE ACTIVE");

        let hasError = false;

        const newImages = editableImages.filter((img) => img.kind === "new");

        const deletedImages = originalImages.filter(
          (orig) =>
            !editableImages.some(
              (e) => e.kind === "existing" && e.id === orig.id
            )
        );

        // =========================
        // 1. UPLOAD
        // =========================
        let uploadedImages: { path: string; url: string; localId: string }[] = [];

        try {
          for (const image of newImages) {
            const uploaded = await uploadImageToProductStorage(
              editing,
              image.file,
              0
            );

            uploadedImages.push({
              path: uploaded.path,
              url: uploaded.publicUrl,
              localId: image.localId, // 🔥 CLAVE
            });
          }

          logStep("UPLOAD", "OK");
        } catch (e) {
          logStep("UPLOAD", "ERROR", e);
          hasError = true;
        }

        // =========================
        // 2. INSERT
        // =========================
        let insertedImages: { id: string; url: string; localId: string }[] = [];

        try {
          if (uploadedImages.length > 0) {
            const inserted = await insertProductImages(
              uploadedImages.map((img) => ({
                product_id: editing,
                url: img.url,
                position: 0,
              }))
            );

            insertedImages = inserted.map((img, index) => ({
              id: img.id,
              url: img.url,
              localId: uploadedImages[index].localId, // 🔥 relación directa
            }));
          }

          logStep("INSERT DB", "OK");
        } catch (e) {
          logStep("INSERT DB", "ERROR", e);
          hasError = true;
        }

        // =========================
        // 3. DELETE
        // =========================
        try {
          if (deletedImages.length > 0) {
            for (const img of deletedImages) {
              await deleteProductImage({
                id: img.id,
                productId: editing,
                url: img.url,
                position: img.position,
                createdAt: "",
              });
            }
          }

          logStep("DELETE", "OK");
        } catch (e) {
          logStep("DELETE", "ERROR", e);
          hasError = true;
        }

        // =========================
        // 4. BUILD FINAL STATE (ROBUSTO)
        // =========================
        let finalImages: { id: string; url: string }[] = [];

        try {
          finalImages = editableImages.map((img) => {
            if (img.kind === "existing") {
              return {
                id: img.id,
                url: img.url,
              };
            }

            const found = insertedImages.find(
              (i) => i.localId === img.localId
            );

            if (!found) {
              throw new Error("Image mapping failed");
            }

            return found;
          });

          logStep("BUILD FINAL STATE", "OK");
        } catch (e) {
          logStep("BUILD FINAL STATE", "ERROR", e);
          hasError = true;
        }

        // =========================
        // 5. REORDER (SEGURO)
        // =========================
        try {
          const reordered = finalImages
            .filter((img) => !!img?.id)
            .map((img, index) => ({
              id: img.id,
              position: index,
            }));

          if (reordered.length > 0) {
            await updateImagePositions(reordered);
          }

          logStep("REORDER", "OK");
        } catch (e) {
          logStep("REORDER", "ERROR", e);
          hasError = true;
        }

        // =========================
        // 6. UPDATE PRODUCT
        // =========================
        try {
          const coverImage =
            finalImages.length > 0 ? finalImages[0].url : "/placeholder.svg";

          await updateProduct(editing, {
            title: form.title,
            slug: form.slug,
            description: form.description,
            price,
            categoryId: form.categoryId,
            image: coverImage,
          });

          logStep("UPDATE PRODUCT", "OK");
        } catch (e) {
          logStep("UPDATE PRODUCT", "ERROR", e);
          hasError = true;
        }

        // =========================
        // FINAL RESULT
        // =========================
        if (hasError) {
          toast.error("Guardado parcial (revisar consola)");
        } else {
          toast.success("Producto actualizado correctamente");
        }

        setForm(emptyForm);
        clearDraftImages();
        clearEditableImages();
        setEditing(null);
        setShowForm(false);
        invalidate();

        return;
      }

      const created = await createProduct({
        title: form.title,
        slug: form.slug,
        description: form.description,
        price,
        categoryId: form.categoryId,
        image: form.image || "/placeholder.svg",
        active: true,
      });

      const uploadedImages: { path: string; url: string; position: number }[] = [];

      try {
        if (draftImages.length > 0) {
          for (const [index, draftImage] of draftImages.entries()) {
            const uploaded = await uploadImageToProductStorage(created.id, draftImage.file, index);
            uploadedImages.push({
              path: uploaded.path,
              url: uploaded.publicUrl,
              position: index,
            });
          }

          await insertProductImages(
            uploadedImages.map((image) => ({
              product_id: created.id,
              url: image.url,
              position: image.position,
            })),
          );
        }
      } catch (imageError) {
        try {
          await removeImagesFromStorage(uploadedImages.map((image) => image.path));
        } catch (cleanupError) {
          console.error("Error cleaning storage after failed submit:", cleanupError);
        }

        try {
          await deleteProduct(created.id);
        } catch (deleteError) {
          console.error("Error deleting product after failed submit:", deleteError);
        }

        throw imageError;
      }

      toast.success("Producto creado");
      setForm(emptyForm);
      clearDraftImages();
      clearEditableImages();
      setEditing(null);
      setShowForm(false);
      invalidate();
    } catch (error: any) {
      console.error("Error saving product:", error);

      if (error?.code === "23505") {
        toast.error("Ya existe un producto con ese slug");
        return;
      }

      if (error?.message?.includes("Failed to fetch")) {
        toast.error("Error de conexión. Verificá tu internet");
        return;
      }

      if (error instanceof Error) {
        toast.error("Error al subir imágenes o guardar el producto");
        return;
      }

      toast.error("Error inesperado al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.categoryId,
      image: product.image,
    });
    clearDraftImages();
    clearEditableImages();
    setEditing(product.id);
    setShowForm(true);

    void (async () => {
      try {
        const productImages = await getProductImages(product.id);
        const existingImages: ExistingEditableImage[] = productImages.map((image) => ({
          kind: "existing",
          id: image.id,
          url: image.url,
          position: image.position,
        }));

        setOriginalImages(existingImages);
        setEditableImages(existingImages);
      } catch (error) {
        console.error("Error loading product images:", error);
        toast.error("No se pudieron cargar las imágenes del producto");
      }
    })();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await deleteProduct(id);
        toast.success("Producto eliminado");
        invalidate();
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleProductActive(id);
      invalidate();
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName.trim(), slug: slugify(newCategoryName) });
      toast.success("Categoría creada");
      setNewCategoryName("");
      setShowCategoryForm(false);
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    } catch {
      toast.error("Error al crear categoría");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("¿Eliminar esta categoría? Los productos asociados podrían verse afectados.")) {
      try {
        await deleteCategory(id);
        toast.success("Categoría eliminada");
        queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        invalidate();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message ?? "Error al eliminar categoría");
      }
    }
  };

  if (authLoading) {
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
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="h-4 w-4" />Salir
          </Button>
        </div>
      </header>

      <div className="container py-6 md:py-10 space-y-8">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-heading text-xl font-bold text-foreground">Categorías</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />Nueva categoría
            </Button>
          </div>

          {showCategoryForm && (
            <form onSubmit={handleCreateCategory} className="bg-card border rounded-lg p-4 flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="cat-name">Nombre</Label>
                <Input
                  id="cat-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                  placeholder="Ej: Cuencos"
                />
              </div>
              <Button type="submit" size="sm">Crear</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCategoryForm(false)}>Cancelar</Button>
            </form>
          )}

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm">
                {cat.name}
                <button onClick={() => handleDeleteCategory(cat.id)} className="ml-1 text-destructive hover:text-destructive/80">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="font-heading text-2xl font-bold text-foreground">Productos</h1>
            <Button
              onClick={() => {
                setForm(emptyForm);
                clearDraftImages();
                clearEditableImages();
                setEditing(null);
                setShowForm(!showForm);
              }}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />Nuevo producto
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
                  <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} required />
              </div>
              {editing ? (
                <ProductImageUploader
                  editableImages={editableImages}
                  onChange={setEditableImages}
                />
              ) : (
                <ProductImageUploader
                  draftImages={draftImages}
                  onChange={setDraftImages}
                />
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {editing ? "Guardar cambios" : "Crear producto"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                    setForm(emptyForm);
                    clearDraftImages();
                    clearEditableImages();
                  }}
                >
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
                    {product.category?.name ?? "Sin categoría"} · ${product.price.toLocaleString("es-AR")}
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
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
