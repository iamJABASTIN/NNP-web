import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Admin/Sidebar';
import DashboardHome from '../components/Admin/DashboardHome';
import MenuManagement from '../components/Admin/MenuManagement';
import CategoryManagement from '../components/Admin/CategoryManagement';
import OrderList from '../components/Admin/OrderList';
import CustomerList from '../components/Admin/CustomerList';
import Analytics from '../components/Admin/Analytics';
import ReviewsList from '../components/Admin/ReviewsList';
import Settings from '../components/Admin/Settings';
import QuickPOS from '../components/Admin/QuickPOS';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleEditOrder = (orderId) => {
    setEditingOrderId(orderId);
    handleTabChange('quick-pos');
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') return <DashboardHome onNavigate={handleTabChange} />;
    if (activeTab === 'quick-pos') return <QuickPOS editingOrderId={editingOrderId} onCancelEdit={() => setEditingOrderId(null)} />;
    if (activeTab === 'orders') return <OrderList onEdit={handleEditOrder} />;
    const Components = { menu: MenuManagement, categories: CategoryManagement, customers: CustomerList, analytics: Analytics, reviews: ReviewsList, settings: Settings };
    const Comp = Components[activeTab] || DashboardHome;
    return <Comp />;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#fcfcfc] font-sans text-black overflow-hidden md:p-6 gap-4 md:gap-6">
      
      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_#000000] shrink-0 m-3 mb-0">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 border-2 border-black hover:bg-[#f2ca50] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} strokeWidth={3} />
        </button>
        <span className="font-black text-sm uppercase tracking-tighter italic">
          {activeTab === 'quick-pos' ? 'Billing' : activeTab === 'menu' ? 'Menu Items' : activeTab}
        </span>
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </header>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-6 md:gap-8 overflow-y-auto p-3">

        {/* Dynamic Content Section */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
