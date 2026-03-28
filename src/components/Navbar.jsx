import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 border-b-2 border-black flex justify-between items-center px-4 md:px-12 py-4">
      <div className="text-xl md:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
        Nellai<span className="text-accent">.</span>Punjabi
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-10 text-[10px] font-bold tracking-[0.3em] uppercase text-black">
        <a className="hover:text-accent transition-colors" href="#legacy">About</a>
        <a className="hover:text-accent transition-colors" href="#menu">Menu</a>
        <a className="hover:text-accent transition-colors" href="#events">Events</a>
        <a className="hover:text-accent transition-colors" href="#retail">Retail</a>
      </div>

      <div className="flex items-center space-x-4">
        <button className="hidden sm:block bg-black text-white px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all whitespace-nowrap">
          Book Now
        </button>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-black hover:text-accent transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-white z-[60] border-t-2 border-black p-8 shadow-2xl overflow-y-auto">
          <div className="flex flex-col space-y-8 text-xl font-black uppercase tracking-widest text-black">
            <a className="hover:text-accent transition-colors" href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a>
            <a className="hover:text-accent transition-colors" href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
            <a className="hover:text-accent transition-colors" href="#retail" onClick={() => setIsMenuOpen(false)}>Retail</a>
            <a className="hover:text-accent transition-colors" href="#legacy" onClick={() => setIsMenuOpen(false)}>Legacy</a>
            <button className="bg-black text-white px-6 py-4 text-sm font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all text-left">
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
