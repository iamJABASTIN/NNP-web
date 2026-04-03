import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useMenu } from '../hooks/useMenu';
import { useSession } from '../hooks/useSession';
import MenuHeader from '../components/Menu/MenuHeader';
import MenuControls from '../components/Menu/MenuControls';
import MenuItemCard from '../components/Menu/MenuItemCard';
import CartFAB from '../components/Menu/CartFAB';
import CheckInModal from '../components/Menu/CheckInModal';

const MenuPage = () => {
  const { tableId } = useParams();
  const { categories, items, loading: menuLoading } = useMenu();
  const { user, checkIn, joinSession, startSession } = useSession();

  // Local UI State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [sessionLoading, setSessionLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [vegFilter, setVegFilter] = useState('all');


  // Session Recovery
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
    if (existing.quantity === 1) {
      setCart(cart.filter(i => i.id !== itemId));
    } else {
      setCart(cart.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVeg = vegFilter === 'all' || item.veg_type === vegFilter;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  const handleCheckoutConfirm = async () => {
    if (!nickname.trim()) return alert('Please enter a nickname');
    setSessionLoading(true);
    try {
      let currentUser = user;
      if (!user) {
        currentUser = await checkIn(nickname);
      }

      let session = activeSession;
      if (!session) {
        if (sessionCode) {
          session = await joinSession(tableId, sessionCode);
        } else {
          const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';
          session = await startSession(tableId, DEFAULT_RID);
        }
      }

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          session_id: session.id,
          user_id: currentUser.id,
          restaurant_id: session.restaurant_id,
          table_id: tableId,
          total_amount: cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: newOrder.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        station: item.station || 'Main Kitchen'
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setCart([]);
      setShowCheckIn(false);
      alert('Order Placed Successfully! Kitchen is preparing your meal.');
    } catch (err) {
      console.error('Order error:', err);
      alert(err.message || 'Failed to place order. Try again.');
    } finally {
      setSessionLoading(false);
    }
  };

  if (menuLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-24">
      <MenuHeader tableId={tableId} />

      <MenuControls 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        categories={categories}
        vegFilter={vegFilter} setVegFilter={setVegFilter}
      />

      <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard 
            key={item.id}
            item={item}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>

      <CartFAB cart={cart} onClick={() => setShowCheckIn(true)} />

      <CheckInModal 
        show={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        nickname={nickname} setNickname={setNickname}
        sessionCode={sessionCode} setSessionCode={setSessionCode}
        loading={sessionLoading}
        onConfirm={handleCheckoutConfirm}
      />
    </div>
  );
};

export default MenuPage;
