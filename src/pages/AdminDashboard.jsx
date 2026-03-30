import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  ListOrdered, 
  FileText, 
  Users, 
  BarChart3, 
  Star, 
  Utensils, 
  UserCircle, 
  Calendar, 
  MessageSquare, 
  Wallet,
  Search,
  Bell,
  Mail,
  Gift,
  Settings,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Send,
  Plus,
  LayoutDashboard,
  Trash2,
  Edit2,
  Save,
  X,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

// --- Theme Constants ---
const PRIMARY_YELLOW = '#f2ca50';
const BORDER_BLACK = 'border-4 border-black';
const SHADOW_BLACK = 'shadow-[6px_6px_0px_#000000]';
const SHADOW_YELLOW = 'shadow-[6px_6px_0px_#f2ca50]';

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

const reviews = [
  { name: 'Bessie Cooper', comment: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly', avatar: 'https://i.pravatar.cc/150?u=6' },
  { name: 'Marvin McKinney', comment: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly', avatar: 'https://i.pravatar.cc/150?u=7' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-8 py-3.5 cursor-pointer transition-all border-b-2 border-black/5 hover:bg-gray-50 ${active ? `bg-[${PRIMARY_YELLOW}] text-black ${BORDER_BLACK} ${SHADOW_BLACK} mx-2 rounded-none` : 'text-black/60 hover:text-black font-bold uppercase tracking-tighter'}`}
  >
    <Icon size={18} strokeWidth={active ? 3 : 2} />
    <span className="font-black text-[12px] uppercase">{label}</span>
  </div>
);

const StatCard = ({ name, value, change, color, chartData, isNegative }) => (
  <div style={{ backgroundColor: color }} className={`p-8 ${BORDER_BLACK} ${SHADOW_BLACK} flex items-center justify-between group hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300`}>
    <div className="flex flex-col gap-1">
      <p className="text-black font-black uppercase text-[10px] tracking-widest">{name}</p>
      <h3 className="text-[32px] font-black leading-none mb-3 tracking-tighter">{value}</h3>
      <div className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded-none ${BORDER_BLACK} flex items-center justify-center bg-white shadow-[2px_2px_0px_#000000]`}>
          {isNegative ? <ArrowDown size={12} strokeWidth={4} /> : <ArrowUp size={12} strokeWidth={4} />}
        </div>
        <span className="text-[12px] font-black italic">{change}% (30 Days)</span>
      </div>
    </div>
    <div className="w-20 h-20">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData.map((v, i) => ({ v, i }))}>
          <Bar dataKey="v" fill="#000000" radius={[0, 0, 0, 0]} barSize={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RadialCard = ({ value, label, color }) => {
  const data = [{ value }, { value: 100 - value }];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={50}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="#000000"
              strokeWidth={2}
            >
              <Cell fill={color} />
              <Cell fill="#ffffff" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black">{value}%</span>
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
};

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    price: '',
    category_id: '',
    veg_type: 'veg',
    is_available: true,
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: menuData } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    const { data: catData } = await supabase.from('categories').select('*').order('display_order');
    setItems(menuData || []);
    setCategories(catData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async (id) => {
    const { error } = await supabase.from('menu_items').update(editForm).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item from the database?')) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const handleAdd = async () => {
    const { error } = await supabase.from('menu_items').insert([newForm]);
    if (!error) {
      setIsAdding(false);
      setNewForm({ name: '', price: '', category_id: categories[0]?.id || '', veg_type: 'veg', is_available: true, description: '' });
      fetchData();
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">Syncing Database...</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black">Menu Catalog</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-3 bg-[${PRIMARY_YELLOW}] text-black font-black px-8 py-4 ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-all`}
        >
          {isAdding ? <X size={20} strokeWidth={4} /> : <Plus size={20} strokeWidth={4} />}
          <span className="uppercase tracking-widest text-xs">{isAdding ? 'CANCEL' : 'ADD NEW DISH'}</span>
        </button>
      </div>

      <div className={`bg-white ${BORDER_BLACK} shadow-[8px_8px_0px_#000000] overflow-hidden`}>
        <table className="w-full text-left uppercase font-black text-xs">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-6 tracking-widest">DISH DETAILS</th>
              <th className="p-6 tracking-widest">CATEGORY</th>
              <th className="p-6 tracking-widest">PRICE</th>
              <th className="p-6 tracking-widest">AVAILABILITY</th>
              <th className="p-6 tracking-widest text-right">OPERATIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {/* Inline Add Row */}
            {isAdding && (
              <tr className={`bg-[${PRIMARY_YELLOW}]/20 animate-in slide-in-from-top duration-300`}>
                <td className="p-6">
                  <div className="space-y-4">
                    <input 
                      placeholder="NAME (e.g. Malabar Parotta)" 
                      className={`w-full bg-white p-3 ${BORDER_BLACK} font-black text-xs uppercase`}
                      value={newForm.name}
                      onChange={e => setNewForm({...newForm, name: e.target.value})}
                    />
                    <textarea 
                      placeholder="DESCRIPTION..." 
                      className={`w-full bg-white p-3 ${BORDER_BLACK} font-black text-[10px] h-20`}
                      value={newForm.description}
                      onChange={e => setNewForm({...newForm, description: e.target.value})}
                    />
                  </div>
                </td>
                <td className="p-6">
                  <select 
                    className={`w-full bg-white p-3 ${BORDER_BLACK} font-black`}
                    value={newForm.category_id}
                    onChange={e => setNewForm({...newForm, category_id: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg italic">₹</span>
                    <input 
                      type="number"
                      placeholder="0.00" 
                      className={`w-24 bg-white p-3 ${BORDER_BLACK} font-black`}
                      value={newForm.price}
                      onChange={e => setNewForm({...newForm, price: e.target.value})}
                    />
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-black" 
                        checked={newForm.is_available}
                        onChange={e => setNewForm({...newForm, is_available: e.target.checked})}
                      />
                      <span>ACTIVE</span>
                    </div>
                    <select 
                      className="bg-white border-2 border-black p-1 text-[10px]"
                      value={newForm.veg_type}
                      onChange={e => setNewForm({...newForm, veg_type: e.target.value})}
                    >
                      <option value="veg">VEG</option>
                      <option value="non_veg">NON-VEG</option>
                    </select>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={handleAdd}
                    className="bg-black text-white p-4 border-2 border-white hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle2 size={24} />
                  </button>
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item.id} className={`${editingId === item.id ? `bg-[${PRIMARY_YELLOW}]/10` : 'hover:bg-gray-50'}`}>
                <td className="p-6">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <input 
                        className={`w-full bg-white p-2 border-2 border-black font-black text-xs uppercase`}
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                      <textarea 
                        className={`w-full bg-white p-2 border-2 border-black font-black text-[10px] h-14`}
                        value={editForm.description}
                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-lg tracking-tighter">{item.name}</span>
                      <span className="text-[10px] text-black/50 line-clamp-1">{item.description}</span>
                      <img src={item.image_url} alt="" className="w-12 h-12 border-2 border-black mt-2 bg-gray-100 object-cover" />
                    </div>
                  )}
                </td>
                <td className="p-6">
                  {editingId === item.id ? (
                    <select 
                      className="bg-white border-2 border-black p-2 font-black w-full"
                      value={editForm.category_id}
                      onChange={e => setEditForm({...editForm, category_id: e.target.value})}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  ) : (
                    <span className="px-4 py-2 border-2 border-black/10 text-[10px]">{categories.find(c => c.id === item.category_id)?.name || 'NONE'}</span>
                  )}
                </td>
                <td className="p-6">
                  {editingId === item.id ? (
                    <input 
                      type="number"
                      className="bg-white border-2 border-black p-2 font-black w-24"
                      value={editForm.price}
                      onChange={e => setEditForm({...editForm, price: e.target.value})}
                    />
                  ) : (
                    <span className="text-lg italic">₹{item.price}</span>
                  )}
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 border-2 border-black ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-[10px]">{item.is_available ? 'IN STOCK' : 'SOLD OUT'}</span>
                    </div>
                    <span className={`text-[10px] italic ${item.veg_type === 'veg' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.veg_type?.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center gap-4 justify-end">
                    {editingId === item.id ? (
                      <>
                        <button onClick={() => handleSave(item.id)} className="p-3 bg-black text-white hover:bg-green-600 border-2 border-black">
                          <Save size={20} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-3 bg-white text-black hover:bg-gray-200 border-2 border-black">
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-3 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-[#fcfcfc] font-sans text-black overflow-hidden p-6 gap-6">
      
      {/* Sidebar */}
      <aside className={`w-80 bg-white ${BORDER_BLACK} flex flex-col py-10 shadow-[8px_8px_0px_#000000]`}>
        <div className="px-8 mb-16 flex items-center gap-3">
          <div className="flex flex-col gap-1">
             <div className="w-10 h-4 bg-black rounded-none"></div>
             <div className={`w-10 h-4 bg-[${PRIMARY_YELLOW}] rounded-none translate-x-4 -mt-1 border-2 border-black`}></div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Food.</h1>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-2">
          <SidebarItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Utensils} label="Menu Items" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
          <SidebarItem icon={ListOrdered} label="Order List" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={Users} label="Customer" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={Star} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
          <SidebarItem icon={MessageSquare} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
      </aside>

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2">
        
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-6 border-b-4 border-black">
          <div className="relative w-[400px]">
            <input 
              type="text" 
              placeholder="SEARCH OPERATIONS..." 
              className={`w-full pl-8 pr-14 py-4 bg-white ${BORDER_BLACK} shadow-[4px_4px_0px_#000000] font-black text-xs uppercase tracking-widest focus:outline-none`}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-black" size={20} strokeWidth={3} />
          </div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              {[Bell, MessageSquare, Gift, Settings].map((Icon, i) => (
                <button key={i} className={`w-12 h-12 rounded-none bg-white ${BORDER_BLACK} flex items-center justify-center shadow-[4px_4px_0px_#000000] hover:bg-[${PRIMARY_YELLOW}] transition-colors group relative`}>
                  <Icon size={20} className="text-black group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  {i === 0 && <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-600 border-2 border-black"></div>}
                </button>
              ))}
            </div>
            <div className="h-12 w-1 bg-black"></div>
            <div className="flex items-center gap-6">
              <span className="text-[14px] font-black uppercase tracking-tighter">
                Hello, <span className="text-[${PRIMARY_YELLOW}] italic outline-text" style={{ WebkitTextStroke: '1px black' }}>Shariar</span>
              </span>
              <img src="https://i.pravatar.cc/150?u=shariar" alt="" className={`w-12 h-12 rounded-none ${BORDER_BLACK} shadow-[4px_4px_0px_#000000]`} />
            </div>
          </div>
        </header>

        {/* Dynamic Content Section */}
        {activeTab === 'dashboard' ? (
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
              <div className={`lg:col-span-5 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-black uppercase tracking-tighter">Market Metrics</h4>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-none border-2 border-black"></div>
                      <span>Data</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#f2ca50]">
                      <div className="w-3 h-3 rounded-none bg-[#f2ca50] border-2 border-black"></div>
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
              <div className={`lg:col-span-7 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
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
                            <div className={`bg-black text-white p-4 rounded-none font-black text-[12px] ${BORDER_BLACK} shadow-[4px_4px_0px_#f2ca50]`}>
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
              <div className={`lg:col-span-8 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
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
              <div className={`lg:col-span-4 bg-white p-10 rounded-none ${BORDER_BLACK} ${SHADOW_BLACK}`}>
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
        ) : activeTab === 'menu' ? (
          <MenuManagement />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border-4 border-black border-dashed opacity-30 select-none">
            <LayoutDashboard size={80} strokeWidth={0.5} />
            <span className="font-black uppercase tracking-[0.5em] mt-4">Module Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
