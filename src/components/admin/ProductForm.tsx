// src/components/admin/ProductForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductImageUploader from "./ProductImageUploader";

interface ProductFormProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  categories: any[];
  isSubmitting: boolean;
  editing: string | null;
  draftImages: any[];
  setDraftImages: (images: any[]) => void;
  editableImages: any[];
  setEditableImages: (images: any[]) => void;
  handleTitleChange: (title: string) => void;
}

export const ProductForm = ({ form, setForm, onSubmit, onCancel, categories, isSubmitting, editing, draftImages, setDraftImages, editableImages, setEditableImages, handleTitleChange }: ProductFormProps) => {
  return (
    <form onSubmit={onSubmit} className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
      <h2 className="font-heading text-lg font-semibold">{editing ? "Editar producto" : "Nuevo producto"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Precio ($)</Label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
      </div>
      
      {editing ? (
        <ProductImageUploader editableImages={editableImages} onChange={setEditableImages} />
      ) : (
        <ProductImageUploader draftImages={draftImages} onChange={setDraftImages} />
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>{editing ? "Guardar" : "Crear"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};