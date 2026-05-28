import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { X, Download, FileText } from 'lucide-react';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';

const BASE_URL = 'https://nnp-one.vercel.app';

const QRModal = ({ show, table, restaurantName, onClose }) => {
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  const tableUrl = table ? `${BASE_URL}/table/${table.id}` : '';
  const isParcel = table?.table_number === 'Parcel';

  useEffect(() => {
    if (!show || !table) return;

    const generateQR = async () => {
      try {
        const canvas = canvasRef.current;
        await QRCode.toCanvas(canvas, tableUrl, {
          width: 280,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('QR generation failed:', err);
      }
    };

    generateQR();
  }, [show, table, tableUrl]);

  const downloadPNG = () => {
    if (!qrDataUrl || !table) return;
    const link = document.createElement('a');
    link.download = isParcel ? 'Parcel-QR.png' : `Table-${table.table_number}-QR.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const downloadA4PDF = async () => {
    if (!table) return;

    try {
      // Generate a high-res QR for PDF
      const hiResCanvas = document.createElement('canvas');
      await QRCode.toCanvas(hiResCanvas, tableUrl, {
        width: 800,
        margin: 3,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });
      const hiResDataUrl = hiResCanvas.toDataURL('image/png');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = 210;

      // --- Header band ---
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageW, 50, 'F');
      doc.setTextColor(242, 202, 80); // accent
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text(restaurantName || 'RESTAURANT', pageW / 2, 30, { align: 'center' });

      // --- QR Code centered ---
      const qrSize = 120;
      const qrX = (pageW - qrSize) / 2;
      const qrY = 75;

      // QR border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(2);
      doc.rect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 'S');

      doc.addImage(hiResDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // --- Table number ---
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(48);
      doc.text(isParcel ? 'PARCEL ORDERING' : `TABLE ${table.table_number}`, pageW / 2, qrY + qrSize + 30, { align: 'center' });

      // --- CTA text ---
      doc.setFillColor(242, 202, 80);
      doc.rect(40, qrY + qrSize + 45, pageW - 80, 18, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.5);
      doc.rect(40, qrY + qrSize + 45, pageW - 80, 18, 'S');

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('SCAN TO ORDER', pageW / 2, qrY + qrSize + 57, { align: 'center' });

      // --- Footer ---
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(tableUrl, pageW / 2, 280, { align: 'center' });

      doc.save(isParcel ? 'Parcel-A4.pdf' : `Table-${table.table_number}-A4.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
  };

  if (!show || !table) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className={`bg-white p-8 max-w-md w-full ${BORDER_BLACK} ${SHADOW_BLACK} relative`}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white border-4 border-black w-10 h-10 flex items-center justify-center font-black hover:bg-red-100 transition-colors"
          aria-label="Close QR modal"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">QR Code</p>
          <h3 className="text-2xl font-black uppercase tracking-tighter">
            {isParcel ? 'Parcel QR Code' : `Table ${table.table_number}`}
          </h3>
        </div>

        {/* QR Preview */}
        <div className={`flex flex-col items-center p-6 ${BORDER_BLACK} bg-white mb-6`}>
          <canvas ref={canvasRef} className="mb-4" />
          <p className="text-[9px] font-bold text-black/30 break-all text-center">{tableUrl}</p>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-3">
          <button
            onClick={downloadPNG}
            className={`flex-1 flex items-center justify-center gap-2 py-4 bg-white ${BORDER_BLACK} font-black uppercase text-xs tracking-widest hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_#000000]`}
          >
            <Download size={16} strokeWidth={3} />
            QR Only
          </button>
          <button
            onClick={downloadA4PDF}
            className={`flex-1 flex items-center justify-center gap-2 py-4 bg-accent ${BORDER_BLACK} font-black uppercase text-xs tracking-widest hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_#000000]`}
          >
            <FileText size={16} strokeWidth={3} />
            A4 Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
