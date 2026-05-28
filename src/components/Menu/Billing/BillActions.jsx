import React from 'react';
import { Download, Share2, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const BillActions = ({ handleDownload, handleShare, canShare, isGenerating }) => {
  const { t } = useLanguage();

  return (
    <div className="px-6 py-5 border-t-4 border-black bg-white">
      {isGenerating && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <Loader2 size={14} className="animate-spin text-black/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
            {t('generating_pdf', 'Generating PDF...')}
          </span>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          aria-label="Download bill as PDF"
          className="flex-1 py-4 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-r-4 border-b-4 border-accent hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
        >
          <Download size={16} strokeWidth={3} className="text-accent" />
          {t('download_pdf', 'Download PDF')}
        </button>
        {canShare && (
          <button
            onClick={handleShare}
            disabled={isGenerating}
            aria-label="Share bill via WhatsApp or other apps"
            className="flex-1 py-4 bg-accent text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-4 border-black shadow-[4px_4px_0px_#000000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000000] transition-all active:translate-y-0 active:shadow-[2px_2px_0px_#000000] disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            <Share2 size={16} strokeWidth={3} />
            {t('share', 'Share')}
          </button>
        )}
      </div>
    </div>
  );
};

export default BillActions;
