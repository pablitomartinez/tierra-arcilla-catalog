import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { DraftImage, EditableImage, ExistingEditableImage } from "@/types/productImage";
import { createProductWithImages, updateProductWithImages } from "@/services/productService";
import { deleteProduct, toggleProductActive } from "@/services/products";
import { getProductImages } from "@/services/productImages";
import { createCategory, deleteCategory } from "@/services/categories";
import { useAllProducts, productKeys } from "@/hooks/useProducts";
import { useCategories, categoryKeys } from "@/hooks/useCategories";
import { ProductForm } from "@/components/admin/ProductForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const emptyForm = { title: "", slug: "", description: "", price: "", categoryId: "", image: "" };

const AdminDashboard = () => {
  const { activeTab } = useOutletContext<{ activeTab: 'resumen' | 'productos' | 'categorias' }>();
  const queryClient = useQueryClient();
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();

  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [draftImages, setDraftImages] = useState<DraftImage[]>([]);
  const [editableImages, setEditableImages] = useState<EditableImage[]>([]);
  const [originalImages, setOriginalImages] = useState<ExistingEditableImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.invalidateQueries({ queryKey: productKeys.active });
  };

  const handleTitleChange = (title: string) => {
    setForm(curr => ({ ...curr, title, slug: editing ? curr.slug : slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛑 MIRA ESTO EN LA CONSOLA CUANDO HACES CLICK EN CREAR
  console.log("🚀 LO QUE SE ENVÍA AL SERVICIO - draftImages:", draftImages);

    setIsSubmitting(true);
    try {
      if (editing) {
        await updateProductWithImages({ productId: editing, productData: { ...form, price: parseFloat(form.price) }, editableImages, originalImages });
        toast.success("Actualizado");
      } else {
        await createProductWithImages({ ...form, price: parseFloat(form.price), active: true }, draftImages);
        toast.success("Creado");
      }
      setShowForm(false);
      invalidate();
    } catch (e) { toast.error("Error"); }
    finally { setIsSubmitting(false); }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory({ name: newCategoryName, slug: slugify(newCategoryName) });
    setNewCategoryName("");
    setShowCategoryForm(false);
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
  };

  return (
    <div className="space-y-8">
      {activeTab === 'categorias' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Categorías</h2>
            <Button onClick={() => setShowCategoryForm(!showCategoryForm)}><Plus className="h-4 w-4 mr-2" /> Nueva</Button>
          </div>
          {showCategoryForm && (
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Nombre..." />
              <Button type="submit">Guardar</Button>
            </form>
          )}
          {categories.map(cat => (
            <div key={cat.id} className="flex justify-between p-2 border rounded">
              {cat.name} <Button variant="ghost" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </section>
      )}

      {activeTab === 'productos' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Productos</h1>
            <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" /> Nuevo</Button>
          </div>
          {showForm && (
            <ProductForm 
              form={form} setForm={setForm} onSubmit={handleSubmit} 
              onCancel={() => setShowForm(false)} categories={categories} 
              isSubmitting={isSubmitting} editing={editing} 
              draftImages={draftImages} setDraftImages={setDraftImages} 
              editableImages={editableImages} setEditableImages={setEditableImages} 
              handleTitleChange={handleTitleChange} 
            />
          )}
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;