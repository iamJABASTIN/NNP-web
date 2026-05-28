import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import BillReceipt from './BillReceipt';
import BillActions from './BillActions';
import { useBillGeneration } from '../../../hooks/useBillGeneration';
import { useLanguage } from '../../../hooks/useLanguage';

const BillPreviewModal = ({ show, onClose, items, totalAmount, tableNumber, orderId, onBillTaken }) => {
  const receiptRef = useRef(null);
  const { downloadPDF, sharePDF, canShare, isGenerating } = useBillGeneration();
  const { t } = useLanguage();

  const filename = `bill-table${tableNumber || 'X'}-${Date.now()}`;

  const handleDownload = async () => {
    await downloadPDF(receiptRef, filename);
    onBillTaken?.();
  };
  const handleShare = async () => {
    await sharePDF(receiptRef, filename);
    onBillTaken?.();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[85vh] bg-[#F8F8F8] border-4 border-black shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white">
              <h3 className="text-sm font-black uppercase tracking-widest">{t('your_bill', 'Your Bill')}</h3>
              <button
                onClick={onClose} aria-label="Close bill preview"
                className="w-8 h-8 bg-black flex items-center justify-center hover:bg-accent transition-colors group"
              >
                <X size={16} strokeWidth={3} className="text-white group-hover:text-black" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
              <BillReceipt
                ref={receiptRef}
                items={items}
                totalAmount={totalAmount}
                tableNumber={tableNumber}
                orderId={orderId}
              />
            </div>

            <BillActions 
              handleDownload={handleDownload}
              handleShare={handleShare}
              canShare={canShare}
              isGenerating={isGenerating}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BillPreviewModal;
