import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSession } from './useSession';

export function useOrderHistory() {
  const { user } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch orders with their items and check if a review exists
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          table:tables(table_number),
          order_items(
            *,
            menu_item:menu_items(name, name_ta, price, veg_type)
          ),
          reviews(id)
        `)
        .eq('user_id', user.id)
        .order('placed_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching order history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  return { orders, loading, error, refetch: fetchOrders };
}
