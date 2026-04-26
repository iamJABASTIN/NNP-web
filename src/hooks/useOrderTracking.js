import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const BILL_EXPIRY_MS = 1.5 * 60 * 60 * 1000; // 1.5 hours after bill download/share
const INACTIVITY_EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours of no new items

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
            bill_requested_at,
            last_activity_at,
            session_id,
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
          stopTracking(isSessionClosed);
          return;
        }

        // --- Hybrid auto-expiry checks ---
        const now = Date.now();

        // Timer 1: 1.5hr after bill PDF was downloaded/shared
        if (data.bill_requested_at) {
          const elapsed = now - new Date(data.bill_requested_at).getTime();
          if (elapsed > BILL_EXPIRY_MS) {
            console.log('Bill expiry reached (1.5hr since download), closing session');
            await closeSessionInDB(data.session_id);
            stopTracking(true);
            return;
          }
        }

        // Timer 2: 3hr since last item was added (inactivity)
        if (data.last_activity_at) {
          const elapsed = now - new Date(data.last_activity_at).getTime();
          if (elapsed > INACTIVITY_EXPIRY_MS) {
            console.log('Inactivity expiry reached (3hr since last item), closing session');
            await closeSessionInDB(data.session_id);
            stopTracking(true);
            return;
          }
        }

        setOrderStatus(data.status);
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
             stopTracking(false);
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

  const closeSessionInDB = async (sessionId) => {
    if (!sessionId) return;
    try {
      await supabase
        .from('table_sessions')
        .update({ status: 'completed', closed_at: new Date().toISOString() })
        .eq('id', sessionId);
    } catch (err) {
      console.error('Failed to close session in DB:', err);
    }
  };

  const stopTracking = async (shouldSignOut = false) => {
    localStorage.removeItem('activeOrderId');
    setActiveOrderId(null);
    setOrderStatus(null);
    if (shouldSignOut) {
      await supabase.auth.signOut();
    }
  };

  return { activeOrderId, orderStatus, loading, trackNewOrder, stopTracking };
}
