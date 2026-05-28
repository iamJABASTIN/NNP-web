import React, { forwardRef } from 'react';
import ReceiptHeader from './ReceiptHeader';
import ReceiptTable from './ReceiptTable';
import ReceiptFooter from './ReceiptFooter';

/**
 * BillReceipt — The formatted bill layout.
 * Uses inline styles exclusively so html2canvas captures it pixel-perfectly.
 * This component is rendered inside the modal AND captured for PDF generation.
 */
const BillReceipt = forwardRef(({ items, totalAmount, tableNumber, orderId }, ref) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : '--------';

  return (
    <div
      ref={ref}
      style={{
        width: '320px',
        margin: '0 auto',
        background: '#ffffff',
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#1a1a1a',
        padding: '32px 24px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #f2ca50, #1a1a1a, #f2ca50)',
        borderRadius: '2px',
        marginBottom: '24px',
      }} />

      <ReceiptHeader tableNumber={tableNumber} shortId={shortId} />
      
      <ReceiptTable items={items} />

      <ReceiptFooter totalAmount={totalAmount} dateStr={dateStr} timeStr={timeStr} />

      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #f2ca50, #1a1a1a, #f2ca50)',
        borderRadius: '2px',
        marginTop: '24px',
      }} />
    </div>
  );
});

BillReceipt.displayName = 'BillReceipt';

export default BillReceipt;
