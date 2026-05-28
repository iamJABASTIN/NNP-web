import React from 'react';
import { motion } from 'motion/react';
import OrderItemRow from '../Order/OrderItemRow';
import { useLanguage } from '../../../hooks/useLanguage';

const ReceiptCard = ({ items, totalAmount }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-10 h-10 bg-accent border-l-4 border-b-4 border-black translate-x-5 -translate-y-5 rotate-45" />

      <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-black/[0.03]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          {t('item', 'Item')}
        </span>
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hidden sm:block">
            {t('qty', 'Qty')}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 w-20 text-right">
            {t('price', 'Price')}
          </span>
        </div>
      </div>

      <div className="divide-y divide-black/5">
        {items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="border-t-4 border-black px-6 py-5 bg-black/[0.02]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-black/40">
            {t('total', 'Total')}
          </span>
          <span className="text-2xl font-black italic">₹{totalAmount}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiptCard;
