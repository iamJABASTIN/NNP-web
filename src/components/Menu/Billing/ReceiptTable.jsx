import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const S = {
  tbl: { display: 'table', width: '100%', boxSizing: 'border-box' },
  headTbl: { display: 'table', width: '100%', padding: '0 0 8px', borderBottom: '2px solid #1a1a1a', marginBottom: '4px', boxSizing: 'border-box' },
  headCell: { display: 'table-cell', fontSize: '8px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', verticalAlign: 'bottom' },
  nameCell: { display: 'table-cell', width: '55%', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: '1.6', padding: '12px 8px 12px 4px', verticalAlign: 'middle' },
  qtyCell: { display: 'table-cell', width: '15%', textAlign: 'center', verticalAlign: 'middle', padding: '12px 4px' },
  qtyBadge: { display: 'inline-block', fontSize: '11px', fontWeight: '800', width: '28px', lineHeight: '24px', textAlign: 'center', background: '#f5f5f5', borderRadius: '2px', padding: '6px' },
  priceCell: { display: 'table-cell', width: '30%', fontSize: '13px', fontWeight: '800', textAlign: 'right', fontFamily: "'Courier New', monospace", lineHeight: '1.6', padding: '12px', verticalAlign: 'middle' }
};

const ReceiptTable = ({ items }) => {
  const { t, tField } = useLanguage();

  return (
    <>
      <div style={S.headTbl}>
        <div style={{ display: 'table-row' }}>
          <div style={{ ...S.headCell, width: '55%', paddingLeft: '4px' }}>{t('item', 'Item')}</div>
          <div style={{ ...S.headCell, width: '15%', textAlign: 'center' }}>{t('qty', 'Qty')}</div>
          <div style={{ ...S.headCell, width: '30%', textAlign: 'right', paddingRight: '4px' }}>{t('price', 'Price')}</div>
        </div>
      </div>

      {items.map((item, idx) => (
        <div key={item.id || idx} style={{ ...S.tbl, borderBottom: idx < items.length - 1 ? '1px dashed #e5e5e5' : 'none' }}>
          <div style={{ display: 'table-row' }}>
            <div style={S.nameCell}>{tField(item, 'name')}</div>
            <div style={S.qtyCell}>
              <div style={S.qtyBadge}>{item.quantity}</div>
            </div>
            <div style={S.priceCell}>₹{item.lineTotal}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ReceiptTable;
