import React from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import RatingHeader from './RatingHeader';
import StarRatingGroup from './StarRatingGroup';
import { useLanguage } from '../../../hooks/useLanguage';

const RatingInput = ({ activeStar, rating, setRating, setHoveredStar, feedback, setFeedback, isSubmitting, onSubmit, onClose }) => {
  const { t } = useLanguage();
  const labels = ['', t('poor'), t('fair'), t('good'), t('great'), t('excellent')];

  return (
    <>
      <RatingHeader onClose={onClose} />

      <div className="px-6 py-8">
        <StarRatingGroup activeStar={activeStar} setRating={setRating} setHoveredStar={setHoveredStar} />

        <motion.div key={activeStar} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-black/40">
            {activeStar > 0 ? labels[activeStar] : t('tap_to_rate', 'Tap a star to rate')}
          </span>
        </motion.div>

        <div className="relative mb-6">
          <div className="absolute left-4 top-3.5"><MessageSquare size={14} className="text-black/20" /></div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t('feedback_placeholder', 'Tell us more (optional)')}
            rows={3}
            className="w-full pl-10 pr-4 py-3 bg-black/[0.03] border-2 border-black/10 text-sm font-bold placeholder:text-black/25 focus:outline-none focus:border-black resize-none transition-colors"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-r-4 border-b-4 border-accent hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed mx-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t('submitting', 'Submitting...')}
            </>
          ) : (
            t('submit_review', 'Submit Review')
          )}
        </motion.button>
      </div>
    </>
  );
};

export default RatingInput;
