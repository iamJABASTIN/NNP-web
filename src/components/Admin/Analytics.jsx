import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, ShoppingBag, DollarSign, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { BORDER_BLACK, PRIMARY_YELLOW, SHADOW_BLACK } from '../../constants/adminStyles';

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, revenue: 0, avgValue: 0, customers: 0 });
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);

      // All orders
      const { data: orders } = await supabase.from('orders').select('id, total_amount, placed_at, user_id');

      // Order items with menu names
      const { data: items } = await supabase.from('order_items').select('menu_item_id, quantity, unit_price, menu_items(name)');

      const allOrders = orders || [];
      const totalRevenue = allOrders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
      const uniqueCustomers = new Set(allOrders.map(o => o.user_id)).size;

      setStats({
        total: allOrders.length,
        revenue: totalRevenue,
        avgValue: allOrders.length ? (totalRevenue / allOrders.length) : 0,
        customers: uniqueCustomers,
      });

      // Peak Hours — group orders by hour of day
      const hourMap = {};
      allOrders.forEach(o => {
        if (!o.placed_at) return;
        const hour = new Date(o.placed_at).getHours();
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      });

      // Build full hour range from data (or default 10 AM–10 PM)
      const hours = Object.keys(hourMap).map(Number).sort((a, b) => a - b);
      const minHour = hours.length > 0 ? Math.min(...hours) : 10;
      const maxHour = hours.length > 0 ? Math.max(...hours) : 22;
      const peakHours = [];
      for (let h = minHour; h <= maxHour; h++) {
        const label = `${h > 12 ? h - 12 : h || 12}${h >= 12 ? 'PM' : 'AM'}`;
        peakHours.push({ hour: label, orders: hourMap[h] || 0 });
      }
      setPeakHoursData(peakHours);

      // Top selling items
      const itemMap = {};
      (items || []).forEach(i => {
        const name = i.menu_items?.name || 'Unknown';
        if (!itemMap[name]) itemMap[name] = { name, qty: 0, revenue: 0 };
        itemMap[name].qty += i.quantity;
        itemMap[name].revenue += i.quantity * parseFloat(i.unit_price || 0);
      });
      setTopItems(Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 8));

      // Daily revenue (last 7 days)
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString([], { weekday: 'short' });
        const dayStr = d.toISOString().slice(0, 10);
        const dayOrders = allOrders.filter(o => o.placed_at?.startsWith(dayStr));
        days.push({ day: label, orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0) });
      }
      setDailyData(days);

      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Crunching Numbers...</div>;

  const statCards = [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: '#f2ca50' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(0)}`, icon: DollarSign, color: '#ffffff' },
    { label: 'Avg Order Value', value: `₹${stats.avgValue.toFixed(0)}`, icon: TrendingUp, color: '#ffffff' },
    { label: 'Unique Customers', value: stats.customers, icon: Users, color: '#f2ca50' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black inline-block">Analytics</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ backgroundColor: color }} className={`p-6 ${BORDER_BLACK} ${SHADOW_BLACK} hover:-translate-y-1 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/60">{label}</p>
              <Icon size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Peak Hours — Bar Chart */}
        <div className={`lg:col-span-5 bg-white p-8 ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <h4 className="text-lg font-black uppercase tracking-tighter mb-6">Peak Hours</h4>
          {peakHoursData.length === 0 ? (
            <p className="text-center text-black/30 font-black uppercase tracking-widest py-8">No order data yet</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData}>
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fontWeight: 900 }} interval={0} angle={-45} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) return (
                        <div className={`bg-black text-white p-3 font-black text-[11px] ${BORDER_BLACK} shadow-[4px_4px_0px_#f2ca50]`}>
                          <p className="uppercase tracking-widest">{payload[0].payload.hour}</p>
                          <p className="text-[#f2ca50] mt-1">{payload[0].value} orders</p>
                        </div>
                      );
                      return null;
                    }}
                  />
                  <Bar dataKey="orders" fill={PRIMARY_YELLOW} stroke="#000" strokeWidth={2} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Daily Revenue — Area */}
        <div className={`lg:col-span-7 bg-white p-8 ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <h4 className="text-lg font-black uppercase tracking-tighter mb-6">Revenue Trend (7 Days)</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY_YELLOW} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={PRIMARY_YELLOW} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 900 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={3} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Items — Bar */}
      <div className={`bg-white p-8 ${BORDER_BLACK} ${SHADOW_BLACK}`}>
        <h4 className="text-lg font-black uppercase tracking-tighter mb-6">Top Selling Items</h4>
        {topItems.length === 0 ? (
          <p className="text-center text-black/30 font-black uppercase tracking-widest py-8">No item data yet</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fontWeight: 700 }} />
                <Tooltip formatter={(v, name) => name === 'qty' ? `${v} sold` : `₹${v}`} />
                <Bar dataKey="qty" fill="#000" barSize={16} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
