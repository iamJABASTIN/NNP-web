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
          .select('*')
          .order('display_order', { ascending: true });

        if (catError) throw catError;
        setCategories(catData);

        // Fetch available menu items
        const { data: itemData, error: itemError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true);

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
