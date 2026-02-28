
-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed categories from existing product data
INSERT INTO public.categories (name, slug) VALUES
  ('Bowls', 'bowls'),
  ('Jarrones', 'vases'),
  ('Platos', 'plates'),
  ('Tazas', 'mugs'),
  ('Macetas', 'planters'),
  ('Bandejas', 'trays');

-- Add category_id column to products
ALTER TABLE public.products ADD COLUMN category_id uuid REFERENCES public.categories(id);

-- Populate category_id from existing category text
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = p.category;

-- Make category_id NOT NULL after population
ALTER TABLE public.products ALTER COLUMN category_id SET NOT NULL;

-- Drop old category text column
ALTER TABLE public.products DROP COLUMN category;
