import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import mammoth from 'mammoth/mammoth.browser'; // Important for using mammoth in the browser

// Safely map the pdf.js worker locally via Vite asset pipeline to avoid cross-origin and CDN fetch failures
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export async function parseFileText(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const textExtensions = ['txt', 'md', 'markdown', 'csv', 'json', 'xml', 'html'];
  
  if (textExtensions.includes(extension)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  
  if (extension === 'pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + "\\n";
          }
          resolve(fullText);
        } catch(error) {
          reject(new Error("Failed to parse PDF: " + error.message));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  if (extension === 'docx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(new Error("Failed to parse DOCX: " + error.message));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error(`Unsupported file type: .${extension}. Supported: .pdf, .docx, .txt, .md, .csv, .json, .xml, .html`);
}
