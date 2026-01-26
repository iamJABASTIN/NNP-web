import React from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { Users, Calendar, Music, Phone } from 'lucide-react';

const PrinciMahal = () => {
  const features = [
    { icon: Users, text: "80-150 Pax Capacity" },
    { icon: Calendar, text: "All Event Types" },
    { icon: Music, text: "Audio System Available" },
  ];

  const images = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1979&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505236858274-0959ac156d0f?q=80&w=1948&auto=format&fit=crop"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <Title subTitle="Event Space" title="Princi Mahal" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">
              Mini Mahal for Memorable Functions
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Looking for an intimate space to celebrate your special moments? Princi Mahal offers the perfect setting for small functions, birthdays, engagements, and corporate meetings.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-primary font-medium">
                  <feature.icon size={18} />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl mb-8">
              <h4 className="font-bold text-gray-800 mb-2">Perfect For:</h4>
              <ul className="text-gray-600 grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">✓ Birthday Parties</li>
                <li className="flex items-center gap-2">✓ Engagement Ceremonies</li>
                <li className="flex items-center gap-2">✓ Corporate Meetings</li>
                <li className="flex items-center gap-2">✓ Family Get-togethers</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">
                <Phone size={18} />
                Call for Booking
              </Button>
              <Button variant="secondary">
                WhatsApp Enquiry
              </Button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="order-1 lg:order-2 grid grid-rows-2 gap-4 h-[500px]">
            <div className="row-span-1 rounded-2xl overflow-hidden shadow-lg">
               <img 
                 src={images[0]} 
                 alt="Princi Mahal Main Hall" 
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
               />
            </div>
            <div className="grid grid-cols-2 gap-4 row-span-1">
               <div className="rounded-2xl overflow-hidden shadow-lg">
                 <img 
                   src={images[1]} 
                   alt="Decoration Setup" 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                 />
               </div>
               <div className="rounded-2xl overflow-hidden shadow-lg">
                 <img 
                   src={images[2]} 
                   alt="Gathering" 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrinciMahal;
