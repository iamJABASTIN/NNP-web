import React from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { ShoppingBag, Truck, Building, ArrowRight, Users } from 'lucide-react';

const ProductCard = ({ title, description, image, features }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
    <div className="h-48 overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 h-10">{description}</p>
      <div className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            {feature}
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full justify-center text-sm !py-2 border-primary text-primary hover:bg-primary hover:text-white">
        View Details <ArrowRight size={14} />
      </Button>
    </div>
  </div>
);

const AshaFoods = () => {
  const products = [
    {
      title: "Fresh Chapathi",
      description: "Soft, homestyle wheat chapathis made with premium atta, ready to eat.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop",
      features: ["Preservative Free", "100% Whole Wheat", "Soft for 24 hours"]
    },
    {
      title: "Flaky Parotta",
      description: "Multi-layered, crispy yet soft parottas perfect for curries.",
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1887&auto=format&fit=crop",
      features: ["Traditional Recipe", "Golden Crispy Layers", "Bulk Packs Available"]
    },
    {
      title: "Puffy Poori",
      description: "Deep-fried golden pooris that remain soft inside.",
      image: "https://images.unsplash.com/photo-1606491956689-2ea28c674675?q=80&w=1887&auto=format&fit=crop",
      features: ["Oil Free Texture", "Freshly Made", "Great for Events"]
    }
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <Title subTitle="Wholesale & Retail" title="Asha Foods" />

        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-gray-600">
            Bringing professional quality staples to your kitchen. We supply fresh, hygienic, and authentic food products to households, hotels, and events.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        {/* Bulk Order Section */}
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Partner With Us</h3>
              <p className="text-green-50 mb-8">
                We cater to bulk orders for hotels, canteens, and large gatherings. Get consistent quality at the best wholesale prices.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                   <Building size={20} />
                   <span>Hotels & Restaurants</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                   <Users size={20} />
                   <span>Function Orders</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                   <Truck size={20} />
                   <span>Fast Delivery</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <Button variant="secondary" className="text-lg px-8 py-4">
                Contact for Bulk Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AshaFoods;
