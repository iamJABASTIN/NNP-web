import React from 'react';
import { motion } from 'motion/react';
import { UtensilsCrossed, Plus, Minus } from 'lucide-react';

const MenuItemCard = ({ item, cart, addToCart, removeFromCart }) => {
  const cartItem = cart.find(i => i.id === item.id);

  return (
    <motion.div 
      layout
      className="flex flex-col border-4 border-black bg-white shadow-[4px_4px_0px_#000000] overflow-hidden group hover:-translate-y-1 transition-transform"
    >
      {/* Image Section */}
      <div className="aspect-square bg-muted/20 border-b-4 border-black relative overflow-hidden flex-shrink-0">
         {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
         ) : (
            <UtensilsCrossed className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/10" size={32} />
         )}
         
         {/* Diet Indicator Badge */}
         <div className="absolute top-2 right-2 z-10">
           <div className={`w-5 h-5 border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_#000000] ${item.veg_type === 'veg' ? 'bg-green-100' : 'bg-red-100'}`}>
             <div className={`w-2 h-2 rounded-full ${item.veg_type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
           </div>
         </div>
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="text-xs md:text-sm font-black uppercase leading-tight line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
            {item.name}
          </h3>
          <p className="hidden md:block text-[10px] text-black/60 font-medium leading-tight mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm md:text-lg font-black italic">₹{item.price}</span>
          
          {cartItem ? (
            <div className="flex items-center justify-between bg-accent border-2 border-black p-1">
              <button onClick={() => removeFromCart(item.id)} className="p-1 hover:scale-125 transition-transform"><Minus size={14} className="stroke-[3px]"/></button>
              <span className="text-xs font-black">{cartItem.quantity}</span>
              <button onClick={() => addToCart(item)} className="p-1 hover:scale-125 transition-transform"><Plus size={14} className="stroke-[3px]"/></button>
            </div>
          ) : (
            <button 
              onClick={() => addToCart(item)}
              className="w-full py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest border-r-2 border-b-2 border-accent hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
