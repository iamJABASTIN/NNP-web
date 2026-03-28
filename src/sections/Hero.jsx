import React from 'react';
import { motion } from "motion/react";
import hero from "../assets/hero.webp"

const Hero = () => (
  <section className="relative min-h-screen flex flex-col lg:grid lg:grid-cols-12 border-b-4 border-black pt-16">
    <div className="lg:col-span-7 p-6 sm:p-8 md:p-16 flex flex-col justify-center bg-white order-2 lg:order-1 relative overflow-hidden text-black">
      <div className="absolute top-0 right-0 w-64 h-64 bg-muted -mr-32 -mt-32 rotate-45 pointer-events-none"></div>
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <p className="text-[10px] font-black tracking-[0.5em] uppercase mb-4 sm:mb-6 flex items-center">
          <span className="w-8 sm:w-12 h-px bg-black mr-4"></span> Heritage Reimagined
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black leading-none uppercase tracking-tighter mb-6 sm:mb-8 text-black">
          Family<br />
          <span className="outline-text block" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>Dining</span>
          <span className="text-accent italic">Spot.</span>
        </h1>
        <p className="max-w-md text-base sm:text-lg font-medium leading-tight mb-8 sm:mb-12 text-black/80">
          Where precise South Indian flavors meet grand Punjabi classics. A perfect blend for the modern palate.
        </p>
        <button className="w-full sm:w-auto bg-black text-white px-8 sm:px-10 py-4 sm:py-5 text-xs font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform border-r-4 border-b-4 border-accent">
          Dine in
        </button>
      </motion.div>
    </div>
    <div className="lg:col-span-5 h-[300px] sm:h-[400px] lg:h-auto border-l-0 lg:border-l-4 border-black relative order-1 lg:order-2 overflow-hidden">
      <img 
        alt="Food" 
        className="w-full h-full object-cover hover:grayscale-0 transition-all duration-1000" 
        src={hero}
      />
      <div className="absolute inset-0 border-[24px] border-white/10 pointer-events-none"></div>
    </div>
  </section>
);

export default Hero;
