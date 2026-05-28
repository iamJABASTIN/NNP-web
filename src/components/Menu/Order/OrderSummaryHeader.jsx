import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const OrderSummaryHeader = ({ placedAt, onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="px-8 pb-6 pt-2 flex items-center justify-between border-b-2 border-black/5">
      <div>
        <h3 className="text-2xl font-black uppercase tracking-tighter">
          {t('order_summary', 'Order Summary')}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-black/40 italic">
          {new Date(placedAt).toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-accent transition-colors group"
      >
        <X size={20} strokeWidth={3} className="text-white group-hover:text-black" />
      </button>
    </div>
  );
};

export default OrderSummaryHeader;
