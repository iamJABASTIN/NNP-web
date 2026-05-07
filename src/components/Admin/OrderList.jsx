import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown, ChevronUp, Package, RefreshCw } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';
import TimeRangeFilter from './TimeRangeFilter';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [range, setRange] = useState({ type: 'today', start: '', end: '' });

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*, tables(table_number), profiles(display_name, phone), order_items(*, menu_items(name))');

    const now = new Date();
    if (range.type === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      query = query.gte('placed_at', startOfDay);
    } else if (range.type === 'week') {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('placed_at', lastWeek);
    } else if (range.type === 'month') {
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      query = query.gte('placed_at', lastMonth);
    } else if (range.type === 'custom' && range.start && range.end) {
      query = query.gte('placed_at', range.start).lte('placed_at', `${range.end}T23:59:59`);
    }

    const { data } = await query.order('placed_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [range]);

  const formatTime = (iso) =>
    iso ? new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Orders...</div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Order List</h2>
          <p className="text-[10px] font-bold text-black/40 mt-1 uppercase tracking-widest">
            {range.type === 'today' ? "Today's Orders" : range.type === 'week' ? "Last 7 Days" : range.type === 'month' ? "Last 30 Days" : "Custom Range"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TimeRangeFilter activeRange={range} onRangeChange={setRange} />
          <button onClick={fetchOrders} className={`p-3 ${BORDER_BLACK} bg-white hover:bg-[#f2ca50] transition-colors shadow-[4px_4px_0px_#000000]`}>
            <RefreshCw size={20} strokeWidth={3} />
          </button>
        </div>
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
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Order Items</p>
                          {order.profiles?.phone && (
                            <p className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 tracking-widest">
                              Phone: {order.profiles.phone}
                            </p>
                          )}
                        </div>
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
