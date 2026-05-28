import React from 'react';
import SearchFilter from './SearchFilter';
import CategoryTabs from './CategoryTabs';

const MenuControls = ({ 
  searchTerm, setSearchTerm, 
  selectedCategory, setSelectedCategory, 
  categories, 
  vegFilter, setVegFilter 
}) => {
  return (
    <div className="p-6 space-y-4">
      <SearchFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        vegFilter={vegFilter} 
        setVegFilter={setVegFilter} 
      />
      <CategoryTabs 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        categories={categories} 
      />
    </div>
  );
};

export default MenuControls;
