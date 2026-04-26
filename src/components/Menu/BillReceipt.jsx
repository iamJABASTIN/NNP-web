import React, { forwardRef } from 'react';

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
      {/* ── Top decorative bar ── */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #f2ca50, #1a1a1a, #f2ca50)',
        borderRadius: '2px',
        marginBottom: '24px',
      }} />

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '900',
          letterSpacing: '-0.5px',
          textTransform: 'uppercase',
          lineHeight: '1.2',
          marginBottom: '4px',
        }}>
          New Nellai Punjabi Restaurant
        </div>
        <div style={{
          fontSize: '9px',
          fontWeight: '700',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#999999',
        }}>
          Dine-In Receipt
        </div>
      </div>

      {/* ── Table & Order info ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        background: '#1a1a1a',
        color: '#ffffff',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ fontSize: '8px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#f2ca50' }}>
            Table
          </div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>
            #{tableNumber || '—'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '8px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#f2ca50' }}>
            Order
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', fontFamily: "'Courier New', monospace" }}>
            {shortId}
          </div>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div style={{
        display: 'table',
        width: '100%',
        padding: '0 0 8px',
        borderBottom: '2px solid #1a1a1a',
        marginBottom: '4px',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell', width: '55%', fontSize: '8px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', verticalAlign: 'bottom', paddingLeft: '4px' }}>
            Item
          </div>
          <div style={{ display: 'table-cell', width: '15%', fontSize: '8px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', textAlign: 'center', verticalAlign: 'bottom' }}>
            Qty
          </div>
          <div style={{ display: 'table-cell', width: '30%', fontSize: '8px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', textAlign: 'right', verticalAlign: 'bottom', paddingRight: '4px' }}>
            Amount
          </div>
        </div>
      </div>

      {/* ── Items ── */}
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          style={{
            display: 'table',
            width: '100%',
            borderBottom: idx < items.length - 1 ? '1px dashed #e5e5e5' : 'none',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'table-row' }}>
            <div style={{
              display: 'table-cell',
              width: '55%',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              lineHeight: '1.6',
              padding: '12px 8px 12px 4px',
              verticalAlign: 'middle',
            }}>
              {item.name}
            </div>
            <div style={{
              display: 'table-cell',
              width: '15%',
              textAlign: 'center',
              verticalAlign: 'middle',
              padding: '12px 4px',
            }}>
              <div style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: '800',
                width: '28px',
                lineHeight: '24px',
                textAlign: 'center',
                background: '#f5f5f5',
                borderRadius: '2px',
                padding: '6px'
              }}>
                {item.quantity}
              </div>
            </div>
            <div style={{
              display: 'table-cell',
              width: '30%',
              fontSize: '13px',
              fontWeight: '800',
              textAlign: 'right',
              fontFamily: "'Courier New', monospace",
              lineHeight: '1.6',
              padding: '12px',
              verticalAlign: 'middle',
            }}>
              ₹{item.lineTotal}
            </div>
          </div>
        </div>
      ))}

      {/* ── Total ── */}
      <div style={{
        marginTop: '8px',
        borderTop: '3px solid #1a1a1a',
        padding: '16px 4px 0',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#666',
          }}>
            Total
          </span>
          <span style={{
            fontSize: '24px',
            fontWeight: '900',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '-1px',
            paddingTop: '4px',
            paddingBottom: '4px',
            display: 'inline-block',
          }}>
            ₹{totalAmount}
          </span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px dashed #ccc',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '9px',
          fontWeight: '600',
          color: '#999',
          marginBottom: '4px',
          fontFamily: "'Courier New', monospace",
        }}>
          {dateStr} • {timeStr}
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: '800',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#1a1a1a',
          marginTop: '12px',
        }}>
          Thank you for dining!
        </div>
        <div style={{
          fontSize: '8px',
          fontWeight: '600',
          color: '#bbbbbb',
          marginTop: '4px',
          letterSpacing: '1px',
        }}>
          Powered by NNP
        </div>
      </div>

      {/* ── Bottom decorative bar ── */}
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
