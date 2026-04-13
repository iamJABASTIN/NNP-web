import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Hash, ArrowRight, Phone, ShoppingBag, Utensils, ChevronLeft } from 'lucide-react';

const CheckInModal = ({ 
  show, 
  onClose, 
  nickname, setNickname, 
  mobile, setMobile, 
  orderType, setOrderType,
  manualTableName, setManualTableName,
  isTablePreset,
  tableId,
  sessionCode, setSessionCode, 
  loading, 
  error,
  tables = [],
  onConfirm 
}) => {
  const [step, setStep] = useState(1);
  const [localError, setLocalError] = useState(null);

  // Find pre-selected table if preset
  const presetTable = isTablePreset ? tables.find(t => t.id === tableId) : null;

  // Reset step when modal opens
  useEffect(() => {
    if (show) {
      setStep(1);
      setLocalError(null);
    }
  }, [show]);

  const handleNext = () => {
    setLocalError(null);
    if (!nickname.trim()) {
      setLocalError('Please enter a nickname');
      return;
    }
    
    if (orderType === 'takeout' || isTablePreset) {
      onConfirm();
    } else {
      setStep(2);
    }
  };

  const currentError = localError || error;
  const isOneStep = orderType === 'takeout' || isTablePreset;

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

            {/* Back Button for Step 2 */}
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="absolute -top-4 left-4 bg-white border-4 border-black px-3 py-2 flex items-center gap-2 font-black text-[10px] uppercase hover:bg-accent transition-colors"
              >
                <ChevronLeft size={14} strokeWidth={3} />
                <span>Back</span>
              </button>
            )}

            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">
                Step {step} of {isOneStep ? '1' : '2'}
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
                {step === 1 ? "Who's Dining?" : "Select your Table"}
              </h2>
            </div>

            <div className="space-y-6">
              {step === 1 ? (
                <>
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

                  {/* Preset Table Badge */}
                  {isTablePreset && orderType === 'dine_in' && presetTable && (
                    <div className="p-3 bg-accent/10 border-2 border-dashed border-accent flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                       <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent">Ordering for</span>
                        <span className="text-xl font-black italic">Table # {presetTable.table_number}</span>
                       </div>
                       <Utensils size={24} className="text-accent opacity-50" />
                    </div>
                  )}

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
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">Your Phone</label>
                    <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                      <input 
                        type="tel" 
                        placeholder="e.g. 9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-4">Choose a table number:</p>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {tables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => setManualTableName(table.table_number)}
                        className={`aspect-square flex flex-col items-center justify-center border-2 border-black font-black transition-all ${
                          manualTableName === table.table_number 
                            ? 'bg-accent text-black scale-105 shadow-[4px_4px_0px_#000000]' 
                            : 'bg-white text-black/40 hover:bg-black/5'
                        }`}
                      >
                        <span className="text-[8px] uppercase opacity-50">T</span>
                        <span className="text-lg">{table.table_number}</span>
                      </button>
                    ))}
                  </div>

                  {manualTableName && (
                    <div className="mt-4 p-3 bg-accent/10 border-2 border-dashed border-accent flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">Selected Table</span>
                      <span className="text-xl font-black italic"># {manualTableName}</span>
                    </div>
                  )}
                </div>
              )}

              {currentError && (
                <div className="bg-red-50 border-4 border-red-500 p-4 text-[10px] font-black uppercase tracking-widest text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                  {currentError}
                </div>
              )}

              <button 
                onClick={step === 1 ? handleNext : onConfirm}
                disabled={loading || (step === 2 && !manualTableName)}
                className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    <span>
                      {step === 1 
                        ? (isOneStep ? 'Ready to Order' : 'Select Table') 
                        : 'Confirm Order'}
                    </span>
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
