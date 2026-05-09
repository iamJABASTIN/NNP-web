import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TableManager from './TableManager';
import LogoutConfirmModal from './LogoutConfirmModal';

const Settings = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data } = await supabase.from('restaurants').select('name').limit(1).single();
      setRestaurantName(data?.name || 'Restaurant');
      setLoading(false);
    };
    fetchRestaurant();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">
        Loading Settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black inline-block">
          Settings
        </h2>
        
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs border-4 border-black shadow-[4px_4px_0px_#000000] hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <TableManager restaurantName={restaurantName} />

      <LogoutConfirmModal 
        show={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );
};


export default Settings;

