import React from 'react';
import { ClipboardList } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const EmptyState = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-12">
      <div className="w-24 h-24 border-4 border-black/10 flex items-center justify-center mb-8">
        <ClipboardList size={48} className="text-black/10" />
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
        {t('no_active_orders', 'No Active Orders')}
      </h3>
      <p className="text-xs font-bold uppercase tracking-widest text-black/40">
        {t('hungry_head_to_menu', 'Hungry? Head over to the menu and place your first order!')}
      </p>
    </div>
  );
};

export default EmptyState;
