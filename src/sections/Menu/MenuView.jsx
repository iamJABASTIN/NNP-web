import React from 'react';
import { MenuHeader, MenuControls, MenuItemCard } from '../../components/Menu';

const MenuView = ({ 
  items, cart, addToCart, removeFromCart, 
  searchTerm, setSearchTerm, 
  selectedCategory, setSelectedCategory, 
  categories, 
  vegFilter, setVegFilter,
  loading, tableNumber
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-accent animate-spin"></div>
      </div>
    );
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(searchLower);
    const nameTaMatch = item.name_ta ? item.name_ta.toLowerCase().includes(searchLower) : false;
    const matchesSearch = nameMatch || nameTaMatch;
    const matchesVeg = vegFilter === 'all' || item.veg_type === vegFilter;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <MenuHeader tableNumber={tableNumber} />

      <MenuControls 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        categories={categories}
        vegFilter={vegFilter} setVegFilter={setVegFilter}
      />

      <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard 
            key={item.id}
            item={item}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuView;
