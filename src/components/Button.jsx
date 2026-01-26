import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-green-800 hover:shadow-green-900/20",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-green-50",
    outline: "border-2 border-white text-white hover:bg-white/10"
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
