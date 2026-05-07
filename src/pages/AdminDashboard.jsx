import React, { useState } from 'react';
import Sidebar from '../components/Admin/Sidebar';
import DashboardHome from '../components/Admin/DashboardHome';
import MenuManagement from '../components/Admin/MenuManagement';
import OrderList from '../components/Admin/OrderList';
import CustomerList from '../components/Admin/CustomerList';
import Analytics from '../components/Admin/Analytics';
import ReviewsList from '../components/Admin/ReviewsList';
import Settings from '../components/Admin/Settings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'menu': return <MenuManagement />;
      case 'orders': return <OrderList />;
      case 'customers': return <CustomerList />;
      case 'analytics': return <Analytics />;
      case 'reviews': return <ReviewsList />;
      case 'settings': return <Settings />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] font-sans text-black overflow-hidden p-6 gap-6">
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-8 overflow-y-auto p-3">

        {/* Dynamic Content Section */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
