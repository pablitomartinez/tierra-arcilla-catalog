import { useCallback, useEffect, useRef } from "react";
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
import { ImagePlus } from "lucide-react";
import ProductImageItem from "./ProductImageItem";
import { DraftImage } from "@/types/productImage";

interface Props {
  draftImages: DraftImage[];
  onChange: (images: DraftImage[]) => void;
}

export default function ProductImageUploader({ draftImages, onChange }: Props) {
  const latestImagesRef = useRef(draftImages);

  useEffect(() => {
    latestImagesRef.current = draftImages;
  }, [draftImages]);

  useEffect(() => {
    return () => {
      for (const image of latestImagesRef.current) {
        URL.revokeObjectURL(image.previewUrl);
      }
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;

      const newImages: DraftImage[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      onChange([...draftImages, ...newImages]);
      e.target.value = "";
    },
    [draftImages, onChange],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = draftImages.findIndex((image) => image.id === active.id);
      const newIndex = draftImages.findIndex((image) => image.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      onChange(arrayMove(draftImages, oldIndex, newIndex));
    },
    [draftImages, onChange],
  );

  const handleRemove = useCallback(
    (imageToRemove: DraftImage) => {
      URL.revokeObjectURL(imageToRemove.previewUrl);
      onChange(draftImages.filter((image) => image.id !== imageToRemove.id));
    },
    [draftImages, onChange],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Imágenes del producto ({draftImages.length})
        </h3>
        <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
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

      {draftImages.length === 0 ? (
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
            items={draftImages.map((image) => image.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {draftImages.map((image, index) => (
                <ProductImageItem
                  key={image.id}
                  image={image}
                  index={index}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
