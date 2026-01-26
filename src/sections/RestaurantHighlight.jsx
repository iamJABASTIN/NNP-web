import React from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { Utensils, Star, Flame, Coffee } from 'lucide-react';

const SpecialtyCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-green-50">
    <div className="bg-secondary w-12 h-12 rounded-full flex items-center justify-center mb-4">
      <Icon className="text-primary" size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const MenuItem = ({ name, price, description, image }) => (
  <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
    <img src={image} alt={name} className="w-20 h-20 rounded-lg object-cover" />
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-gray-800">{name}</h4>
        <span className="text-primary font-bold">{price}</span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
    </div>
  </div>
);

const RestaurantHighlight = () => {
  const specialties = [
    { icon: Flame, title: "Tandoori Specials", description: "Smoky, succulent clay-oven delicacies tailored to perfection." },
    { icon: Utensils, title: "Chettinad Spices", description: "Authentic spicy blends from the heart of Tamil Nadu." },
    { icon: Coffee, title: "South Indian Breakfast", description: "Crispy dosas, fluffy idlis, and aromatic filter coffee." },
    { icon: Star, title: "Signature Biryanis", description: "Aromatic basmati rice cooked with premium meats and spices." },
  ];

  const menuPreview = [
    { name: "Chicken Biryani", price: "₹240", description: "Classic style fragrant rice with tender chicken piece.", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1950&auto=format&fit=crop" },
    { name: "Paneer Butter Masala", price: "₹180", description: "Soft cottage cheese in rich tomato gravy.", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1974&auto=format&fit=crop" },
    { name: "Mutton Chukka", price: "₹280", description: "Spicy dry roasted mutton with curry leaves.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop" },
    { name: "Mixed Grill Platter", price: "₹550", description: "Assortment of kebabs and tikkas.", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1935&auto=format&fit=crop" },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <Title subTitle="Our Specialties" title="New Nellai Punjabi" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {specialties.map((spec, index) => (
            <SpecialtyCard key={index} {...spec} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-accent">Menu Favourites</h3>
            <div className="grid gap-4">
              {menuPreview.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </div>
            <div className="mt-8">
              <Button variant="primary" className="w-full md:w-auto justify-center">
                <Utensils size={18} />
                Order Now via Dine-In
              </Button>
            </div>
          </div>
          
          <div className="relative h-[500px] hidden lg:block rounded-2xl overflow-hidden shadow-2xl">
            <img 
               src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop" 
               alt="Dining Ambience" 
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
               <h4 className="text-white text-2xl font-bold mb-2">Experience Luxury</h4>
               <p className="text-white/80">Dining that delights all your senses.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantHighlight;
