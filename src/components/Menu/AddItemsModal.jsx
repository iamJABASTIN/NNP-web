import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ArrowRight } from 'lucide-react';

const AddItemsModal = ({ show, onClose, cart, loading, onConfirm }) => {
  const totalAmount = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 flex items-end sm:items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="w-full max-w-[420px] bg-white border-4 border-black shadow-[8px_8px_0px_#f2ca50] relative"
          >
            <button 
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors z-10"
            >
              ×
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b-4 border-black bg-accent/10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-accent border-2 border-black flex items-center justify-center">
                  <Plus size={16} strokeWidth={3} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50">Adding to Existing Order</p>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Confirm New Items</h2>
            </div>

            {/* Item List */}
            <div className="divide-y divide-black/5 max-h-[40vh] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-black bg-black text-white w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {item.quantity}
                    </span>
                    <span className="text-xs font-black uppercase tracking-tight truncate">{item.name}</span>
                  </div>
                  <span className="text-sm font-black italic ml-4 flex-shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total & Actions */}
            <div className="border-t-4 border-black p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-black/40">Additional Total</span>
                <span className="text-2xl font-black italic">₹{totalAmount}</span>
              </div>

              <button 
                onClick={onConfirm}
                disabled={loading}
                className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    <span>Add to My Order</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddItemsModal;
