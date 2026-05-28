import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../hooks/useLanguage';

const OrderItemRow = ({ item }) => {
  const { tField } = useLanguage();

  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-center justify-between px-6 py-4 hover:bg-accent/10 transition-colors group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-[10px] font-black bg-black text-white w-6 h-6 flex items-center justify-center flex-shrink-0">
          {item.quantity}
        </span>
        <span className="text-xs font-black uppercase tracking-tight truncate">
          {tField(item, 'name')}
        </span>
      </div>
      <div className="flex items-center gap-8">
        <span className="text-[10px] font-bold text-black/40 hidden sm:block">×{item.quantity}</span>
        <span className="text-sm font-black italic w-20 text-right">₹{item.lineTotal}</span>
      </div>
    </motion.div>
  );
};

export default OrderItemRow;
