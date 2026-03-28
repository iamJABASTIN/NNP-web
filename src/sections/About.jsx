import React from 'react';
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import about from "../assets/about.webp"

const About = () => (
  <section id="legacy" className="py-16 md:py-24 px-6 sm:px-8 md:px-24 bg-muted relative text-black overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full md:w-1/2 relative"
      >
        <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-full h-full border-[8px] md:border-[12px] border-accent/20 z-0"></div>
        <img 
          alt="Artisan Chef" 
          className="relative z-10 w-full aspect-square object-cover border-4 border-black" 
          src={about}
        />
      </motion.div>
      <div className="w-full md:w-1/2 space-y-8 md:space-y-10">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-l-8 border-black pl-6 md:pl-8">New Nellai<br />Punjabi</h2>
        <div className="space-y-4 md:space-y-6 text-lg md:text-xl font-light leading-relaxed">
          <p>Established in <span className="font-black">2015</span>, we dismantled the boundaries of traditional dining. We don't just serve food; we construct culinary experiences.</p>
          <p>Our kitchen is a studio. Our plates are canvases. South Indian aromatics meet the raw power of the Tandoor in a perfectly calculated balance.</p>
        </div>
      </div>
    </div>
  </section>
);

export default About;
