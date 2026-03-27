import React from 'react';
import { Truck, Package, Award } from "lucide-react";

const AshaFoods = () => (
  <section id="retail" className="py-24 px-8 md:px-24 bg-muted border-y-4 border-black text-black">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter">Asha Foods<span className="text-accent">_</span></h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] mt-4">Structural Wholesale & Retail</p>
        </div>
        <div className="h-px bg-black flex-grow mx-12 hidden md:block"></div>
        <a className="text-xs font-black uppercase underline decoration-4 decoration-accent hover:text-accent transition-all underline-offset-8" href="#">Global Catalog</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black bg-black">
        {[
          { title: "Bulk Ops", desc: "Supply chain optimization for high-volume culinary entities.", icon: Package, link: "Enter Portal" },
          { title: "Spice Lab", desc: "Molecularly balanced spice collections for the home studio.", icon: Award, link: "Shop Collection" },
          { title: "Logistics", desc: "Precise international distribution of heritage flavors.", icon: Truck, link: "Partner Up" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-12 hover:bg-accent group transition-colors cursor-pointer border-r-4 last:border-r-0 border-black">
            <item.icon className="text-4xl mb-6 text-black" size={40} strokeWidth={1.5} />
            <h3 className="text-2xl font-black uppercase mb-4">{item.title}</h3>
            <p className="text-sm leading-relaxed mb-8">{item.desc}</p>
            <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1">{item.link}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AshaFoods;
