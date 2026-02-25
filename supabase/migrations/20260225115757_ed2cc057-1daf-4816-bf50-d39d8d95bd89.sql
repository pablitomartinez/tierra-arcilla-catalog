
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'bowls',
  image TEXT NOT NULL DEFAULT '/placeholder.svg',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Products: anyone can read active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true);

-- Products: admins can view all products (including inactive)
CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Products: admins can insert
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products: admins can update
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Products: admins can delete
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins can read roles
CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default products
INSERT INTO public.products (title, slug, description, price, category, image, active) VALUES
  ('Bowl Terracota Clásico', 'bowl-terracota-clasico', 'Bowl artesanal de terracota, ideal para ensaladas y servir en la mesa. Acabado suave al tacto con esmalte natural.', 2800, 'bowls', '/products/bowl-terracotta.jpg', true),
  ('Jarrón Crema Orgánico', 'jarron-crema-organico', 'Jarrón de formas orgánicas con esmalte crema mate. Perfecto como pieza decorativa o para flores secas.', 4500, 'vases', '/products/vase-cream.jpg', true),
  ('Set de Platos Rústicos', 'set-platos-rusticos', 'Set de 3 platos en gres con esmalte moteado y borde de terracota. Aptos para uso diario y lavavajillas.', 5200, 'plates', '/products/plate-set.jpg', true),
  ('Taza Drip Marrón', 'taza-drip-marron', 'Taza con efecto drip en esmalte marrón sobre base clara. Capacidad 350ml, perfecta para café o té.', 1800, 'mugs', '/products/mug-brown.jpg', true),
  ('Maceta Sage con Suculenta', 'maceta-sage-suculenta', 'Maceta artesanal con esmalte verde salvia y base de terracota expuesta. Incluye suculenta de regalo.', 2200, 'planters', '/products/planter-sage.jpg', true),
  ('Bandeja Ovalada Arena', 'bandeja-ovalada-arena', 'Bandeja ovalada en tono arena con textura moteada. Ideal para servir aperitivos o como pieza decorativa.', 3400, 'trays', '/products/tray-sand.jpg', true);
