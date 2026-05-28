import React from 'react';
import { Download, CircleCheck, Star } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const OrderSummaryActions = ({ isGenerating, handleDownload, hasRated, onRateClick }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-b-4 border-r-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all disabled:opacity-50"
      >
        <Download size={18} strokeWidth={3} className="text-accent" />
        {isGenerating ? t('generating_pdf', 'Generating...') : t('download_pdf', 'Download Bill')}
      </button>

      {hasRated ? (
        <div className="w-full py-5 bg-green-50 border-2 border-green-200 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 text-green-700">
          <CircleCheck size={18} strokeWidth={3} />
          {t('reviewed_shared', 'Reviewed & Shared')}
        </div>
      ) : (
        <button
          onClick={onRateClick}
          className="w-full py-5 bg-white border-2 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[6px_6px_0px_#f2ca50] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#f2ca50] transition-all"
        >
          <Star size={18} strokeWidth={3} className="text-accent fill-accent" />
          {t('rate_experience', 'Put a Review')}
        </button>
      )}
    </div>
  );
};

export default OrderSummaryActions;
