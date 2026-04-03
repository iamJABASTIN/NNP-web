import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-8 py-4 rounded-none-default font-bold transition-all duration-500 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 tracking-wide uppercase text-sm";
  
  const variants = {
    primary: "gold-gradient text-background shadow-[0_10px_20px_-10px_rgba(242,202,80,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(242,202,80,0.5)]",
    secondary: "glass-obsidian text-primary border-outline-variant/30 hover:border-primary/50",
    outline: "border border-outline-variant/30 text-secondary hover:border-primary/50 hover:bg-surface-highest/30",
    ghost: "text-secondary hover:text-primary transition-colors"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
