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
    if (user && tableId) {
      const recoverSession = async () => {
        const { data: memberData } = await supabase
          .from('session_members')
          .select('session_id, table_sessions(*)')
          .eq('user_id', user.id)
          .eq('table_sessions.table_id', tableId)
          .eq('table_sessions.status', 'active')
          .single();

        if (memberData?.table_sessions) {
          setActiveSession(memberData.table_sessions);
        }
      };
      recoverSession();
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
        const searchName = orderType === 'takeout' ? 'Takeout' : manualTableName;
        const { data: tableData } = await supabase
          .from('tables')
          .select('id')
          .ilike('table_number', searchName)
          .single();
        resolvedTableId = tableData?.id || null;
      }

      let currentUser = user || await checkIn(nickname, mobile);
      let session = activeSession;
      
      if (!session) {
        if (sessionCode) {
          session = await joinSession(resolvedTableId, sessionCode);
        } else {
          const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';
          session = await startSession(resolvedTableId, DEFAULT_RID);
        }
      }

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
        .select().single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: newOrder.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        station: item.station || 'Main Kitchen'
      }));

      await supabase.from('order_items').insert(orderItems);
      
      setCart([]);
      setShowCheckIn(false);
      return { order: newOrder, total: totalAmount };
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
    sessionLoading, handleCheckoutConfirm
  };
}
