import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types/productImage";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  coverImage: string;
  productTitle: string;
  images?: ProductImage[];
}

export function ProductGallery({ coverImage, productTitle, images = [] }: ProductGalleryProps) {
  const galleryImages = useMemo(() => {
    const urls = [coverImage, ...images.map((image) => image.url)].filter(Boolean);
    return Array.from(new Set(urls));
  }, [coverImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeImage = galleryImages[activeIndex] ?? coverImage;
  const hasMultipleImages = galleryImages.length > 1;

  const goToImage = (index: number) => {
    const nextIndex = (index + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIndex);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStart === null || !hasMultipleImages) return;

    const distance = touchStart - clientX;
    if (Math.abs(distance) > 45) {
      goToImage(activeIndex + (distance > 0 ? 1 : -1));
    }

    setTouchStart(null);
  };

  return (
    <div className="space-y-3 md:grid md:grid-cols-[84px_minmax(0,1fr)] md:gap-4 md:space-y-0">
      {hasMultipleImages && (
        <div className="order-2 hidden gap-3 md:flex md:flex-col">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goToImage(index)}
              className={cn(
                "aspect-square overflow-hidden rounded-md border bg-muted transition-colors",
                activeIndex === index ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-primary/50",
              )}
              aria-label={`Ver imagen ${index + 1} de ${productTitle}`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" loading={index > 2 ? "lazy" : "eager"} />
            </button>
          ))}
        </div>
      )}

      <div
        className="relative overflow-hidden rounded-lg bg-muted"
        onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="aspect-square w-full">
          <img src={activeImage} alt={productTitle} className="h-full w-full object-cover" />
        </div>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={() => goToImage(activeIndex - 1)}
              className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background md:inline-flex"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToImage(activeIndex + 1)}
              className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background md:inline-flex"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1.5 backdrop-blur md:hidden">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => goToImage(index)}
                  className={cn("h-1.5 rounded-full transition-all", activeIndex === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40")}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => goToImage(index)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted transition-colors",
                activeIndex === index ? "border-primary" : "border-border",
              )}
              aria-label={`Ver imagen ${index + 1} de ${productTitle}`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
