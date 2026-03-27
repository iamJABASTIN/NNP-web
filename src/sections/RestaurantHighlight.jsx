import React from 'react';

const RestaurantHighlight = () => (
  <section id="menu" className="bg-black text-white">
    <div className="grid grid-cols-1 md:grid-cols-4 border-t-4 border-black">
      <div className="md:col-span-2 p-8 sm:p-12 md:p-24 flex flex-col justify-end bg-white text-black border-r-0 md:border-r-4 border-black border-b-4 md:border-b-0 min-h-[250px] md:min-h-0">
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 md:mb-8">Menu<br />Lab<span className="text-accent">_</span></h2>
        <p className="text-sm sm:text-base md:text-lg font-bold">A curated selection of signature compositions.</p>
      </div>
      <div className="relative group overflow-hidden h-[300px] sm:h-[400px] md:h-auto border-b-4 md:border-b-0 border-white md:border-r-4">
        <img 
          alt="Tandoori Saffron" 
          className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
          src="https://picsum.photos/seed/saffron/600/800"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-8 left-8">
          <span className="bg-accent text-black px-3 py-1 text-[10px] font-black uppercase">Alpha</span>
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <h3 className="text-2xl font-black uppercase tracking-tight">Tandoori Saffron</h3>
        </div>
      </div>
      <div className="relative group overflow-hidden h-[300px] sm:h-[400px] md:h-auto border-b-4 md:border-b-0 border-white md:border-white">
        <img 
          alt="Artisan Textures" 
          className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
          src="https://picsum.photos/seed/bread/600/800"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-8 left-8">
          <span className="bg-accent text-black px-3 py-1 text-[10px] font-black uppercase">Beta</span>
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <h3 className="text-2xl font-black uppercase tracking-tight">Artisan Textures</h3>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 border-t-0 md:border-t-4 border-white">
      {[
        { title: "Signature Sweets", desc: "Linear Sugar Compositions", img: "sweet" },
        { title: "Nellai Filter", desc: "Vertical Pour Extraction", img: "coffee" },
        { title: "Herbivore Canvas", desc: "Botanical Structuralism", img: "green" }
      ].map((item, i) => (
        <div key={i} className="p-10 md:p-12 border-b-4 md:border-b-0 border-white border-r-0 md:border-r-4 last:border-b-0 last:border-r-0 flex flex-col items-center text-center">
          <img 
            alt={item.title} 
            className="w-32 h-32 rounded-full border-4 border-accent mb-6 grayscale hover:grayscale-0 transition-all" 
            src={`https://picsum.photos/seed/${item.img}/300/300`}
            referrerPolicy="no-referrer"
          />
          <h4 className="text-xl font-black uppercase mb-2">{item.title}</h4>
          <p className="text-xs opacity-60">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default RestaurantHighlight;
