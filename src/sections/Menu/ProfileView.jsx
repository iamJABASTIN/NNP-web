import React from 'react';
import { motion } from 'motion/react';
import { User, LogOut, Settings, Bell, CreditCard, ShieldCheck } from 'lucide-react';
import { useSession } from '../../hooks/useSession';

const ProfileView = () => {
  const { user } = useSession();
  const displayName = user?.user_metadata?.display_name || 'Guest';
  const mobileNumber = user?.user_metadata?.mobile_number || 'Not Linked';

  const menuItems = [
    { icon: Bell, label: 'Notifications', value: 'On' },
    { icon: CreditCard, label: 'Payment Methods', value: 'None' },
    { icon: ShieldCheck, label: 'Privacy & Security', value: '' },
    { icon: Settings, label: 'Preferences', value: '' },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-right duration-500">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 bg-black border-4 border-black rounded-none-none flex items-center justify-center shadow-[8px_8px_0px_#f2ca50] overflow-hidden">
           <User size={48} className="text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1">{displayName}</h2>
          <p className="text-xs font-black uppercase tracking-widest text-black/40 italic">{mobileNumber}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {menuItems.map((item, i) => (
          <button key={i} className="flex items-center justify-between p-6 bg-white border-2 border-black/5 hover:border-black hover:bg-black hover:text-white transition-all rounded-none-none group">
             <div className="flex items-center gap-4">
                <item.icon size={20} className="group-hover:text-accent transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
             </div>
             <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40 group-hover:opacity-100">{item.value}</span>
          </button>
        ))}
      </div>

      <button className="mt-12 w-full flex items-center justify-center gap-3 p-6 bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest text-xs rounded-none-none group">
         <LogOut size={20} />
         <span>Logout Account</span>
      </button>

      <div className="mt-12 p-8 border-4 border-dashed border-black/10 rounded-none-none text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 italic">V 1.0.4 - Nellai Punjabi Heritage</p>
      </div>
    </div>
  );
};

export default ProfileView;
