import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Star } from "lucide-react";
import { DraftImage } from "@/types/productImage";
import { cn } from "@/lib/utils";

interface Props {
  image: DraftImage;
  index: number;
  onRemove: (img: DraftImage) => void;
}

export default function ProductImageItem({ image, index, onRemove }: Props) {
  const id = image.id;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCover = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square rounded-lg border-2 overflow-hidden bg-muted",
        isDragging && "opacity-50 z-50",
        isCover ? "border-primary" : "border-border",
        "ring-2 ring-accent/40",
      )}
    >
      <img src={image.previewUrl} alt="" className="h-full w-full object-cover" />

      {/* Cover badge */}
      {isCover && (
        <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          <Star className="h-3 w-3" /> Portada
        </span>
      )}

      <span className="absolute top-1.5 right-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
        Nueva
      </span>

      {/* Overlay actions */}
      <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          className="m-1.5 cursor-grab rounded bg-card/80 p-1 text-foreground backdrop-blur-sm active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="m-1.5 rounded bg-destructive/90 p-1 text-destructive-foreground backdrop-blur-sm hover:bg-destructive"
          onClick={() => onRemove(image)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
