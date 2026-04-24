import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import Sidebar from '../components/Admin/Sidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import DashboardHome from '../components/Admin/DashboardHome';
import MenuManagement from '../components/Admin/MenuManagement';
import SessionManagement from '../components/Admin/SessionManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-[#fcfcfc] font-sans text-black overflow-hidden p-6 gap-6">
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2">
        
        {/* Header */}
        <AdminHeader />

        {/* Dynamic Content Section */}
        {activeTab === 'dashboard' ? (
          <DashboardHome />
        ) : activeTab === 'menu' ? (
          <MenuManagement />
        ) : activeTab === 'sessions' ? (
          <SessionManagement />
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
