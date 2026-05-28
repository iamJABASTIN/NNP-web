import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const RatingHeader = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black">
      <h3 className="text-sm font-black uppercase tracking-widest">
        {t('rate_your_experience', 'Rate Your Experience')}
      </h3>
      <button
        onClick={onClose}
        aria-label="Close rating"
        className="w-8 h-8 bg-black flex items-center justify-center hover:bg-accent transition-colors group"
      >
        <X size={16} strokeWidth={3} className="text-white group-hover:text-black" />
      </button>
    </div>
  );
};

export default RatingHeader;
