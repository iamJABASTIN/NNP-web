import React from 'react';
import {
  LayoutGrid,
  ListOrdered,
  Users,
  BarChart3,
  Star,
  Utensils,
  Settings,
  Clock
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { BORDER_BLACK, PRIMARY_YELLOW } from '../../constants/adminStyles';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className={`w-80 bg-white ${BORDER_BLACK} flex flex-col py-10 shadow-[8px_8px_0px_#000000]`}>
      <div className="px-8 mb-16 flex items-center gap-3">
        <div className="flex flex-col gap-1">
           <div className="w-10 h-4 bg-black rounded-none-none"></div>
           <div className={`w-10 h-4 bg-[${PRIMARY_YELLOW}] rounded-none-none translate-x-4 -mt-1 border-2 border-black`}></div>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Food.</h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-2">
        <SidebarItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarItem icon={Utensils} label="Menu Items" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
        <SidebarItem icon={Clock} label="Sessions" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
        <SidebarItem icon={ListOrdered} label="Order List" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <SidebarItem icon={Users} label="Customer" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
        <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        <SidebarItem icon={Star} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
        <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>
    </aside>
  );
};

export default Sidebar;
