import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const MenuHeader = ({ tableId }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-black px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 border-2 border-black hover:bg-accent transition-all shadow-[2px_2px_0px_#000000]"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">
          Smart<span className="text-accent italic">.</span>Menu
        </h1>
      </div>
      
      {tableId && (
        <div className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded-none-none border-2 border-black shadow-[2px_2px_0px_#f2ca50]">
          Table {tableId}
        </div>
      )}
    </header>
  );
};

export default MenuHeader;
