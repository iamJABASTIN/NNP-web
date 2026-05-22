import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Zap,
  ListOrdered,
  Users,
  BarChart3,
  Star,
  Utensils,
  Settings,
  LogOut,
  Tag,
  X,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { BORDER_BLACK } from '../../constants/adminStyles';
import { supabase } from '../../lib/supabase';
import LogoutConfirmModal from './LogoutConfirmModal';
import { useAdminShortcuts } from '../../hooks/useAdminShortcuts';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Initialize function key shortcuts
  useAdminShortcuts(setActiveTab);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 md:relative flex w-80 bg-white ${BORDER_BLACK} flex-col py-10 shadow-[8px_8px_0px_#000000]
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden p-2 border-2 border-black bg-white hover:bg-[#f2ca50] transition-colors"
          aria-label="Close menu"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className="px-8 mb-16 flex items-center gap-3">
          <h1 className="text-3xl font-black tracking-tighter uppercase">New Nellai Punjabi</h1>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-2">
          <SidebarItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} shortcut="F1" />
          <SidebarItem icon={Zap} label="Billing" active={activeTab === 'quick-pos'} onClick={() => setActiveTab('quick-pos')} shortcut="F2" />
          <SidebarItem icon={Utensils} label="Menu Items" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} shortcut="F3" />
          <SidebarItem icon={Tag} label="Categories" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} shortcut="F9" />
          <SidebarItem icon={ListOrdered} label="Order List" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} shortcut="F4" />
          <SidebarItem icon={Users} label="Customer" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} shortcut="F5" />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} shortcut="F6" />
          <SidebarItem icon={Star} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} shortcut="F7" />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} shortcut="F8" />
        </nav>

        <div className="px-4 mt-auto">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 px-6 py-4 text-red-600 font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-colors border-t-4 border-black"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <LogoutConfirmModal 
          show={showLogoutModal} 
          onClose={() => setShowLogoutModal(false)} 
          onConfirm={handleLogout} 
          message="Are you sure you want to log out from the admin panel?"
        />
      </aside>
    </>
  );
};

export default Sidebar;

