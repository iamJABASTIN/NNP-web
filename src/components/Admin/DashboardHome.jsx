import React, { useState, useEffect } from 'react';
import { Utensils, MoreVertical, Loader2 } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import StatCard from './StatCard';
import RadialCard from './RadialCard';
import { supabase } from '../../lib/supabase';
import { 
  PRIMARY_YELLOW, 
  BORDER_BLACK, 
  SHADOW_BLACK 
} from '../../constants/adminStyles';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      // Fetch orders
      const { data: orders } = await supabase.from('orders').select('id, status, total_amount, placed_at');
      const all = orders || [];
      const totalOrders = all.length;
      const delivered = all.filter(o => ['served', 'completed'].includes(o.status)).length;
      const cancelled = all.filter(o => o.status === 'cancelled').length;
      const totalRevenue = all.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);

      // Generate mini chart data from recent orders
      const genChart = (arr) => arr.length === 0 ? [0,0,0,0,0,0,0] : arr.slice(0, 14).map(o => parseFloat(o.total_amount || 0));

      setSummaryData([
        { name: 'Total Orders', value: totalOrders, change: totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0, color: '#ffffff', chartData: genChart(all) },
        { name: 'Total Delivered', value: delivered, change: totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0, color: PRIMARY_YELLOW, chartData: genChart(all.filter(o => ['served', 'completed'].includes(o.status))) },
        { name: 'Total Canceled', value: cancelled, change: totalOrders > 0 ? Math.round((cancelled / totalOrders) * 100) : 0, color: '#ffffff', isNegative: true, chartData: genChart(all.filter(o => o.status === 'cancelled')) },
      ]);

      // Performance (completion rate, cost efficiency, revenue)
      const completionRate = totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0;
      const cancelRate = totalOrders > 0 ? 100 - Math.round((cancelled / totalOrders) * 100) : 100;
      setPerformanceData([
        { name: 'Completion', value: completionRate, color: '#000000' },
        { name: 'Success Rate', value: cancelRate, color: PRIMARY_YELLOW },
        { name: 'Fulfillment', value: Math.min(completionRate + 10, 100), color: '#000000' },
      ]);

      // Weekly activity (last 7 days)
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString([], { weekday: 'short' });
        days.push({ day: label, value: all.filter(o => o.placed_at?.startsWith(dayStr)).length });
      }
      setActivityData(days);

      // Top selling items
      const { data: items } = await supabase.from('order_items').select('quantity, unit_price, menu_items(name)');
      const itemMap = {};
      (items || []).forEach(i => {
        const name = i.menu_items?.name || 'Unknown';
        if (!itemMap[name]) itemMap[name] = { name, qty: 0, revenue: 0 };
        itemMap[name].qty += i.quantity;
        itemMap[name].revenue += i.quantity * parseFloat(i.unit_price || 0);
      });
      setTopItems(Object.values(itemMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5));

      // Staff
      const { data: staffData } = await supabase
        .from('profiles')
        .select('display_name, role, avatar_url')
        .in('role', ['admin', 'cook', 'waiter']);
      setStaff(staffData || []);

      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {summaryData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pie Chart Card */}
        <div className={`lg:col-span-5 bg-white p-10 rounded-none-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black uppercase tracking-tighter">Market Metrics</h4>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-none-none border-2 border-black"></div>
                <span>Data</span>
              </div>
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <div className="w-3 h-3 rounded-none-none bg-[#f2ca50] border-2 border-black"></div>
                <span>Value</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center px-4">
            {performanceData.map((stat, i) => (
              <RadialCard key={i} label={stat.name} value={stat.value} color={stat.color} />
            ))}
          </div>
        </div>

        {/* Activity Chart Card */}
        <div className={`lg:col-span-7 bg-white p-10 rounded-none-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[12px] font-black text-black/60 uppercase tracking-[0.3em] mb-2">Weekly Activity Index</p>
              <h3 className="text-3xl font-black tracking-tighter leading-none mb-2 border-b-4 border-[#f2ca50] inline-block">
                {activityData.reduce((s, d) => s + d.value, 0)} orders
              </h3>
            </div>
          </div>
          <div className="h-48 relative border-t-2 border-black/10 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY_YELLOW} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={PRIMARY_YELLOW} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="step" 
                  dataKey="value" 
                  stroke="#000000" 
                  strokeWidth={4} 
                  fill="url(#activityGradient)" 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) return (
                      <div className={`bg-black text-white p-4 rounded-none-none font-black text-[12px] ${BORDER_BLACK} shadow-[4px_4px_0px_#f2ca50]`}>
                        <p className="mb-1 uppercase tracking-widest">{payload[0].payload.day}</p>
                        <p className="text-[#f2ca50]">ORDERS: {payload[0].value}</p>
                      </div>
                    )
                    return null;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-4 text-[10px] uppercase font-black text-black/40 tracking-[0.2em]">
              {activityData.map((d) => <span key={d.day}>{d.day}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Top Items (was Transactions) */}
        <div className={`lg:col-span-8 bg-white p-10 rounded-none-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black uppercase tracking-tighter underline underline-offset-8 decoration-4 decoration-[#f2ca50]">Top Sellers</h4>
          </div>
          <table className="w-full text-left font-black text-xs">
            <thead className="border-b-4 border-black">
              <tr className="uppercase tracking-[0.2em] text-black">
                <th className="pb-4">Item</th>
                <th className="pb-4">Qty Sold</th>
                <th className="pb-4">Revenue</th>
                <th className="pb-4 text-right">More</th>
              </tr>
            </thead>
            <tbody>
              {topItems.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-black/30 uppercase tracking-widest">No data yet</td></tr>
              ) : topItems.map((item, idx) => (
                <tr key={idx} className={`${idx === 0 ? 'bg-[#f2ca50]/10' : ''} border-b-2 border-black/5 last:border-0`}>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 border-2 border-black flex items-center justify-center bg-white ${idx === 0 ? SHADOW_BLACK : ''}`}>
                         <Utensils size={18} strokeWidth={2.5} />
                      </div>
                      <span className="uppercase">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 font-bold">{item.qty} pcs</td>
                  <td className="py-4 italic">₹{item.revenue.toFixed(0)}</td>
                  <td className="py-4 text-right">
                     <button className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all ml-auto">
                        <MoreVertical size={20} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Team */}
        <div className={`lg:col-span-4 bg-white p-10 rounded-none-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <h4 className="text-xl font-black uppercase mb-8 tracking-tighter">Team</h4>
          <div className="space-y-6">
            {staff.length === 0 ? (
              <p className="text-center text-black/30 uppercase tracking-widest text-xs py-4">No staff profiles</p>
            ) : staff.map((emp, i) => (
              <div key={i} className="flex items-center justify-between border-b-2 border-black/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  {emp.avatar_url ? (
                    <img src={emp.avatar_url} alt="" className={`w-10 h-10 border-2 border-black shadow-[2px_2px_0px_#000000]`} />
                  ) : (
                    <div className="w-10 h-10 border-2 border-black bg-[#f2ca50] flex items-center justify-center font-black shadow-[2px_2px_0px_#000000]">
                      {(emp.display_name || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-[12px] font-black uppercase leading-none">{emp.display_name || 'Staff'}</p>
                    <p className="text-[8px] font-black text-black/40 uppercase tracking-widest">{emp.role}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black p-1.5 bg-black text-white uppercase">{emp.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
