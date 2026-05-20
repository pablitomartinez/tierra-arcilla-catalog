import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/ui";
import { brand } from "@/config/brand";

// 📌 Idealmente, actualiza estos links por fotos horizontales de alta resolución (mínimo 1920x1080)
const heroImages = [
  "https://images.unsplash.com/photo-1666818398872-73d9d88ab0b1?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1604249180535-583716d9ec33?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6 segundos para dar más tiempo de lectura
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <section 
      id="hero" 
      /* 🔥 CORRECCIÓN CLAVE: 
        Cambiamos h-[100dvh] por un cálculo dinámico o una altura fija adaptativa 
        para que la barra de navegación no lo empuje hacia abajo creando scroll vertical.
      */
      className="relative w-full h-[calc(100dvh-140px)] md:h-[calc(100dvh-180px)] min-h-[500px] flex flex-col justify-center overflow-hidden bg-stone-100"
    >
      {/* 1. COMPONENTE DE IMÁGENES DE FONDO */}
      <HeroBackground images={heroImages} currentSlide={currentSlide} />

      {/* 2. CONTENIDO PRINCIPAL TEXTO + BOTÓN */}
      <HeroContent name={brand.name} description={brand.description} />

      {/* 3. CONTROLES MANUALES DEL CARRUSEL */}
      <HeroNavigation 
        totalSlides={heroImages.length} 
        currentSlide={currentSlide} 
        onPrev={prevSlide} 
        onNext={nextSlide} 
        onSelect={setCurrentSlide} 
      />
    </section>
  );
}

/* ==========================================
   SUB-COMPONENTES AUXILIARES MODULARIZADOS
   ========================================== */

interface BackgroundProps {
  images: string[];
  currentSlide: number;
}

function HeroBackground({ images, currentSlide }: BackgroundProps) {
  return (
    <div className="absolute inset-0 z-0">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt={`Tierra Arcilla banner - Imagen ${index + 1}`}
            /* 🔥 object-cover mantiene la proporción. 
              Si notas que se corta el producto, puedes cambiar 'object-center' por 'object-bottom' o 'object-top'
            */
            className="h-full w-full object-cover object-center transform scale-105 transition-transform duration-[6000s] ease-out"
          />
          {/* Capa oscura (Overlay) para que las letras blancas de tu marca se lean perfectamente */}
          <div className="absolute inset-0 bg-black/40 md:bg-black/35 backdrop-blur-[0.5px]" />
        </div>
      ))}
    </div>
  );
}

interface ContentProps {
  name: string;
  description: string;
}

function HeroContent({ name, description }: ContentProps) {
  return (
    <div className={`${ui.container || "container mx-auto px-4"} relative z-10 w-full`}>
      <div className="max-w-2xl space-y-4 md:space-y-6 text-left text-white">
        <h1
          className={`
            ${ui.typography?.hero || "text-4xl md:text-6xl"}
            animate-fade-in
            font-heading
            font-bold
            tracking-tight
          `}
        >
          {name}
        </h1>

        <p
          className={`
            ${ui.typography?.body || "text-base md:text-lg"}
            animate-fade-in
            max-w-lg
            text-white/90
            leading-relaxed
          `}
          style={{ animationDelay: "0.15s" }}
        >
          {description}
        </p>

        <div className="animate-fade-in pt-2" style={{ animationDelay: "0.3s" }}>
          <Button
            asChild
            size="lg"
            className={`
              ${ui.radius?.pill || "rounded-full"}
              gap-2
              px-6
              font-semibold
              bg-[#b85c37] hover:bg-[#a04e2e] text-white border-none
            `}
          >
            <Link to="/productos" className="flex items-center gap-2">
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavigationProps {
  totalSlides: number;
  currentSlide: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

function HeroNavigation({ totalSlides, currentSlide, onPrev, onNext, onSelect }: NavigationProps) {
  if (totalSlides <= 1) return null;

  return (
    <>
      {/* Botón Izquierdo */}
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all focus:outline-none md:flex"
        aria-label="Anterior slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      {/* Botón Derecho */}
      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all focus:outline-none md:flex"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Indicadores inferiores (Puntitos) */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "w-6 bg-white" 
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}