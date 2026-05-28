import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const CartBar = ({ itemsCount, totalAmount, onViewCart }) => {
  const { t } = useLanguage();

  if (itemsCount === 0) return null;

  return (
    <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-[45] w-[90%] max-w-[420px] md:bottom-8 md:left-auto md:right-8 md:translate-x-0">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-accent border-4 border-black p-4 flex items-center justify-between shadow-[8px_8px_0px_#000000] gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-none-none border-2 border-white rotate-3">
            <ShoppingBag size={20} className="-rotate-3" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
              {itemsCount} {t('items', 'Items')}
            </span>
            <span className="text-lg font-black italic -mt-1 leading-none">₹{totalAmount}</span>
          </div>
        </div>

        <button 
          onClick={onViewCart}
          className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white hover:text-black transition-all border-2 border-black"
        >
          {t('view_cart', 'View Cart')}
          <ArrowRight size={14} />
        </button>
      </motion.div>
    </div>
  );
};

export default CartBar;
