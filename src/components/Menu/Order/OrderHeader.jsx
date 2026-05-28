import React from 'react';
import { Receipt } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const OrderHeader = ({ status, tableNumber }) => {
  const { t } = useLanguage();
  const currentStatus = (status || 'pending').toLowerCase();

  const statusConfig = {
    pending:   { label: t('order_received', 'Order Received'), color: 'bg-blue-100 text-blue-800' },
    preparing: { label: t('in_kitchen', 'In Kitchen'),     color: 'bg-orange-100 text-orange-800' },
    ready:     { label: t('ready', 'Ready'),          color: 'bg-green-100 text-green-800' },
    served:    { label: t('served', 'Served'),         color: 'bg-black text-white' },
  };
  const cfg = statusConfig[currentStatus] || statusConfig.pending;

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black flex items-center justify-center shadow-[4px_4px_0px_#f2ca50]">
          <Receipt size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">
            {t('my_order', 'My Order')}
          </h2>
          {tableNumber && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {tableNumber === 'Parcel' ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                  {t('parcel_order', 'Parcel Order')}
                </span>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                    {t('table', 'Table')} #
                  </span>
                  <span className="text-xs font-black italic">{tableNumber}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-black ${cfg.color}`}>
        {cfg.label}
      </span>
    </div>
  );
};

export default OrderHeader;
