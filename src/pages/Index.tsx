import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Instagram } from "lucide-react";

import { PublicLayout } from "@/layouts/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { useActiveProducts } from "@/hooks/useProducts";
import { brand } from "@/config/brand";
import { ui } from "@/lib/ui";

import heroImage from "@/assets/hero-ceramic.jpg";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/HeroSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";

const Index = () => {
  const { data: products = [], isLoading } = useActiveProducts();

  // 1. TODOS LOS PRODUCTOS (Para el carrusel principal)
  const allProductsCarousel = products.slice(0, 8);

  // 2. OPCIONES BOX
  const boxProducts = products
    .filter((p: any) => {
      const catName = p.categories?.name?.toLowerCase() || "";
      return catName.includes("box");
    })
    .slice(0, 4);

  return (
    <PublicLayout>
      {/* HERO */}
      <HeroSection />

      {/* CARRUSEL DE PRODUCTOS DESTACADOS */}
      <section id="destacados" className={`${ui.section.md} scroll-mt-20`}>
        <div className={ui.container}>
          <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className={`${ui.typography.sectionTitle} font-heading font-bold text-foreground`}>
                Productos Destacados
              </h2>
              <p className="text-muted-foreground mt-2">
                Explorá nuestra selección especial de {brand.name}.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link to="/productos">Ver todo el catálogo</Link>
            </Button>
          </div>

          {/* Carrusel */}
          {allProductsCarousel.length > 0 || isLoading ? (
            <FeaturedProductsSection featured={allProductsCarousel} isLoading={isLoading} />
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              Aún no hay productos disponibles.
            </p>
          )}
        </div>
      </section>

      {/* SECCIÓN BOX (Grilla estática de 4 productos) */}
      <section id="box" className={`bg-secondary/20 ${ui.section.md} scroll-mt-20`}>
        <div className={ui.container}>
          <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className={`${ui.typography.sectionTitle} font-heading font-bold text-foreground`}>
                Opciones BOX
              </h2>
              <p className="text-muted-foreground mt-2">
                Conjuntos y regalos armados con mucho amor.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link to="/productos">Ver todas las opciones</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className={`grid grid-cols-2 lg:grid-cols-4 ${ui.grid.default}`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className={`aspect-square w-full ${ui.radius.card}`} />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))}
            </div>
          ) : boxProducts.length > 0 ? (
            <div className={`grid grid-cols-2 lg:grid-cols-4 ${ui.grid.default}`}>
              {boxProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              Aún no hay opciones BOX disponibles.
            </p>
          )}

          <div className="mt-8 flex justify-center md:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/productos">Ver todas las opciones</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VALORES DE MARCA */}
      <section className={`bg-secondary/40 ${ui.section.md}`}>
        <div className={`${ui.container}`}>
          <div className="mb-8 space-y-3 text-center md:mb-10">
            <span className="inline-block rounded-full bg-background px-4 py-1 text-sm font-medium text-muted-foreground">
              Nuestra Esencia
            </span>
            <h2 className={`${ui.typography.sectionTitle} font-heading font-bold text-foreground`}>
              Piezas que transforman espacios
            </h2>
            <p className={`${ui.typography.body} mx-auto max-w-2xl text-muted-foreground`}>
              Selecciones especiales pensadas para acompañar momentos cotidianos
              con diseño artesanal, texturas naturales y detalles únicos.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              {
                title: "Cerámica Artesanal",
                description: "Cada pieza está modelada y trabajada a mano, respetando el carácter natural del barro.",
              },
              {
                title: "Diseño Atemporal",
                description: "Objetos creados para integrarse con calidez en distintos estilos y espacios.",
              },
              {
                title: "Producción Limitada",
                description: "Trabajamos en pequeñas cantidades para cuidar cada detalle del proceso.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`
                  ${ui.radius.card}
                  ${ui.shadow.base}
                  ${ui.transition.default}
                  border bg-background p-6
                  hover:-translate-y-1
                  ${ui.shadow.hover}
                `}
              >
                <h3 className="mb-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={`bg-secondary ${ui.section.md}`}>
        <div className={`${ui.container} max-w-3xl space-y-6 text-center`}>
          <h2 className={`${ui.typography.sectionTitle} font-heading font-bold text-secondary-foreground`}>
            Hecho a Mano, Hecho con Alma
          </h2>
          <p className={`${ui.typography.body} text-secondary-foreground/80 md:text-lg`}>
            En Tierra Arcilla creemos que cada objeto cuenta una historia.
            Nuestras piezas nacen del barro, del fuego y de la pasión por el
            oficio cerámico. Trabajamos con técnicas tradicionales, respetando
            los tiempos de la arcilla y buscando la belleza en lo imperfecto.
          </p>
        </div>
      </section>

      {/* NUEVO PUNTO DE VENTA: REGALARTE */}
      <section className="bg-zinc-950 py-16 md:py-24 text-zinc-50 border-y border-zinc-800">
        <div className={`${ui.container} flex flex-col items-center justify-between gap-12 md:flex-row`}>
          {/* Información y Texto */}
          <div className="space-y-6 md:w-1/2">
            <span className="inline-block rounded-full bg-zinc-800/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-zinc-300 uppercase">
              Nuevo Punto de Venta
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
              ¡Nuestros productos también están en <span className="text-amber-500">Regalarte</span>!
            </h2>
            <p className="text-zinc-400 md:text-lg leading-relaxed">
              <strong>Regalarte Emprendedor</strong> es un hermoso local exclusivo que revende productos de emprendedoras locales. ¡Ahora podés acercarte a conocer y llevarte nuestras creaciones de Tierra Arcilla en persona!
            </p>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 text-zinc-300 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <MapPin className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Senador Pérez 549 - Jujuy</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <Instagram className="h-5 w-5 text-amber-500" />
                <a
                  href="https://instagram.com/regalarteemprendedor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-amber-500 transition-colors"
                >
                  @regalarteemprendedor
                </a>
              </div>
            </div>
          </div>

          {/* Logo Container (Redondo, sin borde, más grande y responsive) */}
          <div className="flex w-full justify-center md:w-1/2 lg:w-5/12">
            <div className="flex aspect-square w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] items-center justify-center rounded-full bg-black p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              {/* Decoración de fondo sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-transparent"></div>

              {/* AQUI VA LA IMAGEN DEL LOGO BLANCO */}
              <img
                src="/regalarte.png"
                alt="Logo Regalarte Emprendedor"
                className="relative z-10 w-full h-auto object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className={`${ui.section.md} scroll-mt-20`}>
        <div className={`${ui.container} grid items-center gap-10 md:grid-cols-2`}>
          <div className="space-y-5">
            <span className="inline-block rounded-full bg-secondary px-4 py-1 text-sm font-medium text-secondary-foreground">
              Nosotros
            </span>
            <h2 className={`${ui.typography.sectionTitle} font-heading font-bold text-foreground`}>
              Haciendo de tus espacios lugares únicos 🌷
            </h2>
            <p className={`${ui.typography.body} text-muted-foreground leading-relaxed`}>
              {brand.description}
            </p>

            {/* Recuadro de Contacto y Ubicación */}
            <div className="mt-6 rounded-2xl bg-secondary/30 p-6 border border-border/50 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">📍 Dónde nos encontrás</h3>
                <p className="text-sm text-muted-foreground mt-1">{brand.address}</p>
              </div>
              <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">📱 Contacto</h3>
                  <p className="text-sm text-muted-foreground mt-1">{brand.whatsapp.displayNumber}</p>
                </div>
                <a
                  href={`https://wa.me/${brand.whatsapp.number}?text=${encodeURIComponent("Hola! Estuve viendo la web de Tierra Arcilla y quisiera hacerles una consulta.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  💬 Chatear por WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className={`${ui.radius.card} overflow-hidden shadow-lg`}>
            <img
              src={heroImage}
              alt="Productos artesanales de Tierra Arcilla"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className={`bg-secondary ${ui.section.md} scroll-mt-20`}>
        <div className={`${ui.container} max-w-3xl text-center`}>
          <span className="mb-4 inline-block rounded-full bg-background px-4 py-1 text-sm font-medium text-muted-foreground">
            Contacto
          </span>
          <h2 className={`${ui.typography.sectionTitle} font-heading font-bold text-secondary-foreground`}>
            Hablemos sobre tu próxima pieza
          </h2>
          <p className={`${ui.typography.body} mx-auto mt-4 max-w-2xl text-secondary-foreground/80`}>
            Si querés hacer un pedido, consultar disponibilidad o conocer más
            sobre nuestro trabajo artesanal, podés escribirnos y te responderemos
            a la brevedad.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className={`${ui.radius.pill} px-6 font-semibold`}>
              <a
                href={`https://wa.me/${brand.whatsapp.number}?text=${encodeURIComponent("¡Hola, Tierra Arcilla! Vi su página web y me gustaría hacerles una consulta.")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ir a WhatsApp
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;