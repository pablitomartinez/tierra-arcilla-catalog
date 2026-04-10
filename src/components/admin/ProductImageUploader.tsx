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
import { DraftImage, EditableImage } from "@/types/productImage";

interface DraftProps {
  draftImages: DraftImage[];
  onChange: (images: DraftImage[]) => void;
}

interface EditableProps {
  editableImages: EditableImage[];
  onChange: (images: EditableImage[]) => void;
}

type Props = DraftProps | EditableProps;

function isEditableProps(props: Props): props is EditableProps {
  return "editableImages" in props;
}

function getImageId(image: DraftImage | EditableImage): string {
  if ("kind" in image) {
    return image.kind === "existing" ? `existing-${image.id}` : `new-${image.localId}`;
  }

  return image.id;
}

function getPreviewUrl(image: DraftImage | EditableImage): string | null {
  if ("kind" in image) {
    return image.kind === "new" ? image.previewUrl : null;
  }

  return image.previewUrl;
}

export default function ProductImageUploader(props: Props) {
  const images = isEditableProps(props) ? props.editableImages : props.draftImages;
  const latestImagesRef = useRef(images);

  useEffect(() => {
    latestImagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      for (const image of latestImagesRef.current) {
        const previewUrl = getPreviewUrl(image);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
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

      if (isEditableProps(props)) {
        const newImages: EditableImage[] = files.map((file) => ({
          kind: "new",
          localId: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
        }));

        props.onChange([...props.editableImages, ...newImages]);
      } else {
        const newImages: DraftImage[] = files.map((file) => ({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
        }));

        props.onChange([...props.draftImages, ...newImages]);
      }

      e.target.value = "";
    },
    [props],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = images.findIndex((image) => getImageId(image) === active.id);
      const newIndex = images.findIndex((image) => getImageId(image) === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      if (isEditableProps(props)) {
        props.onChange(arrayMove(props.editableImages, oldIndex, newIndex));
      } else {
        props.onChange(arrayMove(props.draftImages, oldIndex, newIndex));
      }
    },
    [images, props],
  );

  const handleRemove = useCallback(
    (imageToRemove: DraftImage | EditableImage) => {
      console.log("REMOVING IMAGE", imageToRemove);
  
      const previewUrl = getPreviewUrl(imageToRemove);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
  
      if (isEditableProps(props)) {
        console.log("BEFORE editable", props.editableImages);
  
        const updated = props.editableImages.filter(
          (image) => getImageId(image) !== getImageId(imageToRemove)
        );
  
        console.log("AFTER editable", updated);
  
        props.onChange(updated);
      } else {
        console.log("BEFORE draft", props.draftImages);
  
        const draftImage = imageToRemove as DraftImage;
  
        const updated = props.draftImages.filter(
          (image) => image.id !== draftImage.id
        );
  
        console.log("AFTER draft", updated);
  
        props.onChange(updated);
      }
    },
    [props]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Imágenes del producto ({images.length})
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
            items={images.map(getImageId)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {images.map((image, index) => (
                <ProductImageItem
                  key={getImageId(image)}
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
