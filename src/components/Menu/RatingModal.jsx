import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, ExternalLink, Loader2, MessageSquare } from 'lucide-react';
import { GOOGLE_MAPS_REVIEW_URL } from '../../constants/google';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const RatingModal = ({ show, onClose, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) return;
    try {
      await onSubmit(rating, feedback);
      setSubmittedRating(rating);
      setSubmitted(true);
    } catch {
      // Error handled in hook
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredStar(0);
    setFeedback('');
    setSubmitted(false);
    setSubmittedRating(0);
    onClose();
  };

  const handleGoogleRedirect = () => {
    window.open(GOOGLE_MAPS_REVIEW_URL, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  const activeStar = hoveredStar || rating;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_#000000] overflow-hidden"
          >
            {!submitted ? (
              <RatingInput
                activeStar={activeStar}
                rating={rating}
                setRating={setRating}
                hoveredStar={hoveredStar}
                setHoveredStar={setHoveredStar}
                feedback={feedback}
                setFeedback={setFeedback}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onClose={handleClose}
              />
            ) : submittedRating >= 4 ? (
              <GooglePrompt
                onRedirect={handleGoogleRedirect}
                onClose={handleClose}
              />
            ) : (
              <ThankYou onClose={handleClose} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── State 1: Rating Input ─────────────────────────────── */

const RatingInput = ({
  activeStar, rating, setRating,
  hoveredStar, setHoveredStar,
  feedback, setFeedback,
  isSubmitting, onSubmit, onClose,
}) => (
  <>
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black">
      <h3 className="text-sm font-black uppercase tracking-widest">Rate Your Experience</h3>
      <button
        onClick={onClose}
        aria-label="Close rating"
        className="w-8 h-8 bg-black flex items-center justify-center hover:bg-accent transition-colors group"
      >
        <X size={16} strokeWidth={3} className="text-white group-hover:text-black" />
      </button>
    </div>

    <div className="px-6 py-8">
      {/* Stars */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            className="p-1 transition-colors"
          >
            <Star
              size={36}
              strokeWidth={2.5}
              className={
                star <= activeStar
                  ? 'fill-accent text-black'
                  : 'fill-transparent text-black/20'
              }
            />
          </motion.button>
        ))}
      </div>

      {/* Rating label */}
      <motion.div
        key={activeStar}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="text-xs font-black uppercase tracking-widest text-black/40">
          {activeStar > 0 ? RATING_LABELS[activeStar] : 'Tap a star to rate'}
        </span>
      </motion.div>

      {/* Feedback textarea */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-3.5">
          <MessageSquare size={14} className="text-black/20" />
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us more (optional)"
          rows={3}
          className="w-full pl-10 pr-4 py-3 bg-black/[0.03] border-2 border-black/10 text-sm font-bold placeholder:text-black/25 focus:outline-none focus:border-black resize-none transition-colors"
        />
      </div>

      {/* Submit button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={rating === 0 || isSubmitting}
        className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-r-4 border-b-4 border-accent hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Rating'
        )}
      </motion.button>
    </div>
  </>
);

/* ─── State 2a: Google Maps Prompt (≥ 4 stars) ──────────── */

const GooglePrompt = ({ onRedirect, onClose }) => (
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
      Glad You Enjoyed It!
    </h3>
    <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-8 max-w-[260px] mx-auto leading-relaxed">
      Would you mind sharing your experience on Google Maps? It helps us a lot!
    </p>

    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onRedirect}
      className="w-full py-4 bg-accent border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[6px_6px_0px_#000000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all active:translate-y-0 active:shadow-[3px_3px_0px_#000000] mb-3"
    >
      <ExternalLink size={16} strokeWidth={3} />
      Share on Google Maps
    </motion.button>

    <button
      onClick={onClose}
      className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black/60 transition-colors"
    >
      Maybe Later
    </button>
  </div>
);

/* ─── State 2b: Thank You (< 4 stars) ───────────────────── */

const ThankYou = ({ onClose }) => {
  // Auto-close after 2.5 seconds
  React.useEffect(() => {
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
        Thank You!
      </h3>
      <p className="text-xs font-bold text-black/40 uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
        Your feedback helps us improve. We appreciate your time!
      </p>

      {/* Auto-close progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 2.5, ease: 'linear' }}
        className="h-1 bg-accent mt-8 origin-left"
      />
    </div>
  );
};

export default RatingModal;
