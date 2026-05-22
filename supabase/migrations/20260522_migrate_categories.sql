-- Create the three new categories if they do not exist
INSERT INTO public.categories (restaurant_id, name, display_order, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'North Indian Foods', 1, true),
  ('00000000-0000-0000-0000-000000000001', 'South Indian Foods', 2, true),
  ('00000000-0000-0000-0000-000000000001', 'Chinese Foods', 3, true)
ON CONFLICT DO NOTHING;

-- Reassign existing menu items to the new categories using a subquery mapping
DO $$
DECLARE
  v_north_id UUID;
  v_south_id UUID;
  v_chinese_id UUID;
BEGIN
  -- Retrieve target IDs
  SELECT id INTO v_north_id FROM public.categories WHERE name = 'North Indian Foods' LIMIT 1;
  SELECT id INTO v_south_id FROM public.categories WHERE name = 'South Indian Foods' LIMIT 1;
  SELECT id INTO v_chinese_id FROM public.categories WHERE name = 'Chinese Foods' LIMIT 1;

  -- Punjabi -> North Indian Foods
  UPDATE public.menu_items
  SET category_id = v_north_id
  WHERE category_id IN (SELECT id FROM public.categories WHERE name = 'Punjabi');

  -- Tiffin, Parotta, Meals, Fish Roast -> South Indian Foods
  UPDATE public.menu_items
  SET category_id = v_south_id
  WHERE category_id IN (SELECT id FROM public.categories WHERE name IN ('Tiffin', 'Parotta', 'Meals', 'Fish Roast'));

  -- Fast Food, Soup, Chilli -> Chinese Foods
  UPDATE public.menu_items
  SET category_id = v_chinese_id
  WHERE category_id IN (SELECT id FROM public.categories WHERE name IN ('Fast Food', 'Soup', 'Chilli'));

  -- Delete all other categories now that their menu items are reassigned
  DELETE FROM public.categories 
  WHERE name NOT IN ('North Indian Foods', 'South Indian Foods', 'Chinese Foods');
END $$;
