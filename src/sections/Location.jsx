import React from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

const ContactCard = ({ title, phone, hours, bg = "bg-white" }) => (
  <div className={`${bg} p-6 rounded-xl shadow-md`}>
    <h4 className="font-bold text-lg mb-4 text-primary">{title}</h4>
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Clock size={16} className="text-gray-500 mt-1" />
        <div>
          <span className="block text-sm text-gray-500">Opening Hours</span>
          <span className="font-medium text-gray-800">{hours}</span>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Phone size={16} className="text-gray-500 mt-1" />
        <div>
           <span className="block text-sm text-gray-500">Contact</span>
           <span className="font-medium text-gray-800">{phone}</span>
        </div>
      </div>
    </div>
  </div>
);

const Location = () => {
  return (
    <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
            <Title subTitle="Visit Us" title="Location & Contact" />

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <ContactCard 
                    title="New Nellai Punjabi" 
                    hours="11:00 AM - 11:00 PM (Daily)"
                    phone="+91 98765 43210"
                />
                <ContactCard 
                    title="Princi Mahal" 
                    hours="24/7 Booking Available"
                    phone="+91 98765 43211"
                />
                <ContactCard 
                    title="Asha Foods" 
                    hours="8:00 AM - 8:00 PM"
                    phone="+91 98765 43212"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center bg-white p-4 rounded-2xl shadow-lg">
                <div className="rounded-xl overflow-hidden h-[400px]">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.1554593843575!2d77.96229157467362!3d11.026944354527745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f7bd256dc9dd%3A0x6b77209930cb994f!2sPerundurai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1706428751433!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                
                <div className="p-4 lg:p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <MapPin className="text-primary" size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Our Address</h4>
                            <p className="text-gray-600 leading-relaxed">
                                123, Main Road, Near Bus Stand,<br />
                                Perundurai, Erode District,<br />
                                Tamil Nadu - 638052
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <Button variant="primary" className="justify-center">
                             Get Directions
                        </Button>
                        <Button variant="outline" className="justify-center border-gray-300 text-gray-700 hover:bg-gray-50">
                             <Mail size={18} /> Email Us
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Location;
