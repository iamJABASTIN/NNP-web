import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const OrderSummaryItems = ({ items, totalAmount }) => {
  const { t, tField } = useLanguage();

  return (
    <div className="bg-white border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_#000000]">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black bg-black text-white w-6 h-6 flex items-center justify-center flex-shrink-0">
               {item.quantity}
             </span>
             <span className="text-xs font-black uppercase tracking-tight">
               {tField(item, 'name')}
             </span>
          </div>
          <span className="text-xs font-black italic">₹{item.lineTotal}</span>
        </div>
      ))}
      <div className="pt-4 border-t-2 border-dashed border-black/10 flex justify-between items-center">
         <span className="text-sm font-black uppercase tracking-widest">{t('total', 'Total')}</span>
         <span className="text-xl font-black italic">₹{totalAmount}</span>
      </div>
    </div>
  );
};

export default OrderSummaryItems;
