import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, ShoppingBag, MapPin, Phone, Instagram, Facebook } from 'lucide-react';

const HomeView = () => {
  return (
    <div className="flex flex-col gap-12 p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white p-12 border-4 border-black rounded-3xl shadow-[12px_12px_0px_#f2ca50]">
        <div className="relative z-10">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 leading-none">Punjabi Soul,<br/><span className="text-accent underline decoration-white decoration-8 underline-offset-8">Nellai Heart.</span></h1>
          <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-8 max-w-md italic">A culinary bridge between the vibrant streets of Punjab and the lush fields of Tirunelveli.</p>
          <div className="flex gap-4">
             <button className="bg-accent text-black px-8 py-4 font-black uppercase text-xs border-2 border-black hover:translate-x-2 hover:-translate-y-2 transition-all shadow-[6px_6px_0px_#ffffff]">Our Story</button>
             <button className="bg-transparent text-white px-8 py-4 font-black uppercase text-xs border-2 border-white/20 hover:border-white transition-all">Events</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 blur-sm pointer-events-none">
           <ChefHat size={320} strokeWidth={1} />
        </div>
      </section>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_#000000]">
           <ShoppingBag size={40} strokeWidth={3} className="text-accent mb-6" />
           <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Retail Corner</h3>
           <p className="text-xs font-black uppercase tracking-widest text-black/40">Take home our signature masalas and heritage kitchenware.</p>
        </div>
        <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_#000000]">
           <MapPin size={40} strokeWidth={3} className="text-accent mb-6" />
           <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Visit Us</h3>
           <p className="text-xs font-black uppercase tracking-widest text-black/40">Open every day (11 AM to 11 PM) for dine-in and takeaways.</p>
        </div>
      </div>

      {/* Footer / Socials */}
      <footer className="mt-8 pt-12 border-t-2 border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex gap-8">
            <Facebook size={24} className="hover:text-accent transition-colors cursor-pointer" />
            <Instagram size={24} className="hover:text-accent transition-colors cursor-pointer" />
            <Phone size={24} className="hover:text-accent transition-colors cursor-pointer" />
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-black/20 italic">© 2026 Nellai Punjabi Heritage</span>
      </footer>
    </div>
  );
};

export default HomeView;
