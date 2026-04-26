import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function useBillGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Check if Web Share API supports file sharing
    if (navigator.canShare) {
      const testFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      setCanShare(navigator.canShare({ files: [testFile] }));
    }
  }, []);

  const generatePDF = async (elementRef, filename = 'bill') => {
    if (!elementRef.current) throw new Error('Receipt element not found');

    const canvas = await html2canvas(elementRef.current, {
      scale: 2,                // Reduced from 3 for smaller file size
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: elementRef.current.scrollWidth,
      windowHeight: elementRef.current.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.8); // JPEG at 80% quality for massive size reduction

    // Size the PDF to match the receipt aspect ratio
    const pdfWidth = 80;       // mm — receipt-width
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    return { pdf, filename: `${filename}.pdf` };
  };

  const downloadPDF = async (elementRef, filename = 'bill') => {
    setIsGenerating(true);
    try {
      const { pdf, filename: fullName } = await generatePDF(elementRef, filename);
      pdf.save(fullName);
    } finally {
      setIsGenerating(false);
    }
  };

  const sharePDF = async (elementRef, filename = 'bill') => {
    setIsGenerating(true);
    try {
      const { pdf, filename: fullName } = await generatePDF(elementRef, filename);
      const blob = pdf.output('blob');
      const file = new File([blob], fullName, { type: 'application/pdf' });

      await navigator.share({
        title: 'Your Bill',
        text: 'Here is your dining bill',
        files: [file],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { downloadPDF, sharePDF, canShare, isGenerating };
}
