import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, Loader2 } from 'lucide-react';
import BillReceipt from './BillReceipt';
import { useBillGeneration } from '../../hooks/useBillGeneration';

const BillPreviewModal = ({ show, onClose, items, totalAmount, tableNumber, orderId, onBillTaken }) => {
  const receiptRef = useRef(null);
  const { downloadPDF, sharePDF, canShare, isGenerating } = useBillGeneration();

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[85vh] bg-[#F8F8F8] border-4 border-black shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white">
              <h3 className="text-sm font-black uppercase tracking-widest">Your Bill</h3>
              <button
                onClick={onClose}
                aria-label="Close bill preview"
                className="w-8 h-8 bg-black flex items-center justify-center hover:bg-accent transition-colors group"
              >
                <X size={16} strokeWidth={3} className="text-white group-hover:text-black" />
              </button>
            </div>

            {/* Receipt — scrollable */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <BillReceipt
                ref={receiptRef}
                items={items}
                totalAmount={totalAmount}
                tableNumber={tableNumber}
                orderId={orderId}
              />
            </div>

            {/* Action buttons — fixed at bottom */}
            <div className="px-6 py-5 border-t-4 border-black bg-white">
              {isGenerating && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Loader2 size={14} className="animate-spin text-black/40" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                    Generating PDF...
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  aria-label="Download bill as PDF"
                  className="flex-1 py-4 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-r-4 border-b-4 border-accent hover:translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} strokeWidth={3} className="text-accent" />
                  Download PDF
                </button>
                {canShare && (
                  <button
                    onClick={handleShare}
                    disabled={isGenerating}
                    aria-label="Share bill via WhatsApp or other apps"
                    className="flex-1 py-4 bg-accent text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-4 border-black shadow-[4px_4px_0px_#000000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000000] transition-all active:translate-y-0 active:shadow-[2px_2px_0px_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 size={16} strokeWidth={3} />
                    Share
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BillPreviewModal;
