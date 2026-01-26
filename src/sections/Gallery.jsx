import React from 'react';
import Title from '../components/Title';

const Gallery = () => {
  const photos = [
    { src: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1935&auto=format&fit=crop", cat: "Food", size: "large" }, // Large width
    { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop", cat: "Events", size: "tall" }, // Tall
    { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop", cat: "Ambience", size: "normal" },
    { src: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1887&auto=format&fit=crop", cat: "Product", size: "normal" },
    { src: "https://images.unsplash.com/photo-1577103231144-17075c1274d8?q=80&w=2073&auto=format&fit=crop", cat: "Kitchen", size: "wide" }, // Wide
    { src: "https://images.unsplash.com/photo-1525266178265-cc1a7caced2e?q=80&w=1587&auto=format&fit=crop", cat: "Crowd", size: "normal" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <Title subTitle="Our World" title="Gallery" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`relative group overflow-hidden rounded-xl shadow-md
               ${photo.size === 'large' ? 'col-span-2 row-span-2' : ''}
               ${photo.size === 'tall' ? 'col-span-1 row-span-2' : ''}
               ${photo.size === 'wide' ? 'col-span-2 row-span-1' : ''}
               ${photo.size === 'normal' ? 'col-span-1 row-span-1' : ''}
              `}
            >
              <img 
                src={photo.src} 
                alt={photo.cat} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-wider border border-white px-4 py-1 rounded-full">{photo.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
