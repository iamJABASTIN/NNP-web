import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useOrderDetails(activeOrderId) {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeOrderId) {
      setItems([]);
      setTotalAmount(0);
      setOrderStatus(null);
      return;
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the order header
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .select('status, total_amount')
          .eq('id', activeOrderId)
          .single();

        if (orderErr) throw orderErr;

        setOrderStatus(order.status);
        setTotalAmount(order.total_amount);

        // Fetch order items with menu item names
        const { data: orderItems, error: itemsErr } = await supabase
          .from('order_items')
          .select('id, quantity, unit_price, menu_items ( name )')
          .eq('order_id', activeOrderId);

        if (itemsErr) throw itemsErr;

        const mapped = (orderItems || []).map(item => ({
          id: item.id,
          name: item.menu_items?.name || 'Unknown Item',
          quantity: item.quantity,
          unitPrice: item.unit_price,
          lineTotal: item.quantity * item.unit_price,
        }));

        setItems(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [activeOrderId]);

  return { items, totalAmount, orderStatus, loading, error };
}
