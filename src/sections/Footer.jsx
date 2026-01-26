import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 border-b border-gray-800 pb-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-primary">New Nellai Punjabi</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Authentic South Indian & Punjabi cuisine. A family tradition of serving quality food for over 25 years.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Menu</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Book Mahal</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Bulk Orders</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Our Services</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Dine-In Support</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Outdoor Catering</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Event Hosting</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Food Delivery</a></li>
                        </ul>
                    </div>


                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                     <p>&copy; {new Date().getFullYear()} New Nellai Punjabi. All rights reserved.</p>
                     <p>Designed  by <span className="text-gray-400">Antigravity</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
