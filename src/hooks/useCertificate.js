import { PDFDocument } from 'pdf-lib';
import * as fontkit from 'fontkit';
import { certificateTemplate } from '../assets/index.js';
import saveAs from './useFileSaver.js';
import notoSansFont from '../assets/NotoSans-Regular.ttf';

async function modifyCertificate(pdfPage, text, xVal, yVal, fontSize, font) {
  pdfPage.drawText(text, {
    x: xVal,
    y: yVal,
    size: fontSize,
    font: font
  });
}

async function generateCertificate(name, description, date) {
  const existingPdfBytes = await fetch(certificateTemplate).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  pdfDoc.registerFontkit(fontkit);

  const notoSansBytes = await fetch(notoSansFont).then((res) => res.arrayBuffer());
  const customFont = await pdfDoc.embedFont(notoSansBytes);

  const pdfPage = pdfDoc.getPages()[0];
  modifyCertificate(pdfPage, name, 76, 260, 35, customFont);
  modifyCertificate(pdfPage, description, 78, 228, 14, customFont);
  modifyCertificate(pdfPage, date, 567, 110, 15, customFont);

  const pdfBytes = await pdfDoc.save();
  saveAs(
    new File([pdfBytes], 'ATGTech_Certificate.pdf', {
      type: 'application/pdf;charset=utf-8'
    })
  );
}

export default function useCertificate(name, topic, percentage, date) {
  const description = `Đã đạt ${percentage} điểm trong bài kiểm tra An toàn giao thông.`;
  generateCertificate(name, description, date);
}
