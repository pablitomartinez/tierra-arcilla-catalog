// export default Index;
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { PublicLayout } from "@/layouts/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { useActiveProducts } from "@/hooks/useProducts";
import { brand } from "@/config/brand";
import { ui } from "@/lib/ui";

import heroImage from "@/assets/hero-ceramic.jpg";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: products = [], isLoading } = useActiveProducts();

  const featured = products.slice(0, 6);

  return (
    <PublicLayout>
      {/* HERO */}
      <section id="" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Taller de cerámica artesanal de Tierra Arcilla"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-foreground/45" />
        </div>

        <div className={`${ui.container} relative ${ui.section.lg}`}>
          <div className="max-w-2xl space-y-6">
            <h1
              className={`
                ${ui.typography.hero}
                animate-fade-in
                font-heading
                font-bold
                text-primary-foreground
              `}
            >
              {brand.name}
            </h1>

            <p
              className={`
                ${ui.typography.body}
                animate-fade-in
                max-w-xl
                text-primary-foreground/90
                md:text-lg
              `}
              style={{ animationDelay: "0.15s" }}
            >
              {brand.description}
            </p>

            <div
              className="animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                asChild
                size="lg"
                className={`
                  ${ui.radius.pill}
                  gap-2
                  px-6
                  font-semibold
                `}
              >
                <Link to="/productos">
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="productos" className={`${ui.container} ${ui.section.md} scroll-mt-40`}>
        <div className="mb-8 space-y-3 text-center md:mb-10">
          <h2
            className={`
              ${ui.typography.sectionTitle}
              font-heading
              font-bold
              text-foreground
            `}
          >
            Nuestras Piezas
          </h2>

          <p
            className={`
              ${ui.typography.body}
              mx-auto
              max-w-2xl
              text-muted-foreground
            `}
          >
            Cada pieza es única, moldeada a mano con dedicación y materiales
            nobles.
          </p>
        </div>

        {isLoading ? (
          <div
            className={`
              grid
              grid-cols-2
              lg:grid-cols-3
              ${ui.grid.default}
            `}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton
                  className={`
                    aspect-square
                    w-full
                    ${ui.radius.card}
                  `}
                />

                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`
              grid
              grid-cols-2
              lg:grid-cols-3
              ${ui.grid.default}
            `}
          >
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className={`
              ${ui.radius.pill}
              gap-2
            `}
          >
            <Link to="/productos">
              Ver todos los productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* DESTACADOS */}
      <section id="destacados" className={`bg-secondary/40 ${ui.section.md} scroll-mt-40`}>
        <div className={`${ui.container}`}>
          <div className="mb-8 space-y-3 text-center md:mb-10">
            <span
              className="
                inline-block
                rounded-full
                bg-background
                px-4
                py-1
                text-sm
                font-medium
                text-muted-foreground
              "
            >
              Destacados
            </span>

            <h2
              className={`
                ${ui.typography.sectionTitle}
                font-heading
                font-bold
                text-foreground
              `}
            >
              Piezas que transforman espacios
            </h2>

            <p
              className={`
                ${ui.typography.body}
                mx-auto
                max-w-2xl
                text-muted-foreground
              `}
            >
              Selecciones especiales pensadas para acompañar momentos cotidianos
              con diseño artesanal, texturas naturales y detalles únicos.
            </p>
          </div>

          <div
            className="
              grid
              gap-4
              md:grid-cols-3
              md:gap-6
            "
          >
            {[
              {
                title: "Cerámica Artesanal",
                description:
                  "Cada pieza está modelada y trabajada a mano, respetando el carácter natural del barro.",
              },
              {
                title: "Diseño Atemporal",
                description:
                  "Objetos creados para integrarse con calidez en distintos estilos y espacios.",
              },
              {
                title: "Producción Limitada",
                description:
                  "Trabajamos en pequeñas cantidades para cuidar cada detalle del proceso.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`
                  ${ui.radius.card}
                  ${ui.shadow.base}
                  ${ui.transition.default}
                  border
                  bg-background
                  p-6
                  hover:-translate-y-1
                  ${ui.shadow.hover}
                `}
              >
                <h3
                  className="
                    mb-3
                    text-lg
                    font-semibold
                    text-foreground
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    text-sm
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="" className={`bg-secondary ${ui.section.md} scroll-mt-40`}>
        <div
          className={`
            ${ui.container}
            max-w-3xl
            space-y-6
            text-center
          `}
        >
          <h2
            className={`
              ${ui.typography.sectionTitle}
              font-heading
              font-bold
              text-secondary-foreground
            `}
          >
            Hecho a Mano, Hecho con Alma
          </h2>

          <p
            className={`
              ${ui.typography.body}
              text-secondary-foreground/80
              md:text-lg
            `}
          >
            En Tierra Arcilla creemos que cada objeto cuenta una historia.
            Nuestras piezas nacen del barro, del fuego y de la pasión por el
            oficio cerámico. Trabajamos con técnicas tradicionales, respetando
            los tiempos de la arcilla y buscando la belleza en lo imperfecto.
          </p>
        </div>
      </section>
      {/* NOSOTROS */}
      <section id="nosotros" className={`${ui.section.md} scroll-mt-40`}>
        <div
          className={`
            ${ui.container}
            grid
            items-center
            gap-10
            md:grid-cols-2
          `}
        >
          <div className="space-y-5">
            <span
              className="
                inline-block
                rounded-full
                bg-secondary
                px-4
                py-1
                text-sm
                font-medium
                text-secondary-foreground
              "
            >
              Nosotros
            </span>

            <h2
              className={`
                ${ui.typography.sectionTitle}
                font-heading
                font-bold
                text-foreground
              `}
            >
              Cerámica creada desde lo simple y lo auténtico
            </h2>

            <p
              className={`
                ${ui.typography.body}
                text-muted-foreground
              `}
            >
              Tierra Arcilla nace del deseo de volver a los procesos lentos,
              manuales y reales. Cada colección busca transmitir calma,
              conexión con la naturaleza y aprecio por los objetos hechos con
              intención.
            </p>

            <p
              className="
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Valoramos las formas orgánicas, las imperfecciones y la identidad
              única que surge en cada horneada. No buscamos producción masiva:
              buscamos piezas con carácter.
            </p>
          </div>

          <div
            className={`
              ${ui.radius.card}
              overflow-hidden
            `}
          >
            <img
              src={heroImage}
              alt="Proceso artesanal de Tierra Arcilla"
              className="
                h-full
                w-full
                object-cover
              "
            />
          </div>
        </div>
      </section>
      {/* CONTACTO  */}
      <section id="contacto" className={`bg-secondary ${ui.section.md} scroll-mt-40`}>
        <div
          className={`
            ${ui.container}
            max-w-3xl
            text-center
          `}
        >
          <span
            className="
              mb-4
              inline-block
              rounded-full
              bg-background
              px-4
              py-1
              text-sm
              font-medium
              text-muted-foreground
            "
          >
            Contacto
          </span>

          <h2
            className={`
              ${ui.typography.sectionTitle}
              font-heading
              font-bold
              text-secondary-foreground
            `}
          >
            Hablemos sobre tu próxima pieza
          </h2>

          <p
            className={`
              ${ui.typography.body}
              mx-auto
              mt-4
              max-w-2xl
              text-secondary-foreground/80
            `}
          >
            Si querés hacer un pedido, consultar disponibilidad o conocer más
            sobre nuestro trabajo artesanal, podés escribirnos y te responderemos
            a la brevedad.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className={`
                ${ui.radius.pill}
                px-6
                font-semibold
              `}
            >
              <Link to="/contacto">
                Ir a contacto
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;