import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const CartFAB = ({ cart, onClick }) => {
  const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-50"
        >
          <button 
            onClick={onClick}
            className="w-full bg-accent border-4 border-black p-4 shadow-[8px_8px_0px_#000000] flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black rounded-none">
                  {totalQuantity}
              </div>
              <div className="text-left">
                  <p className="text-[8px] font-black uppercase tracking-widest text-black/40">View Order</p>
                  <p className="text-sm font-black uppercase tracking-tight">Checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black italic">₹{totalPrice}</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartFAB;
