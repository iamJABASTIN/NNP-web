import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useMenu } from './useMenu';
import { useSession } from './useSession';

export function useMenuPage(tableId) {
  const { categories, items, loading: menuLoading } = useMenu();
  const { user, checkIn, joinSession, startSession } = useSession();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [mobile, setMobile] = useState('');
  const [orderType, setOrderType] = useState('dine_in');
  const [manualTableName, setManualTableName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [sessionLoading, setSessionLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [vegFilter, setVegFilter] = useState('all');

  useEffect(() => {
    if (user) {
      // Pre-fill nickname and mobile from user metadata if available
      if (user.user_metadata?.display_name) setNickname(user.user_metadata.display_name);
      if (user.user_metadata?.mobile_number) setMobile(user.user_metadata.mobile_number);

      if (tableId) {
        const recoverSession = async () => {
          try {
            const { data: memberData, error: recoverErr } = await supabase
              .from('session_members')
              .select('session_id, table_sessions(*)')
              .eq('user_id', user.id)
              .eq('table_sessions.table_id', tableId)
              .eq('table_sessions.status', 'active')
              .maybeSingle();

            if (recoverErr) {
              console.error('Session recovery error:', recoverErr);
              return;
            }

            if (memberData?.table_sessions) {
              console.log('Recovered active session:', memberData.table_sessions.id);
              setActiveSession(memberData.table_sessions);
            }
          } catch (err) {
            console.error('Failed to recover session:', err);
          }
        };
        recoverSession();
      }
    }
  }, [user, tableId]);

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find(i => i.id === itemId);
    if (!existing) return;
    if (existing.quantity === 1) {
      setCart(cart.filter(i => i.id !== itemId));
    } else {
      setCart(cart.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
    }
  };

  const handleCheckoutConfirm = async () => {
    if (!nickname.trim()) throw new Error('Please enter a nickname');
    
    setSessionLoading(true);
    try {
      let resolvedTableId = tableId;
      if (!resolvedTableId) {
        if (orderType === 'dine_in' && !manualTableName.trim()) {
          throw new Error('Please enter a table number for Dine In.');
        }

        const searchName = orderType === 'takeout' ? 'Takeout' : manualTableName;
        const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';
        
        const { data: tableData, error: tableFetchError } = await supabase
          .from('tables')
          .select('id')
          .eq('restaurant_id', DEFAULT_RID)
          .eq('table_number', searchName)
          .maybeSingle();

        if (tableFetchError || !tableData) {
          if (orderType === 'takeout') {
            throw new Error('Takeout mode is currently unavailable. Please contact staff.');
          }
          throw new Error(`Table "${manualTableName}" not found. Please enter a valid table number.`);
        }
        resolvedTableId = tableData.id;
      }

      // 1. Authenticate / Check-in
      let currentUser = user;
      if (!currentUser) {
        console.log('No user session, performing anonymous check-in...');
        currentUser = await checkIn(nickname, mobile);
      }
      
      // 2. Ensure Session
      let session = activeSession;
      if (!session) {
        if (sessionCode) {
          console.log('Joining existing session with code:', sessionCode);
          session = await joinSession(resolvedTableId, sessionCode);
        } else {
          console.log('Starting new session for table:', resolvedTableId);
          const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';
          session = await startSession(resolvedTableId, DEFAULT_RID);
        }
        setActiveSession(session);
      }

      if (!session || !session.id) {
        throw new Error('Failed to establish a valid table session.');
      }

      // 3. Create Order
      const totalAmount = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          session_id: session.id,
          user_id: currentUser.id,
          restaurant_id: session.restaurant_id,
          table_id: resolvedTableId,
          total_amount: totalAmount
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Order failed: ${orderError.message}`);
      }

      // 4. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: newOrder.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        station: item.station || 'Main Kitchen'
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        console.error('Order items insertion error:', itemsError);
        throw new Error(`Failed to add items to order: ${itemsError.message}`);
      }
      
      setCart([]);
      setShowCheckIn(false);
      return { order: newOrder, total: totalAmount };
    } catch (err) {
      console.error('Checkout error:', err);
      throw err;
    } finally {
      setSessionLoading(false);
    }
  };

  const addToExistingOrder = async (orderId) => {
    if (cart.length === 0) throw new Error('Cart is empty');

    setSessionLoading(true);
    try {
      // Insert new items into the existing order
      const orderItems = cart.map(item => ({
        order_id: orderId,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        station: item.station || 'Main Kitchen'
      }));

      const { error: insertErr } = await supabase.from('order_items').insert(orderItems);
      if (insertErr) throw insertErr;

      // Recalculate the total_amount by fetching all items for this order
      // This is safer than adding to the existing total which might be stale
      const { data: allItems, error: itemsFetchErr } = await supabase
        .from('order_items')
        .select('unit_price, quantity')
        .eq('order_id', orderId);

      if (itemsFetchErr) throw itemsFetchErr;

      const newTotal = (allItems || []).reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);

      const { error: updateErr } = await supabase
        .from('orders')
        .update({ total_amount: newTotal })
        .eq('id', orderId);

      if (updateErr) throw updateErr;

      setCart([]);
      return { orderId, newTotal };
    } finally {
      setSessionLoading(false);
    }
  };

  return {
    categories, items, loading: menuLoading, cart, addToCart, removeFromCart,
    searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
    vegFilter, setVegFilter, showCheckIn, setShowCheckIn,
    nickname, setNickname, mobile, setMobile, orderType, setOrderType,
    manualTableName, setManualTableName, sessionCode, setSessionCode,
    sessionLoading, handleCheckoutConfirm, addToExistingOrder
  };
}
