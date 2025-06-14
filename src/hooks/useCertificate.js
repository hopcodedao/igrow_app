import { PDFDocument } from 'pdf-lib';
import * as fontkit from 'fontkit';
import { certificateTemplate } from '../assets/index.js';
import saveAs from './useFileSaver.js';
import notoSansFont from '../assets/NotoSans-Regular.ttf';

// Vẽ văn bản lên trang PDF
async function modifyCertificate(pdfPage, text, xVal, yVal, fontSize, font) {
  pdfPage.drawText(text, {
    x: xVal,
    y: yVal,
    size: fontSize,
    font: font,
  });
}

// Hàm chính tạo chứng chỉ
async function generateCertificate(name, topicTitle, percentage, date) {
  const existingPdfBytes = await fetch(certificateTemplate).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  pdfDoc.registerFontkit(fontkit);

  const notoSansBytes = await fetch(notoSansFont).then((res) => res.arrayBuffer());
  const customFont = await pdfDoc.embedFont(notoSansBytes);

  const pdfPage = pdfDoc.getPages()[0];

  // Vẽ các thông tin lên PDF
  await modifyCertificate(pdfPage, name, 76, 260, 35, customFont);

  const description = `Đã đạt ${percentage}% điểm trong bài kiểm tra ${topicTitle}.`;
  await modifyCertificate(pdfPage, description, 78, 228, 14, customFont);

  await modifyCertificate(pdfPage, date, 567, 110, 15, customFont);

  const pdfBytes = await pdfDoc.save();

  // Tải file về
  saveAs(
    new File([pdfBytes], 'ATGTech_Certificate.pdf', {
      type: 'application/pdf;charset=utf-8',
    })
  );
}

// Hàm hook để gọi từ React
export default function useCertificate(name, topicTitle, percentage, date) {
  generateCertificate(name, topicTitle, percentage, date);
}
