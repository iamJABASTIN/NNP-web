import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, ClipboardList, User } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const BottomNav = ({ activeTab, onTabChange, hasActiveOrder }) => {
  const { t } = useLanguage();
  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'menu', icon: Search, label: t('menu') },
    { id: 'orders', icon: ClipboardList, label: t('orders'), badge: hasActiveOrder },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[50] w-[90%] max-w-[400px]">
      <motion.nav 
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="bg-black/90 border-4 border-black backdrop-blur-md px-6 py-2 flex items-center justify-between shadow-[8px_8px_0px_#f2ca50] gap-2 rounded-none-none"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => tab.id === 'home' ? window.location.href = '/' : onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 group"
            >
              <div className={`p-2 transition-all duration-300 relative ${isActive ? 'text-accent scale-110' : 'text-white/40 hover:text-white'}`}>
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                {isActive && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-accent/20 blur-xl rounded-none-none -z-10" />}
                {tab.badge && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-black rounded-none-none" />}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'text-accent opacity-100' : 'text-white/20 opacity-40 group-hover:opacity-60'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default BottomNav;
