import React from 'react';
import { X, LogOut } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';

const LogoutConfirmModal = ({ 
  show, 
  onConfirm, 
  onClose, 
  title = "Exit Session?",
  message = "Are you sure you want to log out?"
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`bg-white p-8 max-w-sm w-full ${BORDER_BLACK} ${SHADOW_BLACK} relative animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-50 transition-colors shadow-[4px_4px_0px_#000000]"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-red-100 border-4 border-black rounded-none-none flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#000000]">
            <LogOut size={32} className="text-red-600" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">{title}</h3>
          <p className="text-sm font-bold text-black/50 mt-2">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className={`flex-1 py-4 bg-white ${BORDER_BLACK} font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 bg-red-600 text-white ${BORDER_BLACK} font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
