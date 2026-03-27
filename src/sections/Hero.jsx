import React from 'react';
import { motion } from "motion/react";

const Hero = () => (
  <section className="relative min-h-screen flex flex-col lg:grid lg:grid-cols-12 border-b-4 border-black pt-16">
    <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center bg-white order-2 lg:order-1 relative overflow-hidden text-black">
      <div className="absolute top-0 right-0 w-64 h-64 bg-muted -mr-32 -mt-32 rotate-45 pointer-events-none"></div>
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <p className="text-[10px] font-black tracking-[0.5em] uppercase mb-6 flex items-center">
          <span className="w-12 h-px bg-black mr-4"></span> Heritage Reimagined
        </p>
        <h1 className="text-7xl md:text-9xl font-black leading-none uppercase tracking-tighter mb-8 text-black">
          Modern<br />
          <span className="outline-text block" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>Alchemy</span>
          <span className="text-accent italic">Taste.</span>
        </h1>
        <p className="max-w-md text-lg font-medium leading-tight mb-12 text-black/80">
          Architectural precision in South Indian flavors and Punjabi grandiosity. A radical fusion for the avant-garde palate.
        </p>
        <button className="bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform border-r-4 border-b-4 border-accent">
          Explore Menu
        </button>
      </motion.div>
    </div>
    <div className="lg:col-span-5 h-[512px] lg:h-auto border-l-0 lg:border-l-4 border-black relative order-1 lg:order-2 overflow-hidden">
      <img 
        alt="Gourmet Dining" 
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
        src="https://picsum.photos/seed/restaurant/1200/1600"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 border-[24px] border-white/10 pointer-events-none"></div>
    </div>
  </section>
);

export default Hero;
