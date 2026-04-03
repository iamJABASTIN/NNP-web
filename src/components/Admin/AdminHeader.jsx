import React from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Gift, 
  Settings 
} from 'lucide-react';
import { BORDER_BLACK, PRIMARY_YELLOW } from '../../constants/adminStyles';

const AdminHeader = () => {
  return (
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
  );
};

export default AdminHeader;
