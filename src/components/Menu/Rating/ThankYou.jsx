import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../hooks/useLanguage';

const ThankYou = ({ onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="px-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#f2ca50]"
      >
        <span className="text-2xl">🙏</span>
      </motion.div>

      <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
        {t('thank_you', 'Thank You!')}
      </h3>
      <p className="text-xs font-bold text-black/40 uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
        {t('feedback_thank_you_desc', 'Your feedback helps us improve. We appreciate your time!')}
      </p>

      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 2.5, ease: 'linear' }}
        className="h-1 bg-accent mt-8 origin-left"
      />
    </div>
  );
};

export default ThankYou;
