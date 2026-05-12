import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { useActiveProducts } from "@/hooks/useProducts";
import { brand } from "@/config/brand";
import heroImage from "@/assets/hero-ceramic.jpg";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: products = [], isLoading } = useActiveProducts();
  const featured = products.slice(0, 6);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Taller de cerámica artesanal de Tierra Arcilla" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/45" />
        </div>
        <div className="container relative py-20 md:py-36 lg:py-44">
          <div className="max-w-2xl space-y-6">
            <h1 className="animate-fade-in font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {brand.name}
            </h1>
            <p className="animate-fade-in text-lg leading-relaxed text-primary-foreground/90 md:text-xl" style={{ animationDelay: "0.15s" }}>
              {brand.description}
            </p>
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                <Link to="/productos">
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="mb-8 space-y-3 text-center md:mb-10">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Nuestras Piezas</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Cada pieza es única, moldeada a mano con dedicación y materiales nobles.
          </p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center md:mt-12">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/productos">
              Ver todos los productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-secondary py-14 md:py-20">
        <div className="container max-w-3xl space-y-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-secondary-foreground md:text-4xl">Hecho a Mano, Hecho con Alma</h2>
          <p className="text-base leading-relaxed text-secondary-foreground/80 md:text-lg">
            En Tierra Arcilla creemos que cada objeto cuenta una historia. Nuestras piezas nacen del barro, del fuego y de la pasión por el oficio cerámico. Trabajamos con técnicas tradicionales, respetando los tiempos de la arcilla y buscando la belleza en lo imperfecto.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
