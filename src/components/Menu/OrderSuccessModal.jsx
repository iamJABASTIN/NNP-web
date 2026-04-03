import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccessModal = ({ show, onClose, orderId, total, onTrack }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.5, y: 100, rotate: -5 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.5, y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="w-full max-w-[420px] bg-white border-[6px] border-black p-10 shadow-[12px_12px_0px_#f2ca50] relative overflow-hidden text-center"
          >
            {/* Animated Background Element */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-0"
            />

            {/* Success Icon Animation */}
            <div className="flex justify-center mb-8 relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-black rounded-none flex items-center justify-center shadow-[6px_6px_0px_#f2ca50]"
              >
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                >
                   <Check size={48} className="text-accent stroke-[4px]" />
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10"
            >
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 leading-none">Order Placed!</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-8 italic">Kitchen is warming up the stove</p>
              
              <div className="bg-muted/30 border-2 border-black/10 p-6 mb-8 text-left space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-black/40 tracking-widest">Order ID</span>
                  <span className="tracking-tighter">#{orderId?.slice(-6).toUpperCase() || 'PENDING'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-black/40 tracking-widest">Total Amount</span>
                  <span className="text-xl font-black italic">₹{total}</span>
                </div>
                <div className="pt-3 border-t border-black/5 flex items-center gap-2 text-green-600 font-black text-[10px] uppercase">
                   <ShoppingBag size={12} />
                   <span>Estimated prep time: 15-20 mins</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={onTrack}
                  className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[6px_6px_0px_#000000]"
                >
                  Track My Order
                  <ArrowRight size={18} />
                </button>
                
                <button 
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors py-2"
                >
                  Continue Browsing Menu
                </button>
              </div>
            </motion.div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-accent border-l-4 border-b-4 border-black translate-x-6 -translate-y-6 rotate-45" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;
