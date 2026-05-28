import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const AddItemsRow = ({ item }) => {
  const { tField } = useLanguage();

  return (
    <div className="flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[10px] font-black bg-black text-white w-6 h-6 flex items-center justify-center flex-shrink-0">
          {item.quantity}
        </span>
        <span className="text-xs font-black uppercase tracking-tight truncate">
          {tField(item, 'name')}
        </span>
      </div>
      <span className="text-sm font-black italic ml-4 flex-shrink-0">
        ₹{item.price * item.quantity}
      </span>
    </div>
  );
};

export default AddItemsRow;
