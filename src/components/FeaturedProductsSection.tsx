import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard"; // Asegúrate de importar tu ProductCard real
import { ui } from "@/lib/ui";

export default function FeaturedProductsSection({ featured = [], isLoading }: { featured: any[]; isLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicamos la lista de productos para crear la ilusión del bucle infinito matemático
  const duplicatedProducts = [...featured, ...featured, ...featured];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isLoading || featured.length === 0) return;

    let animationFrameId: number;
    
    // Velocidad del desplazamiento automático continuo
    const speed = 0.6; 

    const startAutoScroll = () => {
      // Si el usuario tiene el mouse encima en Desktop, pausamos el movimiento
      if (!isHovered) {
        scrollContainer.scrollLeft += speed;

        const halfWidth = scrollContainer.scrollWidth / 3;
        // Si el scroll avanzó el equivalente a una tanda completa de productos, 
        // reseteamos al inicio sin transiciones bruscas
        if (scrollContainer.scrollLeft >= halfWidth * 2) {
          scrollContainer.scrollLeft = halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(startAutoScroll);
    };

    animationFrameId = requestAnimationFrame(startAutoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isLoading, featured.length]);

  return (
    <section 
      id="productos" 
      className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-background py-10 md:py-14 scroll-mt-20"
    >
      
      {/* CABECERA */}
      <div className={`${ui.container} text-center space-y-2 z-10`}>
        <h2 className={`${ui.typography.sectionTitle} font-heading font-bold text-foreground`}>
          Nuestras Piezas
        </h2>
        <p className={`${ui.typography.body} mx-auto max-w-2xl text-muted-foreground px-4`}>
          Cada pieza es única, moldeada a mano con dedicación y materiales nobles.
        </p>
      </div>

      {/* CONTENEDOR CENTRAL DEL CARRUSEL INFINITO */}
      <div 
        className="relative w-full my-auto py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={scrollRef}
          // En Desktop eliminamos el 'snap' para que el movimiento de autoplay sea perfectamente fluido y continuo
          className="flex w-full overflow-x-auto scrollbar-none gap-6 px-6 md:px-12"
          style={{ scrollbarWidth: 'none' }} 
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[85vw] sm:w-[45vw] md:w-[30%] shrink-0 space-y-3">
                <Skeleton className={`aspect-square w-full ${ui.radius.card}`} />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))
          ) : (
            duplicatedProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="w-[80vw] sm:w-[48vw] md:w-[calc(33.333%-16px)] shrink-0 transform transition-transform duration-300 hover:scale-[1.02]"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ACCIÓN INFERIOR */}
      <div className="text-center pt-2 z-10">
        <Button
          asChild
          variant="outline"
          size="lg"
          className={`${ui.radius.pill} gap-2 bg-transparent border-clay-dark text-clay-dark hover:bg-clay-dark hover:text-white transition-colors px-8`}
        >
          <Link to="/productos">
            Ver todos los productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

    </section>
  );
}