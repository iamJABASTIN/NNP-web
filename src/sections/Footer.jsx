import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-black text-white py-16 md:py-24 px-6 sm:px-8 md:px-24">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
      {/* Brand & About */}
      <div className="md:col-span-5 space-y-8">
        <div className="text-4xl font-black uppercase tracking-tighter">
          Nellai<span className="text-accent">.</span>Punjabi
        </div>
        <p className="text-lg font-light leading-snug max-w-md opacity-60">
          A radical departure from the ordinary. Designing the future of Indian heritage through architectural culinary precision since 2015.
        </p>
      </div>

      {/* Quick Links */}
      <div className="md:col-span-3">
        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-accent">Navigation</h5>
        <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
          <li>
            <a href="#menu" className="hover:text-accent transition-colors flex items-center group">
              Menu <ArrowUpRight size={14} className="ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
            </a>
          </li>
          <li>
            <a href="#events" className="hover:text-accent transition-colors flex items-center group">
              Events <ArrowUpRight size={14} className="ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
            </a>
          </li>
          <li>
            <a href="#retail" className="hover:text-accent transition-colors flex items-center group">
              Retail <ArrowUpRight size={14} className="ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
            </a>
          </li>
          <li>
            <a href="#legacy" className="hover:text-accent transition-colors flex items-center group">
              About <ArrowUpRight size={14} className="ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
            </a>
          </li>
        </ul>
      </div>

      {/* Contact & Hours */}
      <div className="md:col-span-4 space-y-8">
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-accent">Contact</h5>
          <div className="space-y-4 text-sm font-light opacity-80">
            <p className="flex items-start gap-3">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <span>51, Siruvalur, Gobi Main Road,<br />Opposite TMB Bank, Gobichettipalayam, TN 638054</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-accent shrink-0" />
              <span>+91 82201 39158</span>
            </p>
          </div>
        </div>
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-accent">Experience</h5>
          <p className="text-sm font-bold uppercase tracking-wider">11:00 AM — 11:00 PM</p>
          <p className="text-[10px] uppercase tracking-widest opacity-40">Open Daily</p>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="mt-16 md:mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em]  text-center">
      <p>DEVELOPED BY <a href="https://www.linkedin.com/in/iamjabastin/" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors decoration-accent/30">JABASTIN A</a></p>
      <div className="hidden md:block w-px h-8 bg-white/20"></div>
      <p>© 2024 NEW NELLAI PUNJABI RESTAURANT</p>
      <div className="hidden md:block w-px h-8 bg-white/20"></div>
      <p>REDEFINING TRADITION</p>
    </div>

  </footer>
);

export default Footer;

