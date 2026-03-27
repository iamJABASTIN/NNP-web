import React from 'react';
import { ArrowRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-black text-white py-24 px-8 md:px-24">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="md:col-span-2">
        <div className="text-4xl font-black uppercase tracking-tighter mb-8">Nellai<span className="text-accent">.</span>Punjabi</div>
        <p className="text-lg font-light leading-snug max-w-md opacity-60">
          A radical departure from the ordinary. Designing the future of Indian heritage through architectural culinary precision since 1994.
        </p>
      </div>
      <div>
        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-accent">Navigation</h5>
        <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
          <li><a className="hover:text-accent transition-colors" href="#">Laboratory Menu</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Booking System</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Blueprint Story</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Contact Interface</a></li>
        </ul>
      </div>
      <div>
        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-accent">Newsletter</h5>
        <div className="flex border-b-4 border-white pb-2 group focus-within:border-accent transition-colors">
          <input 
            className="bg-transparent border-none text-xs w-full focus:ring-0 text-white placeholder:text-white/30 font-bold uppercase tracking-widest outline-none" 
            placeholder="EMAIL ADDRESS" 
            type="email" 
          />
          <button className="hover:text-accent transition-colors"><ArrowRight size={20} /></button>
        </div>
        <p className="text-[9px] mt-4 opacity-40 uppercase tracking-widest">System updates only.</p>
      </div>
    </div>
    <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
      <p>© 2024 NELLAI PUNJABI CORE</p>
      <p>REDEFINING TRADITION</p>
    </div>
  </footer>
);

export default Footer;
