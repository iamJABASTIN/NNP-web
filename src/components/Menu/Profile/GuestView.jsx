import React from 'react';
import { LogIn, Star } from 'lucide-react';
import loginIllustration from '../../../assets/illustrators/login.png';
import { useLanguage } from '../../../hooks/useLanguage';

const GuestView = ({ onLogin }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom duration-700">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
        <img 
          src={loginIllustration} 
          alt="Login Illustration" 
          className="relative w-64 md:w-80 h-auto grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
      
      <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-tight">
        {t('track_journey', 'Track Your')}<br />
        <span className="text-accent underline decoration-black underline-offset-4">
          {t('flavor_journey', 'Flavor Journey')}
        </span>
      </h2>
      
      <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black/40 max-w-xs mx-auto mb-10 leading-relaxed">
        {t('join_family_desc', 'Join our family for exclusive benefits, history of your meals, and instant bill access.')}
      </p>

      <button 
        onClick={onLogin}
        className="group relative px-12 py-6 bg-black text-white font-black uppercase tracking-widest text-xs overflow-hidden mx-auto"
      >
        <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
        <div className="relative flex items-center gap-3 group-hover:text-black transition-colors">
          <LogIn size={18} strokeWidth={3} />
          <span>{t('login_signup', 'Log In / Sign Up')}</span>
        </div>
      </button>

      <div className="mt-12 flex items-center justify-center gap-4 text-black/20">
        <Star size={14} className="fill-current" />
        <Star size={14} className="fill-current" />
        <Star size={14} className="fill-current" />
      </div>
    </div>
  );
};

export default GuestView;
