import { Link } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { getActiveProducts } from "@/services/products";
import { brand } from "@/config/brand";
import heroImage from "@/assets/hero-ceramic.jpg";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const products = getActiveProducts().slice(0, 6);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Taller de cerámica artesanal de Tierra Arcilla"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="container relative py-24 md:py-40 lg:py-52">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-fade-in">
              {brand.name}
            </h1>
            <p
              className="text-lg md:text-xl text-primary-foreground/90 font-body leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              {brand.description}
            </p>
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-body font-semibold"
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

      {/* Featured Products */}
      <section className="container py-16 md:py-24">
        <div className="mb-10 text-center space-y-3">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Nuestras Piezas
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada pieza es única, moldeada a mano con dedicación y materiales nobles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 font-body"
          >
            <Link to="/productos">
              Ver todos los productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container max-w-3xl text-center space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground">
            Hecho a Mano, Hecho con Alma
          </h2>
          <p className="text-secondary-foreground/80 leading-relaxed text-lg">
            En Tierra Arcilla creemos que cada objeto cuenta una historia. Nuestras piezas nacen del
            barro, del fuego y de la pasión por el oficio cerámico. Trabajamos con técnicas
            tradicionales, respetando los tiempos de la arcilla y buscando la belleza en lo
            imperfecto.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
