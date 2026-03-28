import React from 'react';
import { Truck, Package, Utensils } from "lucide-react";

const AshaFoods = () => (
  <section id="retail" className="py-16 md:py-24 px-6 sm:px-8 md:px-24 bg-muted border-y-4 border-black text-black overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
        <div>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Asha Foods<span className="text-accent">_</span></h2>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mt-3 md:mt-4">Fresh Chappathi, Poori & Parota</p>
        </div>
        <div className="h-px bg-black flex-grow mx-12 hidden md:block"></div>
        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest">Best.Quality</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black bg-black">
        {[
          { 
            title: "For Retailers", 
            desc: "We supply ready-made chappathi, poori, and parota in bulk for shops and small stores.", 
            icon: Truck 
          },
          { 
            title: "In Restaurant", 
            desc: "You can buy all our items directly from our restaurant to enjoy at home or eat here.", 
            icon: Utensils 
          },
          { 
            title: "Daily Fresh", 
            desc: "Everything we make is prepared every day with care for the best taste and quality.", 
            icon: Package 
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 sm:p-12 border-b-4 md:border-b-0 border-r-0 md:border-r-4 last:border-b-0 last:border-r-0 border-black">
            <item.icon className="text-3xl sm:text-4xl mb-6 text-black" size={40} strokeWidth={1.5} />
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-4">{item.title}</h3>
            <p className="text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AshaFoods;
