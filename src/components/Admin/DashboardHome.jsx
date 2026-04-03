import React from 'react';
import { Utensils, MoreVertical } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import StatCard from './StatCard';
import RadialCard from './RadialCard';
import { 
  PRIMARY_YELLOW, 
  BORDER_BLACK, 
  SHADOW_BLACK 
} from '../../constants/adminStyles';

// --- Mock Data ---
const summaryData = [
  { name: 'Total Orders', value: 530, change: 85, color: '#ffffff', chartData: [4, 6, 8, 5, 9, 11, 7, 10, 8, 12, 6, 9, 7, 11] },
  { name: 'Total Delivered', value: 480, change: 90, color: PRIMARY_YELLOW, chartData: [5, 8, 6, 11, 7, 10, 8, 13, 9, 11, 8, 12, 10, 9] },
  { name: 'Total Canceled', value: 20, change: 20, color: '#ffffff', isNegative: true, chartData: [3, 5, 4, 6, 3, 7, 5, 8, 4, 6, 5, 7, 4, 6] },
];

const performanceData = [
  { name: 'Total Order', value: 85, color: '#000000' },
  { name: 'Total Cost', value: 90, color: PRIMARY_YELLOW },
  { name: 'Total Revenue', value: 80, color: '#000000' },
];

const activityData = [
  { day: 'Sat', value: 20 },
  { day: 'Sun', value: 30 },
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 35 },
  { day: 'Fri', value: 65 },
  { day: 'Thu', value: 50 },
  { day: 'Wed', value: 40 },
];

const recentOrders = [
  { id: 1, name: 'Pizza', price: 120.53, items: '11 k PC', sale: '$ 250', remaining: '12.25 K' },
  { id: 2, name: 'Burger', price: 110.58, items: '15 k PC', sale: '$ 380', remaining: '12.25 K', active: true },
  { id: 3, name: 'Cake', price: 90.99, items: '15 k PC', sale: '$ 380', remaining: '12.25 K' },
  { id: 4, name: 'Salad', price: 90.99, items: '15 k PC', sale: '$ 380', remaining: '12.25 K' },
  { id: 5, name: 'Chicken', price: 90.99, items: '15 k PC', sale: '$ 380', remaining: '12.25 K' },
];

const employees = [
  { name: 'Cameron Williamson', role: 'Sales manager', hours: '20 Hr/Week', avatar: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Jenny Wilson', role: 'Sales manager', hours: '20 Hr/Week', avatar: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Jacob Jones', role: 'Sales manager', hours: '20 Hr/Week', avatar: 'https://i.pravatar.cc/150?u=3' },
  { name: 'Albert Flores', role: 'Sales manager', hours: '20 Hr/Week', avatar: 'https://i.pravatar.cc/150?u=4' },
  { name: 'Annette Black', role: 'Sales manager', hours: '20 Hr/Week', avatar: 'https://i.pravatar.cc/150?u=5' },
];

const DashboardHome = () => {
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
              <h3 className="text-3xl font-black tracking-tighter leading-none mb-2 border-b-4 border-[${PRIMARY_YELLOW}] inline-block">$85,189.46</h3>
            </div>
            <button className={`text-[10px] font-black bg-black text-white px-6 py-3 uppercase tracking-widest border-2 border-[${PRIMARY_YELLOW}] hover:bg-[${PRIMARY_YELLOW}] hover:text-black transition-colors`}>
              FULL REPORT
            </button>
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
                        <p className="mb-1 uppercase tracking-widest">18 AUG 2022</p>
                        <p className="text-[${PRIMARY_YELLOW}]">REVENUE: $4.2K</p>
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
        
        {/* Transactions */}
        <div className={`lg:col-span-8 bg-white p-10 rounded-none-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black uppercase tracking-tighter underline underline-offset-8 decoration-4 decoration-[${PRIMARY_YELLOW}]">Transactions</h4>
            <button className={`bg-black text-white px-6 py-2 font-black uppercase text-[10px] tracking-[0.2em] border-2 border-black hover:bg-[${PRIMARY_YELLOW}] hover:text-black transition-all`}>
              ARCHIVE
            </button>
          </div>
          <table className="w-full text-left font-black text-xs">
            <thead className="border-b-4 border-black">
              <tr className="uppercase tracking-[0.2em] text-black">
                <th className="pb-4">Product</th>
                <th className="pb-4">Stock</th>
                <th className="pb-4">Sale</th>
                <th className="pb-4 text-right">More</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className={`${order.active ? 'bg-[#f2ca50]/10' : ''} border-b-2 border-black/5 last:border-0`}>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 border-2 border-black flex items-center justify-center bg-white ${order.active ? SHADOW_BLACK : ''}`}>
                         <Utensils size={18} strokeWidth={2.5} />
                      </div>
                      <span className="uppercase">{order.name}</span>
                    </div>
                  </td>
                  <td className="py-4 font-bold">{order.items}</td>
                  <td className="py-4 italic">{order.sale}</td>
                  <td className="py-4 text-right">
                     <button className={`w-10 h-10 border-2 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all ml-auto`}>
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
            {employees.map((emp, i) => (
              <div key={i} className="flex items-center justify-between border-b-2 border-black/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <img src={emp.avatar} alt="" className={`w-10 h-10 border-2 border-black shadow-[2px_2px_0px_#000000]`} />
                  <div>
                    <p className="text-[12px] font-black uppercase leading-none">{emp.name}</p>
                    <p className="text-[8px] font-black text-black/40 uppercase tracking-widest">{emp.role}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black p-1.5 bg-black text-white">{emp.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
