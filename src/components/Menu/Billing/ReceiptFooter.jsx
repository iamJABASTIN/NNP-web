import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const S = {
  totSec: { marginTop: '8px', borderTop: '3px solid #1a1a1a', padding: '16px 4px 0' },
  totFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totLbl: { fontSize: '10px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', color: '#666' },
  totVal: { fontSize: '24px', fontWeight: '900', fontFamily: "'Courier New', monospace", letterSpacing: '-1px', paddingTop: '4px', paddingBottom: '4px', display: 'inline-block' },
  metaSec: { marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #ccc', textAlign: 'center' },
  date: { fontSize: '9px', fontWeight: '600', color: '#999', marginBottom: '4px', fontFamily: "'Courier New', monospace" },
  thanks: { fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1a1a', marginTop: '12px' },
  power: { fontSize: '8px', fontWeight: '600', color: '#bbbbbb', marginTop: '4px', letterSpacing: '1px' }
};

const ReceiptFooter = ({ totalAmount, dateStr, timeStr }) => {
  const { t } = useLanguage();

  return (
    <>
      <div style={S.totSec}>
        <div style={S.totFlex}>
          <span style={S.totLbl}>{t('total', 'Total')}</span>
          <span style={S.totVal}>₹{totalAmount}</span>
        </div>
      </div>

      <div style={S.metaSec}>
        <div style={S.date}>{dateStr} • {timeStr}</div>
        <div style={S.thanks}>{t('thank_you_dining', 'Thank you for dining!')}</div>
        <div style={S.power}>Powered by NNP</div>
      </div>
    </>
  );
};

export default ReceiptFooter;
