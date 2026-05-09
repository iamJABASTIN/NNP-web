import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, LogOut, ClipboardList, ChevronRight, LogIn, Star, Receipt } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { useOrderHistory } from '../../hooks/useOrderHistory';
import OrderDetailModal from '../../components/Menu/OrderDetailModal';
import LogoutConfirmModal from '../../components/Admin/LogoutConfirmModal';
import { useNavigate } from 'react-router-dom';
import loginIllustration from '../../assets/illustrators/login.png';

const ProfileView = () => {
  const { user, signOut } = useSession();
  const { orders, loading, error } = useOrderHistory();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return <GuestView onLogin={() => navigate('/auth')} />;
  }

  const displayName = user?.user_metadata?.display_name || 'Guest Member';
  const mobileNumber = user?.user_metadata?.mobile_number || 'Family Member';

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-right duration-500">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-black border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_#f2ca50] overflow-hidden">
           <User size={40} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">{displayName}</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40 italic">{mobileNumber}</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Receipt size={20} className="text-accent" />
                Recent orders
            </h3>
            {orders.length > 0 && (
                <span className="text-[10px] font-black uppercase tracking-widest text-black/20">
                    {orders.length} total
                </span>
            )}
        </div>

        {loading ? (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-black/5 animate-pulse border-2 border-dashed border-black/10" />
                ))}
            </div>
        ) : orders.length === 0 ? (
            <div className="py-12 border-4 border-dashed border-black/10 text-center space-y-4">
                <ClipboardList size={40} className="mx-auto text-black/10" />
                <p className="text-xs font-black uppercase tracking-widest text-black/40">No orders found yet</p>
            </div>
        ) : (
            <div className="flex flex-col gap-4">
                {orders.map((order) => (
                    <button 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center justify-between p-6 bg-white border-2 border-black hover:border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#f2ca50] hover:shadow-none group text-left"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-accent/60 transition-colors">
                                {new Date(order.placed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-sm font-black uppercase tracking-tight">Order #{order.id.slice(0, 8)}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-black italic">₹{order.total_amount}</span>
                                <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-accent text-black group-hover:bg-white transition-colors">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Logout Button */}
      <button 
        onClick={() => setShowLogoutModal(true)}
        className="mt-16 w-full flex items-center justify-center gap-3 p-6 bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest text-xs group"
      >
         <LogOut size={20} />
         <span>Logout Account</span>
      </button>

      {/* Version Info */}
      <div className="mt-12 p-8 border-4 border-dashed border-black/10 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 italic">V 1.0.5 - Nellai Punjabi Heritage</p>
      </div>

      {/* Detail Modal */}
      <OrderDetailModal 
        show={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        show={showLogoutModal}
        onConfirm={signOut}
        onClose={() => setShowLogoutModal(false)}
        message="Are you sure you want to log out from your member account?"
      />
    </div>
  );
};

const GuestView = ({ onLogin }) => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom duration-700">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
            <img 
                src={loginIllustration} 
                alt="Login Illustration" 
                className="relative w-64 md:w-80 h-auto grayscale hover:grayscale-0 transition-all duration-500"
            />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-tight">
            Track Your <br />
            <span className="text-accent underline decoration-black underline-offset-4">Flavor Journey</span>
        </h2>
        
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black/40 max-w-xs mx-auto mb-10 leading-relaxed">
            Join our family for exclusive benefits, history of your meals, and instant bill access.
        </p>

        <button 
            onClick={onLogin}
            className="group relative px-12 py-6 bg-black text-white font-black uppercase tracking-widest text-xs overflow-hidden"
        >
            <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
            <div className="relative flex items-center gap-3 group-hover:text-black transition-colors">
                <LogIn size={18} strokeWidth={3} />
                <span>Log In / Sign Up</span>
            </div>
        </button>

        <div className="mt-12 flex items-center gap-4 text-black/20">
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
            <Star size={14} className="fill-current" />
        </div>
    </div>
);

export default ProfileView;

