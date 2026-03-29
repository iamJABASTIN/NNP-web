import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Search, 
  Info, 
  UtensilsCrossed, 
  Salad, 
  Drumstick,
  User,
  Hash,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMenu } from '../hooks/useMenu';
import { useSession } from '../hooks/useSession';

const MenuPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
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
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'non_veg' | 'egg'

  // Set default category to first one when loaded
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === 'all') {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

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

  // Handle Add to Cart
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

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVeg = vegFilter === 'all' || item.veg_type === vegFilter;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  if (menuLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-24">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 border-2 border-black hover:bg-accent transition-all shadow-[2px_2px_0px_#000000]"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Smart<span className="text-accent italic">.</span>Menu
          </h1>
        </div>
        
        {tableId && (
          <div className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded-none border-2 border-black shadow-[2px_2px_0px_#f2ca50]">
            Table {tableId}
          </div>
        )}
      </header>

      {/* ─── Search & Category Bar ─── */}
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative border-4 border-black bg-white group focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
            <input 
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 outline-none font-bold uppercase text-xs"
            />
          </div>

          {/* Compact Diet Toggles */}
          <button
            onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
            className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all active:scale-95 shadow-[4px_4px_0px_#000000] ${
              vegFilter === 'veg' ? 'bg-green-600 text-white' : 'bg-white'
            }`}
          >
            <Salad size={22} className={vegFilter === 'veg' ? 'text-white' : 'text-green-600'} />
          </button>
          
          <button
            onClick={() => setVegFilter(vegFilter === 'non_veg' ? 'all' : 'non_veg')}
            className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all active:scale-95 shadow-[4px_4px_0px_#000000] ${
              vegFilter === 'non_veg' ? 'bg-red-600 text-white' : 'bg-white'
            }`}
          >
            <Drumstick size={22} className={vegFilter === 'non_veg' ? 'text-white' : 'text-red-600'} />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar items-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${
              selectedCategory === 'all' 
                ? 'bg-accent shadow-[2px_2px_0px_#000000]' 
                : 'bg-white hover:bg-muted/30'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-accent shadow-[2px_2px_0px_#000000]' 
                  : 'bg-white hover:bg-muted/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Menu Grid ─── */}
      <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="flex flex-col border-4 border-black bg-white shadow-[4px_4px_0px_#000000] overflow-hidden group hover:-translate-y-1 transition-transform"
          >
            {/* Image Section */}
            <div className="aspect-square bg-muted/20 border-b-4 border-black relative overflow-hidden flex-shrink-0">
               {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               ) : (
                  <UtensilsCrossed className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/10" size={32} />
               )}
               
               {/* Diet Indicator Badge */}
               <div className="absolute top-2 right-2 z-10">
                 <div className={`w-5 h-5 border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_#000000] ${item.veg_type === 'veg' ? 'bg-green-100' : 'bg-red-100'}`}>
                   <div className={`w-2 h-2 rounded-full ${item.veg_type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                 </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="p-3 md:p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <h3 className="text-xs md:text-sm font-black uppercase leading-tight line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                  {item.name}
                </h3>
                <p className="hidden md:block text-[10px] text-black/60 font-medium leading-tight mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-sm md:text-lg font-black italic">₹{item.price}</span>
                
                {cart.find(i => i.id === item.id) ? (
                  <div className="flex items-center justify-between bg-accent border-2 border-black p-1">
                    <button onClick={() => removeFromCart(item.id)} className="p-1 hover:scale-125 transition-transform"><Minus size={14} className="stroke-[3px]"/></button>
                    <span className="text-xs font-black">{cart.find(i => i.id === item.id).quantity}</span>
                    <button onClick={() => addToCart(item)} className="p-1 hover:scale-125 transition-transform"><Plus size={14} className="stroke-[3px]"/></button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest border-r-2 border-b-2 border-accent hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Cart FAB ─── */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-50"
          >
            <button 
              onClick={() => setShowCheckIn(true)}
              className="w-full bg-accent border-4 border-black p-4 shadow-[8px_8px_0px_#000000] flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black rounded-none">
                    {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                </div>
                <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-black/40">View Order</p>
                    <p className="text-sm font-black uppercase tracking-tight">Checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-black italic">₹{cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)}</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Check-In Modal ─── */}
      <AnimatePresence>
        {showCheckIn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-[400px] bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#f2ca50] relative"
            >
              <button 
                onClick={() => setShowCheckIn(false)}
                className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors"
              >
                ×
              </button>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Check-in</p>
                <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Who's Dining?</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">Your Nickname</label>
                  <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. Sam"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">Session Code (Optional)</label>
                  <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. AB1234"
                      maxLength={6}
                      value={sessionCode}
                      onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                      className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase tracking-[0.4em]"
                    />
                  </div>
                  <p className="text-[8px] font-bold text-black/40 px-1">Leave empty to start a new group session.</p>
                </div>

                <button 
                  onClick={async () => {
                    if (!nickname.trim()) return alert('Please enter a nickname');
                    setSessionLoading(true);
                    try {
                      // 1. Auth (Anonymous)
                      let currentUser = user;
                      if (!user) {
                        currentUser = await checkIn(nickname);
                      }

                      // 2. Session Management
                      let session = activeSession;
                      if (!session) {
                        if (sessionCode) {
                          session = await joinSession(tableId, sessionCode);
                        } else {
                          // TODO: Fetch real restaurant_id if needed, using default for now
                          const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';
                          session = await startSession(tableId, DEFAULT_RID);
                        }
                      }

                      // 3. Create Order
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

                      // 4. Create Order Items
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

                      // 5. Success
                      setCart([]);
                      setShowCheckIn(false);
                      alert('Order Placed Successfully! Kitchen is preparing your meal.');
                    } catch (err) {
                      console.error('Order error:', err);
                      alert(err.message || 'Failed to place order. Try again.');
                    } finally {
                      setSessionLoading(false);
                    }
                  }}
                  disabled={sessionLoading}
                  className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50"
                >
                  {sessionLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                  ) : (
                    <>
                      <span>Ready to Order</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
