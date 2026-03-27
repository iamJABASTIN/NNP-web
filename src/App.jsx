import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import RestaurantHighlight from './sections/RestaurantHighlight';
import PrinciMahal from './sections/PrinciMahal';
import AshaFoods from './sections/AshaFoods';
import Location from './sections/Location';
import Footer from './sections/Footer';
import { Calendar } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-accent/30 selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <RestaurantHighlight />
        <PrinciMahal />
        <AshaFoods />
        <Location />
      </main>
      <Footer />
      
      {/* Floating Action Button */}
      <div className="fixed bottom-12 right-12 z-50">
        <button className="bg-accent text-black w-20 h-20 rounded-none border-4 border-black flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[8px_8px_0px_#000000]">
          <Calendar className="text-3xl" size={32} />
          <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Book</span>
        </button>
      </div>
    </div>
  );
}

export default App;