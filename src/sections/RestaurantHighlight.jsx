import React from 'react';
import rice from "../assets/rice.jpg"
import panner from "../assets/panner.jpg"
import chilli from "../assets/chilli.jpg"
import biriyani from "../assets/briyani.jpg"
import meals from "../assets/meals.jpg"

const RestaurantHighlight = () => (
  <section id="menu" className="bg-black text-white">
    <div className="grid grid-cols-1 md:grid-cols-4 border-t-4 border-black">
      <div className="md:col-span-2 p-8 sm:p-12 md:p-24 flex flex-col justify-end bg-white text-black border-r-0 md:border-r-4 border-black border-b-4 md:border-b-0 min-h-[250px] md:min-h-0">
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 md:mb-8">Popular<br />Dishes<span className="text-accent">_</span></h2>
        <p className="text-sm sm:text-base md:text-lg font-bold">A curated selection of signature compositions.</p>
      </div>
      <div className="relative group overflow-hidden h-[300px] sm:h-[400px] md:h-auto border-b-4 md:border-b-0 border-white md:border-r-4">
        <img 
          alt="Non-veg items" 
          className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
          src={rice}
        />
        <div className="absolute top-8 left-8">
          <span className="bg-red-600 text-black px-3 py-1 text-[10px] font-black uppercase">Non-veg</span>
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <h3 className="text-2xl font-black uppercase tracking-tight">Fried rice</h3>
        </div>
      </div>
      <div className="relative group overflow-hidden h-[300px] sm:h-[400px] md:h-auto border-b-4 md:border-b-0 border-white md:border-white">
        <img 
          alt="Veg items" 
          className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
          src={panner}
        />
        <div className="absolute top-8 left-8">
          <span className="bg-green-600 text-black px-3 py-1 text-[10px] font-black uppercase">Veg</span>
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <h3 className="text-2xl font-black uppercase tracking-tight">Rotties</h3>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 border-t-0 md:border-t-4 border-white">
      {[
        { title: "Meals", desc: "Traditional South Indian Feast", img: meals },
        { title: "Chicken Chilli", desc: "Spicy Indo-Chinese Fusion", img: chilli },
        { title: "Chicken Briyani", desc: "Aromatic Basmati & Spices", img: biriyani }
      ].map((item, i) => (
        <div key={i} className="p-10 md:p-12 border-b-4 md:border-b-0 border-white border-r-0 md:border-r-4 last:border-b-0 last:border-r-0 flex flex-col items-center text-center">
          <img 
            alt={item.title} 
            className="w-32 h-32 object-cover rounded-full border-4 border-accent mb-6 hover:grayscale transition-all" 
            src={item.img}
          />
          <h4 className="text-xl font-black uppercase mb-2">{item.title}</h4>
          <p className="text-xs opacity-60">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default RestaurantHighlight;
