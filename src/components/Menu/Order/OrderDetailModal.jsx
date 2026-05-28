import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRating } from '../../../hooks/useRating';
import { useBillGeneration } from '../../../hooks/useBillGeneration';
import BillReceipt from '../Billing/BillReceipt';
import RatingModal from '../Rating/RatingModal';
import OrderSummaryHeader from './OrderSummaryHeader';
import OrderSummaryItems from './OrderSummaryItems';
import OrderSummaryActions from './OrderSummaryActions';
import { supabase } from '../../../lib/supabase';

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[120] bg-[#F8F8F8] border-t-4 border-black rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.2)] max-h-[92vh] flex flex-col overflow-hidden"
          >
            <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mt-4 mb-2" />

            <OrderSummaryHeader placedAt={order.placed_at} onClose={onClose} />

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              <OrderSummaryItems items={orderItems} totalAmount={order.total_amount} />

              <div className="absolute opacity-0 pointer-events-none -left-[9999px] top-0">
                 <BillReceipt 
                   ref={receiptRef}
                   items={orderItems}
                   totalAmount={order.total_amount}
                   tableNumber={order.table?.table_number}
                   orderId={order.id}
                 />
              </div>

              <OrderSummaryActions
                isGenerating={isGenerating}
                handleDownload={handleDownload}
                hasRated={hasRated}
                onRateClick={() => setShowRating(true)}
              />
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
