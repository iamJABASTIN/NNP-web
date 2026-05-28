import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import TableGrid from './TableGrid';
import ParcelButton from './ParcelButton';
import { useLanguage } from '../../../hooks/useLanguage';

const CheckInModal = ({ 
  show, 
  onClose, 
  manualTableName, setManualTableName,
  loading, 
  error,
  tables = [],
  onConfirm 
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (show) setManualTableName('');
  }, [show, setManualTableName]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-[420px] bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#f2ca50] relative"
          >
            <button 
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors"
            >
              ×
            </button>

            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">
                {t('order_details', 'Order Details')}
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
                {t('select_table_title', 'Select your Table')}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                  {t('choose_table', 'Choose a table number:')}
                </p>
                
                <TableGrid 
                  tables={tables} 
                  manualTableName={manualTableName} 
                  setManualTableName={setManualTableName} 
                />

                <div className="border-t-2 border-dashed border-black/10 my-4" />

                <ParcelButton 
                  manualTableName={manualTableName} 
                  setManualTableName={setManualTableName} 
                />

                {manualTableName && (
                  <div className="mt-4 p-3 bg-accent/10 border-2 border-dashed border-accent flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('selected_option', 'Selected Option')}</span>
                    <span className="text-xl font-black italic">
                      {manualTableName === 'Parcel' ? t('parcel', 'Parcel') : `${t('table', 'Table')} #${manualTableName}`}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border-4 border-red-500 p-4 text-[10px] font-black uppercase tracking-widest text-red-600">
                  {error}
                </div>
              )}

              <button 
                onClick={onConfirm}
                disabled={loading || !manualTableName}
                className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50 mx-auto"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    <span>{t('confirm_order', 'Confirm Order')}</span>
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

export default CheckInModal;
