import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Search, ClipboardList, User, Menu, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const SidebarNav = ({ activeTab, onTabChange, hasActiveOrder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'menu', icon: Search, label: t('menu') },
    { id: 'orders', icon: ClipboardList, label: t('orders'), badge: hasActiveOrder },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="hidden md:block fixed left-0 top-0 h-full z-[80]">
      <motion.nav 
        initial={false} animate={{ width: isOpen ? 260 : 88 }}
        className="h-full bg-white border-r-[4px] border-black flex flex-col p-4 shadow-[8px_0px_0px_rgba(0,0,0,0.05)] relative z-20"
      >
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="mb-12 p-4 border-2 border-black bg-accent text-black hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0px_#000000] flex items-center justify-center rounded-none mx-auto"
        >
          {isOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
        </button>

        <div className="flex flex-col gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => tab.id === 'home' ? window.location.href = '/' : onTabChange(tab.id)}
                className={`relative flex items-center gap-4 p-4 rounded-none border-2 transition-all duration-300 group ${
                  isActive 
                    ? 'bg-black text-white border-black shadow-[4px_4px_0px_#f2ca50]' 
                    : 'bg-white text-black/50 border-transparent hover:bg-black/5'
                }`}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                  {tab.badge && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-none ring-2 ring-black" />
                  )}
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
                      {tab.badge && <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase rounded-none">{t('active', 'Active')}</span>}
                      <ChevronRight size={14} className={isActive ? 'text-accent' : 'opacity-20'} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {isActive && !isOpen && (
                  <motion.div layoutId="active-nav-dot" className="absolute -right-6 w-2 h-8 bg-accent border-l-2 border-black" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col items-center">
            {isOpen ? (
                <div className="text-sm font-black uppercase tracking-widest leading-none border-t-2 border-black pt-8 w-full text-center">
                    Nellai<span className="text-accent">.</span>Punjabi
                </div>
            ) : (
                <div className="w-10 h-10 bg-accent border-2 border-black font-black flex items-center justify-center text-xs rotate-45 shadow-[4px_4px_0px_#000000]">
                    <span className="-rotate-45">NP</span>
                </div>
            )}
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10 pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarNav;
