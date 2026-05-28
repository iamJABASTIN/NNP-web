import React from 'react';
import { motion } from 'motion/react';
import { Plus, ChefHat, CircleCheck, Star } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const ActionButtons = ({ onSwitchToMenu, onRequestBill, onRateExperience, hasRated }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 mt-8">
      <motion.button
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onSwitchToMenu}
        className="w-full py-5 bg-accent border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[8px_8px_0px_#000000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#000000] transition-all active:translate-y-0 active:shadow-[4px_4px_0px_#000000]"
      >
        <Plus size={18} strokeWidth={3} />
        {t('add_more_items', 'Add More Items')}
      </motion.button>

      <motion.button
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onRequestBill}
        className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all"
      >
        <ChefHat size={18} strokeWidth={3} className="text-accent" />
        {t('request_bill', 'Request Bill')}
      </motion.button>

      {hasRated ? (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full py-5 bg-green-50 border-4 border-green-200 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
        >
          <CircleCheck size={18} strokeWidth={3} className="text-green-600" />
          <span className="text-green-700">{t('thanks_review', 'Thanks for the review')}</span>
        </motion.div>
      ) : (
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onRateExperience}
          className="w-full py-5 bg-white border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[6px_6px_0px_#f2ca50] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#f2ca50] transition-all active:translate-y-0 active:shadow-[3px_3px_0px_#f2ca50]"
        >
          <Star size={18} strokeWidth={3} className="text-accent fill-accent" />
          {t('rate_experience', 'Rate Experience')}
        </motion.button>
      )}
    </div>
  );
};

export default ActionButtons;
