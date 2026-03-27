import React from 'react';
import { motion } from "motion/react";

const PrinciMahal = () => (
  <section id="events" className="py-16 md:py-24 px-6 sm:px-8 md:px-24 bg-white overflow-hidden text-black">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-8 relative"
      >
        <div className="absolute -bottom-6 -right-6 w-full h-full bg-accent -z-10"></div>
        <img 
          alt="Banquet Hall" 
          className="w-full h-[350px] sm:h-[450px] md:h-[600px] object-cover border-4 border-black" 
          src="https://picsum.photos/seed/hall/1200/800"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-0 left-0 bg-black text-white px-8 py-4 -rotate-90 origin-top-left translate-y-full">
          <span className="text-xs font-black uppercase tracking-widest">Architectural Grandeur</span>
        </div>
      </motion.div>
      <div className="lg:col-span-4 space-y-6 sm:space-y-8 lg:pb-12">
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">Princi<br />Mahal.</h2>
        <p className="text-lg leading-snug">A geometric symphony of space and light, engineered for celebrations of up to 500 guests.</p>
        <div className="space-y-4 border-t-2 border-black pt-8">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span>Capacity</span>
            <span className="text-accent">500 Pax</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span>Catering</span>
            <span className="text-accent">Royal Fusion</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span>Service</span>
            <span className="text-accent">Platinum</span>
          </div>
        </div>
        <button className="w-full border-4 border-black py-4 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
          Inquire Blueprint
        </button>
      </div>
    </div>
  </section>
);

export default PrinciMahal;
