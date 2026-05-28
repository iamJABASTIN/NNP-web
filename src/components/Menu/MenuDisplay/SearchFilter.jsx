import React from 'react';
import { Search, Salad, Drumstick } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const SearchFilter = ({ searchTerm, setSearchTerm, vegFilter, setVegFilter }) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative border-4 border-black bg-white group focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
        <input 
          type="text"
          placeholder={t('search_dishes', 'Search menu items...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 outline-none font-bold uppercase text-xs"
        />
      </div>

      <button
        onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
        className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all active:scale-95 shadow-[4px_4px_0px_#000000] ${
          vegFilter === 'veg' ? 'bg-green-600 text-white' : 'bg-white'
        }`}
        aria-label={t('veg_only', 'Veg Only')}
      >
        <Salad size={22} className={vegFilter === 'veg' ? 'text-white' : 'text-green-600'} />
      </button>
      
      <button
        onClick={() => setVegFilter(vegFilter === 'non_veg' ? 'all' : 'non_veg')}
        className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all active:scale-95 shadow-[4px_4px_0px_#000000] ${
          vegFilter === 'non_veg' ? 'bg-red-600 text-white' : 'bg-white'
        }`}
        aria-label={t('non_veg_only', 'Non-Veg Only')}
      >
        <Drumstick size={22} className={vegFilter === 'non_veg' ? 'text-white' : 'text-red-600'} />
      </button>
    </div>
  );
};

export default SearchFilter;
