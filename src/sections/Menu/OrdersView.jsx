import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, CookingPot, UtensilsCrossed } from 'lucide-react';

const OrdersView = ({ activeOrderId, status }) => {
  const steps = [
    { id: 'pending', label: 'Order Received', icon: Clock, color: 'bg-blue-500' },
    { id: 'preparing', label: 'In Kitchen', icon: CookingPot, color: 'bg-orange-500' },
    { id: 'ready', label: 'Ready to Serve', icon: CheckCircle2, color: 'bg-green-500' },
    { id: 'served', label: 'Served', icon: UtensilsCrossed, color: 'bg-black' },
  ];

  const currentStatus = (status || 'pending').toLowerCase();
  const activeIndex = steps.findIndex(s => s.id === currentStatus);

  if (!activeOrderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-12">
        <div className="w-24 h-24 border-4 border-black/10 flex items-center justify-center rounded-3xl mb-8">
           <ClipboardList size={48} className="text-black/10" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Active Orders</h3>
        <p className="text-xs font-bold uppercase tracking-widest text-black/40">Hungry? Head over to the menu and place your first order!</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter">My Orders</h2>
        <span className="text-[10px] font-black uppercase px-4 py-2 bg-accent border-2 border-black">Active Item</span>
      </div>

      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000000] rounded-2xl relative overflow-hidden">
        <div className="flex flex-col gap-12 relative">
          {/* Progress Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-black/10" />
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            className="absolute left-[27px] top-4 w-1 bg-accent"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div key={step.id} className="flex items-center gap-8 relative z-10">
                <motion.div 
                   animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                   transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                   className={`w-14 h-14 border-4 border-black flex items-center justify-center rounded-xl transition-colors duration-500 ${
                  isCompleted ? 'bg-accent' : 'bg-white'
                }`}>
                  <Icon size={24} className={isCompleted ? 'text-black' : 'text-black/20'} strokeWidth={3} />
                </motion.div>
                
                <div className="flex flex-col">
                  <span className={`text-xs font-black uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-black/20'}`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] font-bold text-accent px-2 py-0.5 bg-black rounded w-fit mt-1 uppercase tracking-tighter"
                    >
                      Current Status
                    </motion.span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 p-6 bg-black text-white border-4 border-black rounded-2xl flex items-center justify-between shadow-[8px_8px_0px_#f2ca50]">
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Estimated Wait</span>
            <span className="text-2xl font-black italic">12-15 MINS</span>
         </div>
         <button className="text-[10px] font-black uppercase tracking-widest px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-all">Support</button>
      </div>
    </div>
  );
};

// Simple icon fallback if ClipboardList is missing from imports
import { ClipboardList } from 'lucide-react';

export default OrdersView;
