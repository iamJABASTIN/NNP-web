import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import RestaurantHighlight from './sections/RestaurantHighlight';
import PrinciMahal from './sections/PrinciMahal';
import AshaFoods from './sections/AshaFoods';
import Location from './sections/Location';
import Footer from './sections/Footer';
import { Utensils, ShoppingBag } from "lucide-react";

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
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 md:bottom-12 md:right-12 z-50 flex flex-col items-center gap-3">
        <button 
          onClick={() => window.location.href = '/orders'}
          className="bg-accent text-black w-14 h-14 md:w-20 md:h-20 rounded-none border-4 border-black flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[4px_4px_0px_#000000] md:shadow-[8px_8px_0px_#000000]"
        >
          <Utensils className="text-lg md:text-3xl" size={24} />
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-tighter mt-1 whitespace-nowrap">Dine In</span>
        </button>
      </div>
    </div>
  );
}

export default App;