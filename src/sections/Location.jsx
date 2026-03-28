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
              <span>51, Siruvalur, Gobi Main Road,<br />
                                Opposite TMB Bank, <br/>Gobichettipalayam Locality,<br />
                                Gobichettipalayam.<br /><br className="hidden sm:block" />Tamil Nadu 638054</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-accent font-black">TEL:</span>
              <span className="text-lg md:text-2xl">+91 82201 39158</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-accent font-black">DIR:</span>
              <a 
                href="https://maps.app.goo.gl/RvZgXoMLYnZWVMvm7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-black uppercase underline decoration-4 decoration-accent hover:text-accent transition-all underline-offset-8"
              >
                Get Directions
              </a>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t-2 border-black pt-12">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-accent">New Nellai Punjabi</h4>
            <p className="text-sm font-bold">11:00 AM — 11:00 PM</p>
            <p className="text-[10px] font-black uppercase opacity-60">Open Daily</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-accent">Princy Mini Mahal</h4>
            <p className="text-sm font-bold">24/7 Booking</p>
            <p className="text-[10px] font-black uppercase opacity-60">Always Available</p>
          </div>
          <div className="sm:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-accent">Asha Foods</h4>
            <p className="text-sm font-bold">08:00 AM — 10:00 PM</p>
            <p className="text-[10px] font-black uppercase opacity-60">Retail & Wholesale</p>
          </div>
        </div>
      </div>
      <div className="relative group w-full">
        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-black -z-10 group-hover:top-0 group-hover:left-0 transition-all"></div>
        <div className="h-[350px] sm:h-[450px] md:h-[500px] w-full bg-muted border-4 border-black relative grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d884.94866507641!2d77.4563892!3d11.3638682!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba91734c2ff6491%3A0xd3329c909d353d53!2sNew%20nellai%20Punjabi%20restaurant%26%20bakery%20and%20princy%20mini%20mahal!5e1!3m2!1sen!2sin!4v1769424708299!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            title="Location" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="filter contrast-125 saturate-50"
          ></iframe>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
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
