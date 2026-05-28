import React from 'react';
import { User, Phone } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

const BillingFields = ({ nickname, setNickname, mobile, setMobile }) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">
          {t('your_nickname', 'Your Nickname')}
        </label>
        <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
          <input 
            type="text" 
            placeholder={t('nickname_placeholder', 'e.g. Sam')}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase"
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-black/50">
          {t('your_phone', 'Your Phone')}
        </label>
        <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
          <input 
            type="tel" 
            placeholder="e.g. 9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm"
          />
        </div>
      </div>
    </>
  );
};

export default BillingFields;
