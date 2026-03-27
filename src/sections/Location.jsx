import React from 'react';
import { Facebook, Instagram, Navigation } from "lucide-react";

const Location = () => (
  <section className="py-16 md:py-24 px-6 sm:px-8 md:px-24 text-black overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
      <div className="space-y-12 md:space-y-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 md:mb-8">Coordinates</h2>
          <div className="space-y-6 text-xl md:text-2xl font-light">
            <p className="flex items-start gap-4">
              <span className="text-accent font-black">LOC:</span>
              <span>42/A, Heritage Boulevard, High Grounds,<br className="hidden sm:block" />Tirunelveli, Tamil Nadu 627002</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-accent font-black">TEL:</span>
              <span className="text-lg md:text-2xl">+91 462 257 8890</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-accent font-black">SYS:</span>
              <span className="text-sm md:text-2xl break-all">concierge@newnellaipunjabi.com</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 border-t-2 border-black pt-12">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Uptime</h4>
            <p className="text-sm font-bold">12:00 — 23:00 WEEKDAY</p>
            <p className="text-sm font-bold">12:00 — 00:00 WEEKEND</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Interface</h4>
            <div className="flex gap-4">
              <a className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all text-xs font-bold" href="#"><Facebook size={16} /></a>
              <a className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all text-xs font-bold" href="#"><Instagram size={16} /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative group w-full">
        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-black -z-10 group-hover:top-0 group-hover:left-0 transition-all"></div>
        <div className="h-[350px] sm:h-[450px] md:h-[500px] w-full bg-muted border-4 border-black relative grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
          <img 
            alt="Map Grid" 
            className="w-full h-full object-cover opacity-80" 
            src="https://picsum.photos/seed/map/800/800"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black flex items-center justify-center rotate-45 border-4 border-accent">
              <Navigation className="text-white -rotate-45" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Location;
