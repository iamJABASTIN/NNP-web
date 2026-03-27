import React from 'react';

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/95 border-b-2 border-black flex justify-between items-center px-6 md:px-12 py-4">
    <div className="text-2xl font-black tracking-tighter uppercase">
      Nellai<span className="text-accent">.</span>Punjabi
    </div>
    <div className="hidden lg:flex space-x-10 text-[10px] font-bold tracking-[0.3em] uppercase text-black">
      <a className="hover:text-accent transition-colors" href="#menu">Menu</a>
      <a className="hover:text-accent transition-colors" href="#events">Events</a>
      <a className="hover:text-accent transition-colors" href="#retail">Retail</a>
      <a className="hover:text-accent transition-colors" href="#legacy">Legacy</a>
    </div>
    <button className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all">
      Book Now
    </button>
  </nav>
);

export default Navbar;
