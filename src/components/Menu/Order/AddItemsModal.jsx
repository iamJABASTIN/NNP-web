import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ArrowRight } from 'lucide-react';
import AddItemsRow from './AddItemsRow';
import { useLanguage } from '../../../hooks/useLanguage';

const AddItemsModal = ({ show, onClose, cart, loading, onConfirm }) => {
  const { t } = useLanguage();
  const totalAmount = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 flex items-end sm:items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="w-full max-w-[420px] bg-white border-4 border-black shadow-[8px_8px_0px_#f2ca50] relative"
          >
            <button 
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors z-10"
            >
              ×
            </button>

            <div className="px-6 pt-6 pb-4 border-b-4 border-black bg-accent/10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-accent border-2 border-black flex items-center justify-center"><Plus size={16} strokeWidth={3} /></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50">{t('add_more_items', 'Add More Items')}</p>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{t('confirm_order_addition', 'Confirm Order Addition')}</h2>
            </div>

            <div className="divide-y divide-black/5 max-h-[40vh] overflow-y-auto">
              {cart.map((item) => <AddItemsRow key={item.id} item={item} />)}
            </div>

            <div className="border-t-4 border-black p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-black/40">{t('total', 'Total')}</span>
                <span className="text-2xl font-black italic">₹{totalAmount}</span>
              </div>

              <button 
                onClick={onConfirm} disabled={loading}
                className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50 mx-auto"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" /> : (
                  <>
                    <span>{t('yes_add', 'Yes, Add Items')}</span>
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
