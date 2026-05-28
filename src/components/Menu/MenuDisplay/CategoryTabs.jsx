import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const CategoryTabs = ({ selectedCategory, setSelectedCategory, categories }) => {
  const { t, tField } = useLanguage();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar items-center">
      <button
        onClick={() => setSelectedCategory('all')}
        className={`whitespace-nowrap px-6 py-2 border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${
          selectedCategory === 'all' 
            ? 'bg-accent shadow-[2px_2px_0px_#000000]' 
            : 'bg-white hover:bg-muted/30'
        }`}
      >
        {t('all', 'All')}
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
          {tField(cat, 'name')}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
