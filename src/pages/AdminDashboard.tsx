import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Package, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  Tag
} from "lucide-react";
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

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const emptyForm = { title: "", slug: "", description: "", price: "", categoryId: "", image: "" };

const AdminDashboard = () => {
  const { activeTab } = useOutletContext<{ activeTab: 'resumen' | 'productos' | 'categorias' }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  // Métricas calculadas para la pestaña Resumen
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const inactiveProducts = totalProducts - activeProducts;
  const totalCategories = categories.length;

  // Conteo de productos por categoría
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.categoryId === cat.id).length
  }));

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.invalidateQueries({ queryKey: productKeys.active });
  };

  const handleTitleChange = (title: string) => {
    setForm(curr => ({ ...curr, title, slug: editing ? curr.slug : slugify(title) }));
  };

  const handleEditProduct = async (product: Product) => {
    setEditing(product.id);
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description || "",
      price: product.price.toString(),
      categoryId: product.categoryId,
      image: product.image,
    });

    try {
      const imgs = await getProductImages(product.id);
      const formatted: ExistingEditableImage[] = imgs.map(img => ({
        kind: "existing",
        id: img.id,
        url: img.url,
        position: img.position,
      }));
      setOriginalImages(formatted);
      setEditableImages(formatted);
      setDraftImages([]);
    } catch (err) {
      console.error("Error al cargar imágenes del producto:", err);
    }

    setShowForm(true);
  };

  const handleNewProductClick = () => {
    setEditing(null);
    setForm(emptyForm);
    setDraftImages([]);
    setEditableImages([]);
    setOriginalImages([]);
    setShowForm(!showForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editing) {
        await updateProductWithImages({ 
          productId: editing, 
          productData: { ...form, price: parseFloat(form.price) }, 
          editableImages, 
          originalImages 
        });
        toast.success("Producto actualizado correctamente");
      } else {
        await createProductWithImages({ ...form, price: parseFloat(form.price), active: true }, draftImages);
        toast.success("Producto creado exitosamente");
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      invalidate();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el producto");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado");
      invalidate();
    } catch (error) {
      toast.error("No se pudo eliminar el producto");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleProductActive(id);
      toast.success("Estado del producto actualizado");
      invalidate();
    } catch (error) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await createCategory({ name: newCategoryName, slug: slugify(newCategoryName) });
    setNewCategoryName("");
    setShowCategoryForm(false);
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    toast.success("Categoría creada");
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("¿Eliminar categoría?")) return;
    await deleteCategory(id);
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    toast.success("Categoría eliminada");
  };

  return (
    <div className="space-y-8">

      {/* PESTAÑA 1: RESUMEN GENERAL */}
      {activeTab === 'resumen' && (
        <section className="space-y-8">
          {/* Bienvenida e Identidad */}
          <div className="bg-amber-900/5 border border-amber-900/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">¡Hola, Tierra Arcilla! 👋</h1>
              <p className="text-gray-600 text-sm mt-1">
                Este es el estado actual de tu catálogo y la disponibilidad de tus productos.
              </p>
            </div>
            <a 
              href="/productos" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <ExternalLink size={16} /> Ver tienda pública
            </a>
          </div>

          {/* Tarjetas de Métricas (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
                <Package size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Visibles en Tienda</p>
                <p className="text-2xl font-bold text-emerald-700">{activeProducts}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Sin Stock / Ocultos</p>
                <p className="text-2xl font-bold text-gray-700">{inactiveProducts}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                <Layers size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
              </div>
            </div>
          </div>

          {/* Bloque Doble: Distribución por Categoría y Últimos Agregados */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Estado de Categorías */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Tag size={18} className="text-amber-800" /> Productos por Categoría
              </h3>
              {categoryCounts.length === 0 ? (
                <p className="text-sm text-gray-400">Sin categorías registradas.</p>
              ) : (
                <div className="space-y-3">
                  {categoryCounts.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <span className="bg-white px-2.5 py-0.5 rounded-full border text-xs font-semibold text-gray-600">
                        {cat.count} pieza{cat.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Últimos Productos Creados */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Últimas Piezas Añadidas</h3>
              {products.length === 0 ? (
                <p className="text-sm text-gray-400">No hay productos agregados todavía.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.slice(0, 4).map(prod => (
                    <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prod.image || "/placeholder.svg"} 
                          alt={prod.title} 
                          className="w-10 h-10 object-cover rounded-lg border bg-gray-50"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{prod.title}</p>
                          <p className="text-xs text-gray-500">{prod.category?.name || "Sin categoría"}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-amber-900">${prod.price.toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* PESTAÑA 2: CATEGORÍAS */}
      {activeTab === 'categorias' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Categorías</h2>
            <Button onClick={() => setShowCategoryForm(!showCategoryForm)}><Plus className="h-4 w-4 mr-2" /> Nueva</Button>
          </div>
          {showCategoryForm && (
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Nombre de categoría..." />
              <Button type="submit">Guardar</Button>
            </form>
          )}
          <div className="grid gap-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm">
                <span className="font-medium">{cat.name}</span> 
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteCategory(cat.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PESTAÑA 3: PRODUCTOS */}
      {activeTab === 'productos' && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestión de Productos</h1>
            <Button onClick={handleNewProductClick}>
              <Plus className="h-4 w-4 mr-2" /> {showForm ? "Cerrar Formulario" : "Nuevo Producto"}
            </Button>
          </div>

          {/* Formulario de Creación / Edición */}
          {showForm && (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">{editing ? "Editar Producto" : "Crear Nuevo Producto"}</h3>
              <ProductForm 
                form={form} setForm={setForm} onSubmit={handleSubmit} 
                onCancel={() => { setShowForm(false); setEditing(null); }} categories={categories} 
                isSubmitting={isSubmitting} editing={editing} 
                draftImages={draftImages} setDraftImages={setDraftImages} 
                editableImages={editableImages} setEditableImages={setEditableImages} 
                handleTitleChange={handleTitleChange} 
              />
            </div>
          )}

          {/* Tabla / Listado de Productos */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Imagen</th>
                    <th className="p-4">Título</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No hay productos cargados todavía. ¡Crea el primero arriba!
                      </td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4">
                          <img 
                            src={product.image || "/placeholder.svg"} 
                            alt={product.title} 
                            className="w-12 h-12 object-cover rounded-lg border bg-gray-100" 
                          />
                        </td>
                        <td className="p-4 font-medium text-gray-900">{product.title}</td>
                        <td className="p-4 text-gray-600">{product.category?.name || "Sin categoría"}</td>
                        <td className="p-4 font-bold text-amber-900">${product.price.toLocaleString("es-AR")}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {product.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleActive(product.id)}
                            title={product.active ? "Desactivar" : "Activar"}
                          >
                            {product.active ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-emerald-600" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default AdminDashboard;