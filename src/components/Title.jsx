import React from 'react';

const Title = ({ subTitle, title, align = 'center' }) => {
  const alignment = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <div className={`flex flex-col mb-8 ${alignment[align]}`}>
      <span className="text-secondary-600 font-bold uppercase tracking-wider text-sm mb-2 text-primary">
        {subTitle}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative pb-4">
        {title}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary rounded-full block mt-2"
              style={{ left: align === 'left' ? '2rem' : align === 'right' ? 'calc(100% - 2rem)' : '50%' }}>
        </span>
      </h2>
    </div>
  );
};

export default Title;
