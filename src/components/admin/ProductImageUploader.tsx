import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductImageItem from "./ProductImageItem";
import { useProductImages } from "@/hooks/useProductImages";
import {
  uploadProductImage,
  deleteProductImage,
  updateImagePositions,
} from "@/services/productImages";
import { updateProduct } from "@/services/products";
import { ProductImage, PendingImage, SortableImage, sortableImageId } from "@/types/productImage";
import { toast } from "sonner";

interface Props {
  productId: string | null;
  /** Called after images are persisted so parent can refresh */
  onImagesChanged?: () => void;
}

export default function ProductImageUploader({ productId, onImagesChanged }: Props) {
  const { data: existingImages = [], isLoading } = useProductImages(productId);

  const [images, setImages] = useState<SortableImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingImage[]>([]);
  const [saving, setSaving] = useState(false);

  // Sync existing images into sortable list (keep pending at their positions)
  useEffect(() => {
    const existing: SortableImage[] = existingImages.map((img) => ({
      kind: "existing" as const,
      data: img,
    }));
    const pending: SortableImage[] = pendingFiles.map((p) => ({
      kind: "pending" as const,
      data: p,
    }));
    setImages([...existing, ...pending]);
  }, [existingImages, pendingFiles]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const newPending: PendingImage[] = files.map((file) => ({
        localId: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setPendingFiles((prev) => [...prev, ...newPending]);
      e.target.value = "";
    },
    [],
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setImages((prev) => {
      const oldIndex = prev.findIndex((i) => sortableImageId(i) === active.id);
      const newIndex = prev.findIndex((i) => sortableImageId(i) === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleRemove = useCallback(
    async (img: SortableImage) => {
      if (img.kind === "pending") {
        URL.revokeObjectURL(img.data.previewUrl);
        setPendingFiles((prev) => prev.filter((p) => p.localId !== img.data.localId));
        return;
      }
      if (!window.confirm("¿Eliminar esta imagen?")) return;
      try {
        await deleteProductImage(img.data);
        onImagesChanged?.();
        toast.success("Imagen eliminada");
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar imagen");
      }
    },
    [onImagesChanged],
  );

  const handleSave = useCallback(async () => {
    if (!productId) return;
    setSaving(true);
    try {
      // 1. Upload pending files
      const pendingInOrder = images.filter((i) => i.kind === "pending") as Extract<SortableImage, { kind: "pending" }>[];
      for (const item of pendingInOrder) {
        const position = images.indexOf(item);
        await uploadProductImage(productId, item.data.file, position);
        URL.revokeObjectURL(item.data.previewUrl);
      }
      setPendingFiles([]);

      // 2. Update positions for existing images
      const existingInOrder = images
        .map((img, idx) => ({ img, idx }))
        .filter((x) => x.img.kind === "existing") as { img: Extract<SortableImage, { kind: "existing" }>; idx: number }[];

      if (existingInOrder.length > 0) {
        await updateImagePositions(
          existingInOrder.map((x) => ({ id: x.img.data.id, position: x.idx })),
        );
      }

      // 3. Set cover image (position 0)
      const coverImg = images[0];
      const coverUrl =
        coverImg?.kind === "existing"
          ? coverImg.data.url
          : undefined; // will be set after re-fetch

      if (coverUrl) {
        await updateProduct(productId, { image: coverUrl });
      }

      onImagesChanged?.();
      toast.success("Imágenes guardadas");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error al guardar imágenes");
    } finally {
      setSaving(false);
    }
  }, [productId, images, onImagesChanged]);

  if (!productId) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Guardá el producto primero para agregar imágenes.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando imágenes…
      </div>
    );
  }

  const hasChanges = pendingFiles.length > 0 || images.some(
    (img, idx) => img.kind === "existing" && img.data.position !== idx,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Imágenes del producto ({images.length})
        </h3>
        <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
          <ImagePlus className="h-4 w-4" />
          Agregar
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-10 text-center">
          <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Arrastrá o seleccioná imágenes para este producto
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map(sortableImageId)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <ProductImageItem
                  key={sortableImageId(img)}
                  image={img}
                  index={idx}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {hasChanges && (
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="gap-1.5"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar imágenes
        </Button>
      )}
    </div>
  );
}
