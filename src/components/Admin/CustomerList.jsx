import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Search } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, phone, avatar_url, role, is_active, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

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
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers.filter(c =>
    !search || (c.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Customers...</div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Customers</h2>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-1">{customers.length} registered</p>
        </div>
        <div className="relative w-72">
          <input type="text" placeholder="SEARCH BY NAME OR PHONE..."
            className={`w-full pl-4 pr-12 py-3 ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] font-black text-xs uppercase tracking-widest focus:outline-none`}
            value={search} onChange={e => setSearch(e.target.value)} />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-black" size={18} strokeWidth={3} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-16 ${BORDER_BLACK} bg-white ${SHADOW_BLACK}`}>
          <Users size={64} strokeWidth={1} className="opacity-20 mb-4" />
          <h3 className="text-2xl font-black uppercase italic">No Customers Found</h3>
        </div>
      ) : (
        <div className={`${BORDER_BLACK} bg-white ${SHADOW_BLACK} overflow-hidden`}>
          <table className="w-full text-left">
            <thead className="bg-black text-white">
              <tr>
                {['Customer', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Status'].map(h => (
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
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 border-2 border-black ${c.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-[10px] font-black uppercase">{c.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
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
