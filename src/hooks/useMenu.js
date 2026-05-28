import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useMenu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch categories ordered by display_order
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('id, restaurant_id, name, name_ta, display_order, is_active')
          .order('display_order', { ascending: true });

        if (catError) throw catError;
        setCategories(catData);

        // Fetch available menu items
        const { data: itemData, error: itemError } = await supabase
          .from('menu_items')
          .select('id, restaurant_id, category_id, name, name_ta, description, description_ta, price, image_url, veg_type, spice_level, is_available, is_featured, prep_time_mins')
          .eq('is_available', true)
          .eq('is_deleted', false);

        if (itemError) throw itemError;
        setItems(itemData);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { categories, items, loading };
}
