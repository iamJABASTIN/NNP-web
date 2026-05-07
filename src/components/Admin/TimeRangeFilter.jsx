import React from 'react';
import { BORDER_BLACK } from '../../constants/adminStyles';

/**
 * Reusable Time Range Filter Component
 * Supports Today, Last Week, Last Month, and Custom Ranges
 */
const TimeRangeFilter = ({ activeRange, onRangeChange }) => {
  const options = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Segmented Control */}
      <div className={`flex bg-white ${BORDER_BLACK} p-1 shadow-[4px_4px_0px_#000000]`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onRangeChange({ ...activeRange, type: opt.value })}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all
              ${activeRange.type === opt.value 
                ? 'bg-black text-white' 
                : 'hover:bg-[#f2ca50] text-black/60'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Inline Custom Inputs */}
      {activeRange.type === 'custom' && (
        <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-black/40 uppercase">From</span>
            <input
              type="date"
              value={activeRange.start || ''}
              onChange={(e) => onRangeChange({ ...activeRange, start: e.target.value })}
              className={`p-1.5 text-[10px] font-black uppercase ${BORDER_BLACK} focus:outline-none focus:border-accent bg-white`}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-black/40 uppercase">To</span>
            <input
              type="date"
              value={activeRange.end || ''}
              onChange={(e) => onRangeChange({ ...activeRange, end: e.target.value })}
              className={`p-1.5 text-[10px] font-black uppercase ${BORDER_BLACK} focus:outline-none focus:border-accent bg-white`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeFilter;
