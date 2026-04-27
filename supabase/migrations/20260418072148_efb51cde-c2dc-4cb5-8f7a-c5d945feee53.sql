
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Categories enum
CREATE TYPE public.product_category AS ENUM ('laptop', 'mobile', 'headphones', 'tv', 'cables', 'motherboard', 'battery', 'other');
CREATE TYPE public.product_status AS ENUM ('available', 'pending', 'sold');

-- Products (e-waste listings)
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category public.product_category NOT NULL,
  brand TEXT,
  condition TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  points_reward INTEGER NOT NULL DEFAULT 50,
  image_url TEXT,
  status public.product_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can list products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- Rewards catalog
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active rewards" ON public.rewards FOR SELECT USING (is_active = true);

-- Redemptions
CREATE TABLE public.redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
  points_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own redemptions" ON public.redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own redemptions" ON public.redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update timestamp helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Award points to seller when product is created
CREATE OR REPLACE FUNCTION public.award_seller_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET points = points + NEW.points_reward WHERE user_id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_product_listed
AFTER INSERT ON public.products
FOR EACH ROW EXECUTE FUNCTION public.award_seller_points();

-- Deduct points on redemption
CREATE OR REPLACE FUNCTION public.deduct_redemption_points()
RETURNS TRIGGER AS $$
DECLARE
  current_points INTEGER;
BEGIN
  SELECT points INTO current_points FROM public.profiles WHERE user_id = NEW.user_id;
  IF current_points < NEW.points_spent THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  UPDATE public.profiles SET points = points - NEW.points_spent WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_redemption_created
BEFORE INSERT ON public.redemptions
FOR EACH ROW EXECUTE FUNCTION public.deduct_redemption_points();

-- Seed rewards
INSERT INTO public.rewards (name, description, points_required, stock) VALUES
('Amazon ₹100 Gift Card', 'Use across Amazon India for any purchase.', 500, 50),
('Plant a Tree in Your Name', 'We plant a sapling and send you a certificate.', 200, 200),
('Eco Reusable Tote Bag', 'Premium organic cotton tote with our logo.', 300, 80),
('Bamboo Toothbrush Set', 'Set of 4 biodegradable bamboo toothbrushes.', 250, 100),
('Solar Power Bank 10000mAh', 'Charge your phone with the power of the sun.', 1500, 20),
('Movie Ticket Voucher', 'One free movie ticket at PVR or INOX.', 800, 30);
