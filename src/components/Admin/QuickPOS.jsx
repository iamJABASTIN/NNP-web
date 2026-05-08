import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Users, 
  Smartphone, 
  Coffee, 
  ShoppingBag, 
  CheckCircle, 
  X,
  Zap,
  Loader2
} from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK, PRIMARY_YELLOW } from '../../constants/adminStyles';

// Sub-components would ideally be in separate files, but keeping here for now 
// to see the full logic before final split as per rules.

const QuickPOS = ({ editingOrderId, onCancelEdit }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    type: 'takeaway', // Default to takeaway for quick POS
    tableId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (editingOrderId) {
      loadOrderForEditing(editingOrderId);
    } else {
      // Reset to new order mode
      setCart([]);
      setCustomer({ name: '', phone: '', type: 'dine-in', tableId: '' });
    }
  }, [editingOrderId]);

  const loadOrderForEditing = async (id) => {
    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, profiles(display_name, phone), order_items(*, menu_items(*))')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (order) {
        setCustomer({
          name: order.profiles?.display_name || '',
          phone: order.profiles?.phone || '',
          type: order.table_id ? 'dine-in' : 'takeaway',
          tableId: order.table_id || ''
        });

        // Map order items to cart, PRESERVING historical price and status
        const cartItems = order.order_items.map(oi => ({
          ...oi.menu_items,
          id: oi.menu_item_id,
          name: oi.menu_items?.name || 'Unknown Item',
          price: parseFloat(oi.unit_price), // Use the price from when the order was placed
          quantity: oi.quantity,
          spice_level: oi.spice_level,
          customisation_note: oi.customisation_note,
          status: oi.status,
          station: oi.station,
          oi_id: oi.id,
          original_instructions: order.special_instructions
        }));
        setCart(cartItems);
      }
    } catch (err) {
      console.error("Failed to load order for editing:", err);
      alert("Error loading order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    const [menuRes, tableRes] = await Promise.all([
      supabase.from('menu_items')
        .select('*, categories(name)')
        .eq('is_available', true)
        .eq('is_deleted', false),
      supabase.from('tables').select('*').order('table_number')
    ]);
    setMenuItems(menuRes.data || []);
    setTables(tableRes.data || []);
    setLoading(false);
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    if (customer.type === 'dine-in' && !customer.tableId) {
      alert("Please select a table for dine-in order.");
      return;
    }

    setIsSubmitting(true);
    try {
      const DEFAULT_RID = '00000000-0000-0000-0000-000000000001';
      
      // 1. Handle Profile (Customer)
      let profileId = null;
      if (customer.phone) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', customer.phone)
          .maybeSingle();
        
        if (existingProfile) {
          profileId = existingProfile.id;
        } else if (customer.name) {
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: crypto.randomUUID(), // Explicitly generate ID for guest profile
              display_name: customer.name,
              phone: customer.phone,
              restaurant_id: DEFAULT_RID
            })
            .select()
            .single();
          if (profileError) throw profileError;
          profileId = newProfile?.id;
        }
      }

      // 2. Handle Session for Dine-in
      let sessionId = null;
      if (customer.type === 'dine-in') {
        const { data: activeSession } = await supabase
          .from('table_sessions')
          .select('id')
          .eq('table_id', customer.tableId)
          .eq('status', 'active')
          .maybeSingle();

        if (activeSession) {
          sessionId = activeSession.id;
        } else {
          const { data: newSession, error: sessionError } = await supabase
            .from('table_sessions')
            .insert({
              table_id: customer.tableId,
              restaurant_id: DEFAULT_RID,
              status: 'active'
            })
            .select()
            .single();
          if (sessionError) throw sessionError;
          sessionId = newSession?.id;
        }
      }

      let orderId = editingOrderId;
      const timestamp = new Date().toISOString();

      if (editingOrderId) {
        // UPDATE Existing Order
        // Get original instructions if available
        const originalNotes = cart[0]?.original_instructions || '';
        const editNote = `\n[Admin Edit at ${new Date().toLocaleTimeString()}]`;
        const newInstructions = originalNotes.includes('Admin POS Order') 
          ? originalNotes + editNote 
          : `Admin POS Order: ${customer.name || 'Guest'}${editNote}`;

        const { error: updateError } = await supabase
          .from('orders')
          .update({
            total_amount: totalAmount,
            table_id: customer.type === 'dine-in' ? customer.tableId : null,
            session_id: sessionId,
            user_id: profileId,
            restaurant_id: DEFAULT_RID, // Ensure RID is preserved/enforced
            is_manual: true,
            special_instructions: newInstructions,
            last_activity_at: timestamp
          })
          .eq('id', editingOrderId);

        if (updateError) throw updateError;

        // Atomic update for items: Delete and Re-insert
        // (Policy for DELETE on order_items has been added to allow this)
        const { error: deleteError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', editingOrderId);
        
        if (deleteError) throw deleteError;

      } else {
        // CREATE New Order
        const { data: order, error: orderError } = await supabase.from('orders').insert({
          total_amount: totalAmount,
          table_id: customer.type === 'dine-in' ? customer.tableId : null,
          session_id: sessionId,
          user_id: profileId,
          restaurant_id: DEFAULT_RID,
          status: 'pending',
          is_manual: true,
          special_instructions: `Admin POS Order: ${customer.name || 'Guest'}`,
          placed_at: timestamp,
          last_activity_at: timestamp
        }).select().single();

        if (orderError) throw orderError;
        orderId = order.id;
      }

      // 4. Create/Re-create order items
      const orderItemsData = cart.map(item => ({
        order_id: orderId,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        spice_level: item.spice_level || 0,
        customisation_note: item.customisation_note || null,
        status: item.status || 'pending',
        station: item.station || 'Main Kitchen'
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
      if (itemsError) throw itemsError;

      // 5. Update table status if dine-in
      if (customer.type === 'dine-in') {
        await supabase.from('tables').update({ status: 'occupied' }).eq('id', customer.tableId);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (editingOrderId) {
          onCancelEdit();
        } else {
          setCart([]);
          setCustomer({ name: '', phone: '', type: 'dine-in', tableId: '' });
          setSearchQuery('');
        }
      }, 1500);

    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Update failed: " + (err.message || "Check console for details"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Initializing POS...</div>;

  return (
    <div className="flex flex-col gap-6 h-full max-w-6xl mx-auto animate-in fade-in duration-500 pb-10">
      {/* Edit Mode Indicator */}
      {editingOrderId && (
        <div className={`bg-black text-white ${BORDER_BLACK} p-4 flex items-center justify-between animate-in slide-in-from-top duration-300`}>
          <div className="flex items-center gap-4">
            <div className="bg-[#f2ca50] text-black px-3 py-1 font-black text-[10px] uppercase tracking-widest">Edit Mode</div>
            <span className="font-black text-sm tracking-tighter uppercase italic">Modifying Order #{editingOrderId.slice(0, 8)}</span>
          </div>
          <button 
            onClick={onCancelEdit}
            className="flex items-center gap-2 px-4 py-1 border-2 border-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase"
          >
            <X size={14} /> Cancel Edit
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className={`bg-white ${BORDER_BLACK} ${SHADOW_BLACK} p-6 flex flex-wrap items-end gap-6`}>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Order Type</label>
          <div className="flex bg-gray-100 p-1 border-2 border-black">
            <button 
              onClick={() => setCustomer(c => ({...c, type: 'dine-in'}))}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase transition-all ${customer.type === 'dine-in' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <Coffee size={14} /> Dine-In
            </button>
            <button 
              onClick={() => setCustomer(c => ({...c, type: 'takeaway'}))}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase transition-all ${customer.type === 'takeaway' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <ShoppingBag size={14} /> Takeaway
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Customer Details</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="NAME"
              className={`flex-1 p-3 border-2 border-black focus:border-[#f2ca50] outline-none font-black text-xs uppercase`}
              value={customer.name}
              onChange={e => setCustomer(c => ({...c, name: e.target.value}))}
            />
            <input 
              type="text" 
              placeholder="PHONE"
              className={`flex-1 p-3 border-2 border-black focus:border-[#f2ca50] outline-none font-black text-xs uppercase`}
              value={customer.phone}
              onChange={e => setCustomer(c => ({...c, phone: e.target.value}))}
            />
          </div>
        </div>

        {customer.type === 'dine-in' && (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Table</label>
            <select 
              className={`p-3 border-2 border-black bg-white font-black text-xs uppercase outline-none focus:border-[#f2ca50]`}
              value={customer.tableId}
              onChange={e => setCustomer(c => ({...c, tableId: e.target.value}))}
            >
              <option value="">SELECT TABLE</option>
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  TABLE {t.table_number} ({t.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Search Section */}
      <div className="relative">
        <div className={`bg-white ${BORDER_BLACK} ${SHADOW_BLACK} p-4 flex items-center gap-4`}>
          <Search size={24} className="text-black/30" />
          <input 
            ref={searchInputRef}
            autoFocus
            type="text" 
            placeholder="SEARCH PRODUCTS (TYPE NAME AND HIT ENTER)"
            className="flex-1 bg-transparent border-none outline-none font-black text-xl uppercase tracking-tight placeholder:text-black/10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filteredItems.length > 0) {
                addToCart(filteredItems[0]);
              }
              if (e.key === 'Escape') {
                setSearchQuery('');
              }
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-gray-100 border-2 border-black">
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className={`absolute top-full left-0 right-0 z-10 mt-2 bg-white ${BORDER_BLACK} ${SHADOW_BLACK} max-h-60 overflow-y-auto`}>
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center font-black uppercase text-black/30 text-xs">No items found</div>
            ) : (
              filteredItems.map((item, idx) => (
                <button 
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`w-full p-4 flex items-center justify-between hover:bg-[#f2ca50] transition-colors border-b-2 border-black last:border-b-0 ${idx === 0 ? 'bg-[#f2ca50]/10' : ''}`}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-black text-sm uppercase">{item.name}</span>
                    <span className="text-[10px] font-bold text-black/40 uppercase">{item.categories?.name || 'Uncategorized'}</span>
                  </div>
                  <span className="font-black italic">₹{item.price}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className="flex-1 flex flex-col gap-4 min-h-[500px]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black uppercase italic border-b-4 border-black">Current Order</h3>
          <span className="font-black text-xs text-black/40 uppercase">{cart.length} ITEMS</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar min-h-[420px] max-h-[600px] border-2 border-black/5 p-2 bg-gray-50/30">
          {cart.length === 0 ? (
            <div className={`h-full min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed border-black/10 text-black/20 font-black uppercase tracking-widest`}>
              Empty Cart
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={`bg-white ${BORDER_BLACK} p-3 flex items-center justify-between animate-in slide-in-from-left duration-200 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex-1">
                  <h4 className="font-black uppercase text-[13px] leading-tight">{item.name}</h4>
                  <p className="text-[10px] font-bold text-black/40 italic">₹{item.price} per unit</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-black bg-white scale-90">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 hover:bg-black hover:text-white transition-all"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 hover:bg-black hover:text-white transition-all"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <div className="w-20 text-right">
                    <span className="font-black italic text-sm">₹{item.price * item.quantity}</span>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-600 hover:text-white border-2 border-transparent hover:border-black transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

        {/* Footer Summary */}
        <div className={`bg-black text-white p-6 ${BORDER_BLACK} flex items-center justify-between mt-auto`}>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Amount</span>
            <span className="text-4xl font-black italic tracking-tighter">₹{totalAmount}</span>
          </div>
          
          <button 
            disabled={cart.length === 0 || isSubmitting || (customer.type === 'dine-in' && !customer.tableId)}
            onClick={handleSubmit}
            className={`px-12 py-5 font-black uppercase tracking-widest text-sm flex items-center gap-4 transition-all ${
              success 
              ? 'bg-green-500 text-white' 
              : 'bg-[#f2ca50] text-black hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_#ffffff]'
            } disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : success ? (
              <CheckCircle size={20} />
            ) : (
              <Zap size={20} fill="currentColor" />
            )}
            {success 
              ? (editingOrderId ? 'ORDER UPDATED!' : 'ORDER PLACED!') 
              : isSubmitting 
                ? 'PROCESSING...' 
                : (editingOrderId ? 'UPDATE ORDER' : 'COMPLETE ORDER')
            }
          </button>
        </div>
      </div>
    );
};

export default QuickPOS;
