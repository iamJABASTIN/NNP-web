import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useOrderTracking() {
  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem('activeOrderId');
  });
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeOrderId) {
      setLoading(false);
      return;
    }

    const validateOrder = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            status,
            table_sessions!inner(status)
          `)
          .eq('id', activeOrderId)
          .maybeSingle();
        
        if (error || !data) {
          console.log('Order not found or error, clearing tracking');
          stopTracking();
          return;
        }

        const terminalStatuses = ['delivered', 'completed', 'cancelled', 'served'];
        const isTerminal = terminalStatuses.includes(data.status.toLowerCase());
        const isSessionClosed = data.table_sessions?.status !== 'active';

        if (isTerminal || isSessionClosed) {
          console.log('Order terminal or session closed, clearing tracking:', { isTerminal, isSessionClosed });
          stopTracking();
        } else {
          setOrderStatus(data.status);
        }
      } catch (err) {
        console.error('Order validation failed:', err);
      } finally {
        setLoading(false);
      }
    };

    validateOrder();

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
        async (payload) => {
          setOrderStatus(payload.new.status);
          
          // Double check session status on terminal update
          const terminalStatuses = ['delivered', 'completed', 'cancelled', 'served'];
          if (terminalStatuses.includes(payload.new.status.toLowerCase())) {
             stopTracking();
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
