import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const ParcelButton = ({ manualTableName, setManualTableName }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
        {t('or_takeaway', 'Or take away:')}
      </p>
      <button
        onClick={() => setManualTableName('Parcel')}
        className={`w-full py-4 border-2 border-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${
          manualTableName === 'Parcel'
            ? 'bg-accent text-black shadow-[4px_4px_0px_#000000]'
            : 'bg-white text-black/60 hover:bg-black/5'
        }`}
      >
        <ShoppingBag size={14} />
        <span>{t('parcel_order', 'Order as Parcel')}</span>
      </button>
    </div>
  );
};

export default ParcelButton;
