import React from 'react';
import { PRIMARY_YELLOW, BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-8 py-3.5 cursor-pointer transition-all border-b-2 border-black/5 hover:bg-gray-50 ${active ? `bg-[${PRIMARY_YELLOW}] text-black ${BORDER_BLACK} ${SHADOW_BLACK} mx-2 rounded-none-none` : 'text-black/60 hover:text-black font-bold uppercase tracking-tighter'}`}
  >
    <Icon size={18} strokeWidth={active ? 3 : 2} />
    <span className="font-black text-[12px] uppercase">{label}</span>
  </div>
);

export default SidebarItem;
