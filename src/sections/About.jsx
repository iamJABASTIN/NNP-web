import React from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { Clock, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
                alt="Restaurant Interior"
                className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop" 
                alt="Chefs Cooking"
                className="rounded-2xl shadow-lg w-full h-64 object-cover"
              />
            </div>
            {/* Experience Badge */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl w-32 h-32 flex flex-col items-center justify-center border-4 border-secondary">
              <span className="text-3xl font-bold text-primary">10+</span>
              <span className="text-xs text-gray-500 uppercase font-semibold text-center">Years of Legacy</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <Title 
              subTitle="Who We Are" 
              title="A Legacy of Authentic Flavors" 
              align="left"
            />
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              New Nellai Punjabi isn't just a restaurant; it's a celebration of culinary heritage. With over 10 years of serving authentic South Indian and Punjabi cuisines, we bring you the taste of tradition on every plate.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our recipes have been passed down through generations, ensuring that every bite reminds you of home. From the spices we grind to the fresh ingredients we source locally, quality is our promise.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="text-center">
                  <div className="bg-secondary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Fast Service</span>
               </div>
               <div className="text-center">
                  <div className="bg-secondary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Award className="text-primary" size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Best Quality</span>
               </div>
               <div className="text-center">
                  <div className="bg-secondary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Users className="text-primary" size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Family Place</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
