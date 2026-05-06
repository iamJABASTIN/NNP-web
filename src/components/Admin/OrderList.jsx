import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown, ChevronUp, Package, RefreshCw } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, tables(table_number), profiles(display_name, phone), order_items(*, menu_items(name))')
      .order('placed_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const formatTime = (iso) =>
    iso ? new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Orders...</div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Order List</h2>
        <button onClick={fetchOrders} className={`p-3 ${BORDER_BLACK} bg-white hover:bg-[#f2ca50] transition-colors shadow-[4px_4px_0px_#000000]`}>
          <RefreshCw size={20} strokeWidth={3} />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-16 ${BORDER_BLACK} bg-white ${SHADOW_BLACK}`}>
          <Package size={64} strokeWidth={1} className="opacity-20 mb-4" />
          <h3 className="text-2xl font-black uppercase italic">No Orders Found</h3>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-2">Orders will appear here once placed</p>
        </div>
      ) : (
        <div className={`${BORDER_BLACK} bg-white ${SHADOW_BLACK} overflow-hidden`}>
          <table className="w-full text-left">
            <thead className="bg-black text-white">
              <tr>
                {['Order', 'Table', 'Customer', 'Items', 'Total', 'Time'].map(h => (
                  <th key={h} className="p-4 font-black uppercase tracking-widest text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10">
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <td className="p-4 font-black text-xs">
                      <div className="flex items-center gap-2">
                        {expandedId === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        #{order.kot_number || order.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="p-4 font-black text-xs">T-{order.tables?.table_number || '?'}</td>
                    <td className="p-4 font-black text-xs">{order.profiles?.display_name || 'Guest'}</td>
                    <td className="p-4 font-black text-xs">{order.order_items?.length || 0} items</td>
                    <td className="p-4 font-black text-sm italic">₹{order.total_amount}</td>
                    <td className="p-4 text-[10px] font-bold text-black/50">{formatTime(order.placed_at)}</td>
                  </tr>
                  {expandedId === order.id && (
                    <tr>
                      <td colSpan={6} className="bg-[#f2ca50]/10 p-6 border-t-2 border-black/10">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-black/40">Order Items</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {order.order_items?.map(item => (
                            <div key={item.id} className={`bg-white p-3 border-2 border-black text-xs font-black uppercase`}>
                              <p className="truncate">{item.menu_items?.name}</p>
                              <div className="flex justify-between mt-1 text-[10px] text-black/60">
                                <span>×{item.quantity}</span>
                                <span>₹{item.unit_price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {order.special_instructions && (
                          <p className="mt-3 text-[10px] italic text-black/60 border-t border-black/10 pt-2">
                            Note: {order.special_instructions}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
