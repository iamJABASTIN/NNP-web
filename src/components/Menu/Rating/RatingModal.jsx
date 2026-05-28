import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GOOGLE_MAPS_REVIEW_URL } from '../../../constants/google';
import RatingInput from './RatingInput';
import GooglePrompt from './GooglePrompt';
import ThankYou from './ThankYou';

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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_#000000] overflow-hidden"
          >
            {!submitted ? (
              <RatingInput
                activeStar={activeStar}
                rating={rating} setRating={setRating}
                hoveredStar={hoveredStar} setHoveredStar={setHoveredStar}
                feedback={feedback} setFeedback={setFeedback}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onClose={handleClose}
              />
            ) : submittedRating >= 4 ? (
              <GooglePrompt onRedirect={handleGoogleRedirect} onClose={handleClose} />
            ) : (
              <ThankYou onClose={handleClose} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
