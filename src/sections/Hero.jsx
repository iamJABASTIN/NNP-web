import React from 'react';
import Button from '../components/Button';
import { ChefHat, MapPin, Phone } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
          alt="Restaurant Ambiance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="animate-fade-in-up">          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
            New Nellai Punjabi
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light max-w-2xl mx-auto">
            Authentic Flavors, Royal Heritage. Experience the best of South Indian & Punjabi Cuisine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" className="min-w-[180px] justify-center text-lg">
              <ChefHat size={20} />
                Order Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
