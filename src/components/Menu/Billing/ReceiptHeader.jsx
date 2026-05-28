import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const styles = {
  container: { textAlign: 'center', marginBottom: '20px' },
  title: { fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: '1.2', marginBottom: '4px' },
  sub: { fontSize: '9px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#999999' },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#1a1a1a', color: '#ffffff', marginBottom: '20px' },
  lbl: { fontSize: '8px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#f2ca50' },
  valL: { fontSize: '18px', fontWeight: '900' },
  valR: { fontSize: '11px', fontWeight: '800', fontFamily: "'Courier New', monospace" }
};

const ReceiptHeader = ({ tableNumber, shortId }) => {
  const { t } = useLanguage();

  return (
    <>
      <div style={styles.container}>
        <div style={styles.title}>New Nellai Punjabi Restaurant</div>
        <div style={styles.sub}>{t('dine_in_receipt', 'Dine-In Receipt')}</div>
      </div>

      <div style={styles.meta}>
        <div>
          <div style={styles.lbl}>{t('table', 'Table')}</div>
          <div style={styles.valL}>#{tableNumber || '—'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={styles.lbl}>{t('orders', 'Order')}</div>
          <div style={styles.valR}>{shortId}</div>
        </div>
      </div>
    </>
  );
};

export default ReceiptHeader;
