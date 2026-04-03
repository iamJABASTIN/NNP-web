import React from 'react';
import { motion } from 'motion/react';
import eatingIllustration from '../../assets/illustrators/eating.png';

const AuthHero = () => {
  return (
    <div className="hidden lg:flex w-full lg:col-span-12 xl:w-[45%] bg-white border-r-4 border-black relative overflow-hidden flex-col justify-center p-16">
      {/* Geometric Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-muted/50 -mr-32 -mt-32 rotate-45 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10"
      > 
        <h1 className="text-6xl xl:text-8xl font-black leading-none uppercase tracking-tighter mb-8 bg-white pr-4 inline-block">
          TASTE<br />
          <span className="text-accent italic">TRADITION.</span>
        </h1>
        
        <div className="relative group w-fit">
          <div className="absolute -inset-2 bg-accent opacity-0 transition-opacity rounded-full blur-2xl"></div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img 
              src={eatingIllustration} 
              alt="Eating" 
              className="w-80 xl:w-96 transition-all duration-700 pointer-events-none"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Brand Label */}
      <div className="absolute bottom-8 left-16">
        <h2 className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
          Nellai<span className="text-accent italic">.</span>Punjabi
        </h2>
      </div>
    </div>
  );
};

export default AuthHero;
