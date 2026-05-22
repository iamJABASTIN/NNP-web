import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Search } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';
import TimeRangeFilter from './TimeRangeFilter';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [range, setRange] = useState({ type: 'month', start: '', end: '' }); // Default to month for customers

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, display_name, phone, avatar_url, role, is_active, created_at')
      .eq('role', 'customer');

    const now = new Date();
    if (range.type === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      query = query.gte('created_at', startOfDay);
    } else if (range.type === 'week') {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('created_at', lastWeek);
    } else if (range.type === 'month') {
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      query = query.gte('created_at', lastMonth);
    } else if (range.type === 'custom' && range.start && range.end) {
      query = query.gte('created_at', range.start).lte('created_at', `${range.end}T23:59:59`);
    }

    const { data: profiles } = await query.order('created_at', { ascending: false });

    const { data: orders } = await supabase.from('orders').select('user_id, total_amount');

    const orderMap = {};
    (orders || []).forEach(o => {
      if (!orderMap[o.user_id]) orderMap[o.user_id] = { count: 0, total: 0 };
      orderMap[o.user_id].count++;
      orderMap[o.user_id].total += parseFloat(o.total_amount || 0);
    });

    setCustomers((profiles || []).map(p => ({
      ...p,
      order_count: orderMap[p.id]?.count || 0,
      total_spent: orderMap[p.id]?.total || 0,
    })));
    setLoading(false);
  }, [range]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter(c =>
    !search || (c.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Customers...</div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black w-fit">Customers</h2>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px] mt-1">
            {range.type === 'today' ? "Joined Today" : range.type === 'week' ? "Joined Last 7 Days" : range.type === 'month' ? "Joined Last 30 Days" : "Custom Join Range"}
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <TimeRangeFilter activeRange={range} onRangeChange={setRange} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`bg-white ${BORDER_BLACK} p-4 shadow-[4px_4px_0px_#000000] flex items-center relative`}>
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-black/30" size={18} />
        <input 
          type="text" 
          placeholder="Search by customer name or phone..."
          className="w-full pl-12 pr-4 py-3 border-2 border-black/10 focus:border-black outline-none font-bold text-sm uppercase tracking-tight"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-16 ${BORDER_BLACK} bg-white ${SHADOW_BLACK}`}>
          <Users size={64} strokeWidth={1} className="opacity-20 mb-4" />
          <h3 className="text-2xl font-black uppercase italic">No Customers Found</h3>
        </div>
      ) : (
        <div className={`${BORDER_BLACK} bg-white ${SHADOW_BLACK} overflow-x-auto w-full`}>
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-black text-white">
              <tr>
                {['Customer', 'Phone', 'Orders', 'Total Spent', 'Joined'].map(h => (
                  <th key={h} className="p-4 font-black uppercase tracking-widest text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {c.avatar_url ? (
                        <img src={c.avatar_url} alt="" className="w-10 h-10 border-2 border-black shadow-[2px_2px_0px_#000000] object-cover" />
                      ) : (
                        <div className="w-10 h-10 border-2 border-black bg-[#f2ca50] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#000000]">
                          {(c.display_name || '?')[0].toUpperCase()}
                        </div>
                      )}
                      <span className="font-black text-sm uppercase">{c.display_name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-xs text-black/60">{c.phone || '—'}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 border-2 border-black text-xs font-black bg-[#f2ca50]/20">{c.order_count}</span>
                  </td>
                  <td className="p-4 font-black text-sm italic">₹{c.total_spent.toFixed(0)}</td>
                  <td className="p-4 text-[10px] font-bold text-black/50">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
