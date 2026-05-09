import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Star, CircleCheck, ClipboardList, ChevronRight } from 'lucide-react';
import { useRating } from '../../hooks/useRating';
import { useBillGeneration } from '../../hooks/useBillGeneration';
import BillReceipt from './BillReceipt';
import RatingModal from './RatingModal';
import { supabase } from '../../lib/supabase';

const OrderDetailModal = ({ show, onClose, order }) => {
  const receiptRef = useRef(null);
  const { hasRated, isSubmitting, submitRating } = useRating(order?.id);
  const { downloadPDF, isGenerating } = useBillGeneration();
  const [showRating, setShowRating] = useState(false);

  if (!order) return null;

  const orderItems = order.order_items.map(item => ({
    ...item.menu_item,
    quantity: item.quantity,
    lineTotal: item.quantity * item.unit_price,
    price: item.unit_price
  }));

  const handleDownload = async () => {
    const filename = `bill-${order.table?.table_number || 'X'}-${new Date(order.placed_at).getTime()}`;
    await downloadPDF(receiptRef, filename);
    
    // Stamp download if not already stamped
    if (!order.bill_requested_at) {
        await supabase
            .from('orders')
            .update({ bill_requested_at: new Date().toISOString() })
            .eq('id', order.id);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-up Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[120] bg-[#F8F8F8] border-t-4 border-black rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.2)] max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mt-4 mb-2" />

            {/* Header */}
            <div className="px-8 pb-6 pt-2 flex items-center justify-between border-b-2 border-black/5">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Order Summary</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40 italic">
                  {new Date(order.placed_at).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-accent transition-colors group"
              >
                <X size={20} strokeWidth={3} className="text-white group-hover:text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              {/* Items List */}
              <div className="bg-white border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_#000000]">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black bg-black text-white w-6 h-6 flex items-center justify-center">
                         {item.quantity}
                       </span>
                       <span className="text-xs font-black uppercase tracking-tight">{item.name}</span>
                    </div>
                    <span className="text-xs font-black italic">₹{item.lineTotal}</span>
                  </div>
                ))}
                <div className="pt-4 border-t-2 border-dashed border-black/10 flex justify-between items-center">
                   <span className="text-sm font-black uppercase tracking-widest">Total</span>
                   <span className="text-xl font-black italic">₹{order.total_amount}</span>
                </div>
              </div>

              {/* Off-screen Receipt for PDF Generation */}
              <div className="absolute opacity-0 pointer-events-none -left-[9999px] top-0">
                 <BillReceipt 
                   ref={receiptRef}
                   items={orderItems}
                   totalAmount={order.total_amount}
                   tableNumber={order.table?.table_number}
                   orderId={order.id}
                 />
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-b-4 border-r-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  <Download size={18} strokeWidth={3} className="text-accent" />
                  {isGenerating ? 'Generating...' : 'Download Bill'}
                </button>

                {hasRated ? (
                  <div className="w-full py-5 bg-green-50 border-2 border-green-200 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 text-green-700">
                    <CircleCheck size={18} strokeWidth={3} />
                    Reviewed & Shared
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRating(true)}
                    className="w-full py-5 bg-white border-2 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[6px_6px_0px_#f2ca50] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#f2ca50] transition-all"
                  >
                    <Star size={18} strokeWidth={3} className="text-accent fill-accent" />
                    Put a Review
                  </button>
                )}
              </div>
            </div>

            <RatingModal 
              show={showRating}
              onClose={() => setShowRating(false)}
              onSubmit={submitRating}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailModal;
