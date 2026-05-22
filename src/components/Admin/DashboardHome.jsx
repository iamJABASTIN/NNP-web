import React, { useState, useEffect } from 'react';
import { Utensils, MoreVertical, Loader2, Star } from 'lucide-react';
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

const DashboardHome = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [activeMenuIdx, setActiveMenuIdx] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [marketMetrics, setMarketMetrics] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, total_amount, placed_at, user_id');
      const all = orders || [];
      const totalOrders = all.length;
      const totalRevenue = all.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
      const uniqueCustomers = new Set(all.map(o => o.user_id)).size;

      // Generate mini chart data from recent orders
      const genChart = (arr) =>
        arr.length === 0
          ? [0, 0, 0, 0, 0, 0, 0]
          : arr.slice(0, 14).map(o => parseFloat(o.total_amount || 0));

      setSummaryData([
        {
          name: 'Total Orders',
          value: totalOrders,
          change: totalOrders,
          color: '#ffffff',
          chartData: genChart(all),
        },
        {
          name: 'Total Revenue',
          value: `₹${totalRevenue.toFixed(0)}`,
          change: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
          color: PRIMARY_YELLOW,
          chartData: genChart(all),
        },
        {
          name: 'Total Customers',
          value: uniqueCustomers,
          change: uniqueCustomers,
          color: '#ffffff',
          chartData: genChart(all),
        },
      ]);

      // --- Market Metrics ---

      // 1. Avg Order Value
      const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

      // 2. Profit Margin — from order_items with cost data
      const { data: items } = await supabase
        .from('order_items')
        .select('quantity, unit_price, unit_cost, menu_items(name, cost_price)');

      let totalSaleValue = 0;
      let totalCostValue = 0;
      (items || []).forEach(i => {
        const qty = i.quantity || 0;
        const price = parseFloat(i.unit_price || 0);
        const cost = parseFloat(i.unit_cost || i.menu_items?.cost_price || 0);
        totalSaleValue += qty * price;
        totalCostValue += qty * cost;
      });
      const profitMargin =
        totalSaleValue > 0
          ? Math.round(((totalSaleValue - totalCostValue) / totalSaleValue) * 100)
          : 0;

      // 3. Peak Hour
      const hourMap = {};
      all.forEach(o => {
        if (!o.placed_at) return;
        const hour = new Date(o.placed_at).getHours();
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      });
      let peakHour = null;
      let peakCount = 0;
      Object.entries(hourMap).forEach(([h, count]) => {
        if (count > peakCount) {
          peakCount = count;
          peakHour = parseInt(h);
        }
      });
      const peakHourLabel = peakHour !== null
        ? `${peakHour > 12 ? peakHour - 12 : peakHour || 12} ${peakHour >= 12 ? 'PM' : 'AM'}`
        : 'N/A';
      const peakHourFill = peakHour !== null ? Math.min(Math.round((peakCount / totalOrders) * 100), 100) : 0;

      setMarketMetrics([
        {
          name: 'Avg. Order Value',
          value: Math.min(avgOrderValue > 0 ? Math.round((avgOrderValue / 1000) * 100) : 0, 100),
          displayValue: `₹${avgOrderValue}`,
          color: '#000000',
        },
        {
          name: 'Peak Hour',
          value: peakHourFill,
          displayValue: peakHourLabel,
          color: '#000000',
        },
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
      const itemMap = {};
      (items || []).forEach(i => {
        const name = i.menu_items?.name || 'Unknown';
        if (!itemMap[name]) itemMap[name] = { name, qty: 0, revenue: 0 };
        itemMap[name].qty += i.quantity;
        itemMap[name].revenue += i.quantity * parseFloat(i.unit_price || 0);
      });
      setTopItems(Object.values(itemMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5));

      // Recent Reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('id, rating, feedback, created_at, orders(id, profiles(display_name))')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentReviews((reviewsData || []).map(r => ({
        name: r.orders?.profiles?.display_name || 'Guest',
        rating: r.rating,
        feedback: r.feedback,
        date: r.created_at,
      })));

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
        {/* Market Metrics Card */}
        <div className={`lg:col-span-5 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black uppercase tracking-tighter">Market Metrics</h4>
          </div>
          <div className="flex flex-wrap justify-around items-center gap-6">
            {marketMetrics.map((stat, i) => (
              <RadialCard
                key={i}
                label={stat.name}
                value={stat.value}
                displayValue={stat.displayValue}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        {/* Activity Chart Card */}
        <div className={`lg:col-span-7 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
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
                      <div className={`bg-black text-white p-4 rounded-none font-black text-[12px] ${BORDER_BLACK} shadow-[4px_4px_0px_#f2ca50]`}>
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
        
        {/* Top Items */}
        <div className={`lg:col-span-8 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
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
                  <td className="py-4 text-right relative">
                     <button 
                        onClick={() => setActiveMenuIdx(activeMenuIdx === idx ? null : idx)}
                        className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all ml-auto"
                      >
                        <MoreVertical size={20} />
                     </button>

                     {activeMenuIdx === idx && (
                       <>
                         <div 
                           className="fixed inset-0 z-10" 
                           onClick={() => setActiveMenuIdx(null)}
                         />
                         <div className={`absolute right-0 top-14 w-40 bg-white border-2 border-black shadow-[4px_4px_0px_#000000] z-20 animate-in fade-in zoom-in duration-200`}>
                           <button 
                             onClick={() => {
                               onNavigate('analytics');
                               setActiveMenuIdx(null);
                             }}
                             className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors border-b-2 border-black/5"
                           >
                             View Analytics
                           </button>
                           <button 
                             onClick={() => {
                               onNavigate('menu');
                               setActiveMenuIdx(null);
                             }}
                             className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors"
                           >
                             Manage Menu
                           </button>
                         </div>
                       </>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Reviews */}
        <div className={`lg:col-span-4 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <h4 className="text-xl font-black uppercase mb-8 tracking-tighter">Recent Reviews</h4>
          <div className="space-y-5">
            {recentReviews.length === 0 ? (
              <p className="text-center text-black/30 uppercase tracking-widest text-xs py-4">No reviews yet</p>
            ) : recentReviews.map((review, i) => (
              <div key={i} className="border-b-2 border-black/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black bg-accent flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000000]">
                      {(review.name || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-[11px] font-black uppercase">{review.name}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} strokeWidth={2.5}
                        className={s <= review.rating ? 'fill-accent text-accent' : 'text-black/15'}
                      />
                    ))}
                  </div>
                </div>
                {review.feedback && (
                  <p className="text-[10px] text-black/50 font-bold leading-relaxed line-clamp-2 pl-11">
                    "{review.feedback}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
