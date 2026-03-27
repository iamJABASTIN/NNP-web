import React from 'react';

const Title = ({ subTitle, title, align = 'center' }) => {
  const alignment = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <div className={`flex flex-col mb-12 ${alignment[align]}`}>
      <span className="font-label font-bold uppercase tracking-[0.2em] text-xs mb-4 text-primary/80">
        {subTitle}
      </span>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary relative">
        {title}
        <span className="block w-20 h-[2px] bg-primary mt-6 mx-auto"
              style={{ margin: align === 'left' ? '1.5rem 0 0 0' : align === 'right' ? '1.5rem 0 0 auto' : '1.5rem auto 0 auto' }}>
        </span>
      </h2>
    </div>
  );
};

export default Title;
