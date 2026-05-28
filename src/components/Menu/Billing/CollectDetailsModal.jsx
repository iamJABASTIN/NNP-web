import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import BillingFields from './BillingFields';
import { useLanguage } from '../../../hooks/useLanguage';

const CollectDetailsModal = ({ show, onClose, onConfirm, loading }) => {
  const [nickname, setNickname] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (show) {
      setNickname('');
      setMobile('');
      setError(null);
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const trimmedNickname = nickname.trim();
    const trimmedMobile = mobile.trim();

    if (!trimmedNickname) {
      setError(t('enter_nickname_error', 'Please enter a nickname'));
      return;
    }
    if (!trimmedMobile) {
      setError(t('enter_phone_error', 'Please enter a mobile number'));
      return;
    }
    const cleanMobile = trimmedMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError(t('valid_phone_error', 'Please enter a valid 10-digit mobile number'));
      return;
    }

    onConfirm({ nickname: trimmedNickname, mobile: cleanMobile });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
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
                {t('one_last_step', 'One Last Step')}
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
                {t('billing_details', 'Billing Details')}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <BillingFields 
                nickname={nickname} setNickname={setNickname}
                mobile={mobile} setMobile={setMobile}
              />

              {error && (
                <div className="bg-red-50 border-4 border-red-500 p-4 text-[10px] font-black uppercase tracking-widest text-red-600">
                  {error}
                </div>
              )}

              <button 
                type="submit" disabled={loading}
                className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50 mx-auto"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" /> : (
                  <>
                    <span>{t('request_bill', 'Request Bill')}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollectDetailsModal;
