import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

const StarRatingGroup = ({ activeStar, setRating, setHoveredStar }) => {
  return (
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
          className="p-1 transition-colors mx-auto"
        >
          <Star
            size={36}
            strokeWidth={2.5}
            className={star <= activeStar ? 'fill-accent text-black' : 'fill-transparent text-black/20'}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default StarRatingGroup;
