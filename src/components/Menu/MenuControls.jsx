import React from 'react';
import { Search, Salad, Drumstick } from 'lucide-react';

const MenuControls = ({ 
  searchTerm, setSearchTerm, 
  selectedCategory, setSelectedCategory, 
  categories, 
  vegFilter, setVegFilter 
}) => {
  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 relative border-4 border-black bg-white group focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
          <input 
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 outline-none font-bold uppercase text-xs"
          />
        </div>

        {/* Compact Diet Toggles */}
        <button
          onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
          className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all active:scale-95 shadow-[4px_4px_0px_#000000] ${
            vegFilter === 'veg' ? 'bg-green-600 text-white' : 'bg-white'
          }`}
        >
          <Salad size={22} className={vegFilter === 'veg' ? 'text-white' : 'text-green-600'} />
        </button>
        
        <button
          onClick={() => setVegFilter(vegFilter === 'non_veg' ? 'all' : 'non_veg')}
          className={`w-12 h-12 flex items-center justify-center border-4 border-black transition-all active:scale-95 shadow-[4px_4px_0px_#000000] ${
            vegFilter === 'non_veg' ? 'bg-red-600 text-white' : 'bg-white'
          }`}
        >
          <Drumstick size={22} className={vegFilter === 'non_veg' ? 'text-white' : 'text-red-600'} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar items-center">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`whitespace-nowrap px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${
            selectedCategory === 'all' 
              ? 'bg-accent shadow-[2px_2px_0px_#000000]' 
              : 'bg-white hover:bg-muted/30'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${
              selectedCategory === cat.id 
                ? 'bg-accent shadow-[2px_2px_0px_#000000]' 
                : 'bg-white hover:bg-muted/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuControls;
