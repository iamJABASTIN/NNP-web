import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Hash, ArrowRight, Phone, ShoppingBag, Utensils } from 'lucide-react';

const CheckInModal = ({ 
  show, 
  onClose, 
  nickname, setNickname, 
  mobile, setMobile, 
  orderType, setOrderType,
  manualTableName, setManualTableName,
  isTablePreset,
  sessionCode, setSessionCode, 
  loading, 
  onConfirm 
}) => {
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
            className="w-full max-w-[400px] bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#f2ca50] relative"
          >
            <button 
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors"
            >
              ×
            </button>

            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Check-in</p>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Who's Dining?</h2>
            </div>

            <div className="space-y-6">
              {/* Order Type Toggle */}
              <div className="flex border-4 border-black p-1 bg-muted/20 shadow-[4px_4px_0px_#000000]">
                <button
                  onClick={() => setOrderType('dine_in')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                    orderType === 'dine_in' ? 'bg-black text-white' : 'hover:bg-black/5'
                  }`}
                >
                  <Utensils size={14} />
                  <span>Dine In</span>
                </button>
                <button
                  onClick={() => setOrderType('takeout')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                    orderType === 'takeout' ? 'bg-black text-white' : 'hover:bg-black/5'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>Takeout</span>
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">Your Nickname</label>
                <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Sam"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">Your Phone</label>
                <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase"
                  />
                </div>
              </div>

              {/* Manual Table Selection for Dine-In without QR */}
              {orderType === 'dine_in' && !isTablePreset && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">Table Number </label>
                  <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. 1"
                      value={manualTableName}
                      onChange={(e) => setManualTableName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase"
                    />
                  </div>
                </div>
              )}


              <button 
                onClick={onConfirm}
                disabled={loading}
                className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    <span>Ready to Order</span>
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
