import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Plus, Receipt, ChefHat, CircleCheck } from 'lucide-react';
import { useOrderDetails } from '../../hooks/useOrderDetails';

const OrdersView = ({ activeOrderId, status, onSwitchToMenu }) => {
  const { items, totalAmount, tableNumber, loading } = useOrderDetails(activeOrderId);

  if (!activeOrderId) {
    return <EmptyState />;
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-500">
      <OrderHeader status={status} tableNumber={tableNumber} />
      <ReceiptCard items={items} totalAmount={totalAmount} />
      <ActionButtons onSwitchToMenu={onSwitchToMenu} />
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────── */

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-12">
    <div className="w-24 h-24 border-4 border-black/10 flex items-center justify-center mb-8">
      <ClipboardList size={48} className="text-black/10" />
    </div>
    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Active Orders</h3>
    <p className="text-xs font-bold uppercase tracking-widest text-black/40">
      Hungry? Head over to the menu and place your first order!
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-black border-t-accent animate-spin"></div>
  </div>
);

const OrderHeader = ({ status, tableNumber }) => {
  const currentStatus = (status || 'pending').toLowerCase();
  const statusConfig = {
    pending:   { label: 'Order Received', color: 'bg-blue-100 text-blue-800' },
    preparing: { label: 'In Kitchen',     color: 'bg-orange-100 text-orange-800' },
    ready:     { label: 'Ready',          color: 'bg-green-100 text-green-800' },
    served:    { label: 'Served',         color: 'bg-black text-white' },
  };
  const cfg = statusConfig[currentStatus] || statusConfig.pending;

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black flex items-center justify-center shadow-[4px_4px_0px_#f2ca50]">
          <Receipt size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">My Order</h2>
          {tableNumber && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">Table #</span>
              <span className="text-xs font-black italic">{tableNumber}</span>
            </div>
          )}
        </div>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-black ${cfg.color}`}>
        {cfg.label}
      </span>
    </div>
  );
};

const ReceiptCard = ({ items, totalAmount }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.1 }}
    className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] relative overflow-hidden"
  >
    {/* Decorative corner */}
    <div className="absolute top-0 right-0 w-10 h-10 bg-accent border-l-4 border-b-4 border-black translate-x-5 -translate-y-5 rotate-45" />

    {/* Column header */}
    <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-black/[0.03]">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Item</span>
      <div className="flex items-center gap-8">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hidden sm:block">Qty</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 w-20 text-right">Price</span>
      </div>
    </div>

    {/* Item rows */}
    <div className="divide-y divide-black/5">
      {items.map((item) => (
        <OrderItemRow key={item.id} item={item} />
      ))}
    </div>

    {/* Totals */}
    <div className="border-t-4 border-black px-6 py-5 bg-black/[0.02]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-black/40">Total</span>
        <span className="text-2xl font-black italic">₹{totalAmount}</span>
      </div>
    </div>
  </motion.div>
);

const OrderItemRow = ({ item }) => (
  <motion.div
    initial={{ x: -10, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="flex items-center justify-between px-6 py-4 hover:bg-accent/10 transition-colors group"
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <span className="text-[10px] font-black bg-black text-white w-6 h-6 flex items-center justify-center flex-shrink-0">
        {item.quantity}
      </span>
      <span className="text-xs font-black uppercase tracking-tight truncate">
        {item.name}
      </span>
    </div>
    <div className="flex items-center gap-8">
      <span className="text-[10px] font-bold text-black/40 hidden sm:block">×{item.quantity}</span>
      <span className="text-sm font-black italic w-20 text-right">₹{item.lineTotal}</span>
    </div>
  </motion.div>
);

const ActionButtons = ({ onSwitchToMenu }) => (
  <div className="flex flex-col gap-4 mt-8">
    <motion.button
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      onClick={onSwitchToMenu}
      className="w-full py-5 bg-accent border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[8px_8px_0px_#000000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#000000] transition-all active:translate-y-0 active:shadow-[4px_4px_0px_#000000]"
    >
      <Plus size={18} strokeWidth={3} />
      Add More Items
    </motion.button>

    <motion.button
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all"
    >
      <ChefHat size={18} strokeWidth={3} className="text-accent" />
      Request Bill
    </motion.button>
  </div>
);

export default OrdersView;
