import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../hooks/useLanguage';

const GooglePrompt = ({ onRedirect, onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="px-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-16 h-16 bg-accent border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#000000]"
      >
        <span className="text-2xl">🎉</span>
      </motion.div>

      <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
        {t('enjoyed_title', 'Glad You Enjoyed It!')}
      </h3>
      <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-8 max-w-[260px] mx-auto leading-relaxed">
        {t('google_review_prompt', 'Would you mind sharing your experience on Google Maps? It helps us a lot!')}
      </p>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onRedirect}
        className="w-full py-4 bg-accent border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[6px_6px_0px_#000000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all active:translate-y-0 active:shadow-[3px_3px_0px_#000000] mb-3 mx-auto"
      >
        <ExternalLink size={16} strokeWidth={3} />
        {t('share_google', 'Share on Google Maps')}
      </motion.button>

      <button
        onClick={onClose}
        className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black/60 transition-colors mx-auto block"
      >
        {t('maybe_later', 'Maybe Later')}
      </button>
    </div>
  );
};

export default GooglePrompt;
