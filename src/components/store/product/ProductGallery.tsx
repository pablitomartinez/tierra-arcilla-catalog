import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types/productImage";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  coverImage?: string | null;
  productTitle: string;
  images?: ProductImage[];
}

export function ProductGallery({
  coverImage,
  productTitle,
  images = [],
}: ProductGalleryProps) {
  const fallbackImage = "/placeholder.svg";

  // Blindaje total contra duplicados de URLs
  const galleryImages = useMemo(() => {
    const rawUrls = [
      coverImage,
      ...(images?.map((image) => image.url) || []),
    ].filter((url): url is string => Boolean(url && typeof url === "string"));

    if (rawUrls.length === 0) {
      return [fallbackImage];
    }

    return Array.from(new Set(rawUrls));
  }, [coverImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // Solución definitiva al error 'add' de undefined: Usamos un array simple en lugar de new Set()
  const [failedImageUrls, setFailedImageUrls] = useState<string[]>([]);

  useEffect(() => {
    setActiveIndex((currentIndex) => Math.min(currentIndex, galleryImages.length - 1));
  }, [galleryImages]);

  const safeIndex = activeIndex >= galleryImages.length ? 0 : activeIndex;
  const activeImage = galleryImages[safeIndex] ?? fallbackImage;
  
  // Verificación segura con array en lugar de .has() de un Set potencialmente volátil
  const mainImageSrc = failedImageUrls.includes(activeImage) ? fallbackImage : activeImage;

  const hasMultipleImages = galleryImages.length > 1;

  const goToImage = (index: number) => {
    const nextIndex = (index + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIndex);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStart === null || !hasMultipleImages) return;
    const distance = touchStart - clientX;
    if (Math.abs(distance) > 45) {
      goToImage(safeIndex + (distance > 0 ? 1 : -1));
    }
    setTouchStart(null);
  };

  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-[72px_1fr] md:gap-4">
      {/* DESKTOP THUMBNAILS */}
      {hasMultipleImages && (
        <div className="hidden md:flex md:flex-col md:order-1 w-[72px] shrink-0 gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => goToImage(index)}
              className={cn(
                "aspect-square overflow-hidden rounded-xl border bg-muted transition-all duration-300 focus-visible:outline-none",
                safeIndex === index
                  ? "border-primary ring-2 ring-primary/15"
                  : "border-border hover:border-primary/50",
              )}
              aria-label={`Ver imagen ${index + 1} de ${productTitle}`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
                loading={index > 2 ? "lazy" : "eager"}
              />
            </button>
          ))}
        </div>
      )}

      {/* MAIN IMAGE */}
      <div
        className="relative aspect-square min-h-[240px] w-full min-w-0 overflow-hidden rounded-2xl bg-muted md:order-2"
        onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <img
          src={mainImageSrc}
          alt={productTitle}
          className="absolute inset-0 block h-full w-full object-cover object-center"
          onError={() => {
            if (activeImage !== fallbackImage && !failedImageUrls.includes(activeImage)) {
              setFailedImageUrls((current) => [...current, activeImage]);
            }
          }}
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={() => goToImage(safeIndex - 1)}
              className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none md:inline-flex"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => goToImage(safeIndex + 1)}
              className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none md:inline-flex"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1.5 backdrop-blur md:hidden">
              {galleryImages.map((image, index) => (
                <button
                  key={`dot-${image}-${index}`}
                  type="button"
                  onClick={() => goToImage(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    safeIndex === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40",
                  )}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* MOBILE THUMBNAILS */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
          {galleryImages.map((image, index) => (
            <button
              key={`mob-${image}-${index}`}
              type="button"
              onClick={() => goToImage(index)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-muted transition-all duration-300 focus-visible:outline-none",
                safeIndex === index ? "border-primary" : "border-border",
              )}
              aria-label={`Ver imagen ${index + 1} de ${productTitle}`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}