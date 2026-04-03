import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useOrderTracking() {
  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem('activeOrderId');
  });
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeOrderId) return;

    const fetchInitialStatus = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('id', activeOrderId)
        .single();
      
      if (!error && data) {
        setOrderStatus(data.status);
      }
      setLoading(false);
    };

    fetchInitialStatus();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-status-${activeOrderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${activeOrderId}`
        },
        (payload) => {
          setOrderStatus(payload.new.status);
          // Auto-clear if completed or cancelled
          if (['delivered', 'completed', 'cancelled'].includes(payload.new.status.toLowerCase())) {
             // We keep it for a while but maybe clear after some time?
             // For now just update state.
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOrderId]);

  const trackNewOrder = (orderId) => {
    localStorage.setItem('activeOrderId', orderId);
    setActiveOrderId(orderId);
  };

  const stopTracking = () => {
    localStorage.removeItem('activeOrderId');
    setActiveOrderId(null);
    setOrderStatus(null);
  };

  return { activeOrderId, orderStatus, loading, trackNewOrder, stopTracking };
}
