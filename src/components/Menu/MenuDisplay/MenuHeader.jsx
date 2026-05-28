import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const MenuHeader = ({ tableNumber }) => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

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
      
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleLanguage}
          className="px-3 py-1 text-xs font-black uppercase border-2 border-black hover:bg-accent transition-all shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000] bg-white text-black"
        >
          {language === 'ta' ? 'EN' : 'தமிழ்'}
        </button>
        
        {tableNumber && (
          <div className="px-3 py-1 bg-black text-white text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#f2ca50]">
            {tableNumber === 'Parcel' ? t('parcel_order') : `${t('table')} ${tableNumber}`}
          </div>
        )}
      </div>
    </header>
  );
};

export default MenuHeader;
