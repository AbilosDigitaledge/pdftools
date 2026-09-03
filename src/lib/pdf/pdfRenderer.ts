/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PDF Client-Side Rendering using PDF.js (pdfjs-dist)
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker dynamically matching the installed package version.
// This prevents bundler issues and mismatch errors.
const pdfjsVersion = pdfjsLib.version || '4.10.38';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;

/**
 * Renders a specific page of a PDF document to a data URL (image/jpeg).
 * @param arrayBuffer The PDF document data
 * @param pageNumber The page number to render (1-indexed)
 * @param scale The rendering scale factor (higher means better quality)
 */
export async function renderPdfPageToDataUrl(
  arrayBuffer: ArrayBuffer,
  pageNumber: number,
  scale = 1.0
): Promise<string> {
  const data = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(pageNumber);
  
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Could not create 2D canvas context.');
  }
  
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvas: canvas,
  };
  
  await renderContext.canvasContext;
  await page.render(renderContext).promise;
  
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  return dataUrl;
}

/**
 * Converts an entire PDF to a grayscale PDF by rendering each page to a high-DPI canvas,
 * converting pixels to grayscale, and constructing a new PDF using pdf-lib.
 * This ensures total compatibility for any source file (forms, scans, complex vectors).
 */
import { PDFDocument } from 'pdf-lib';

export async function convertPdfToGrayscale(
  arrayBuffer: ArrayBuffer,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const data = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDoc = await loadingTask.promise;
  const pageCount = pdfDoc.numPages;

  const grayscalePdf = await PDFDocument.create();

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdfDoc.getPage(i);
    // Use high scale (e.g. 1.5) to maintain sharp text and images
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context not available');
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    }).promise;

    // Convert canvas image data to grayscale manually to guarantee visual output
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    for (let p = 0; p < pixels.length; p += 4) {
      const r = pixels[p];
      const g = pixels[p+1];
      const b = pixels[p+2];
      // Standard human eye color weighting for grayscale conversion
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      pixels[p] = gray;     // Red
      pixels[p+1] = gray;   // Green
      pixels[p+2] = gray;   // Blue
      // Alpha (pixels[p+3]) stays unchanged
    }
    context.putImageData(imgData, 0, 0);

    // Get JPEG image data from grayscale canvas
    const grayscaleJpegData = canvas.toDataURL('image/jpeg', 0.85);
    const jpegBytes = await fetch(grayscaleJpegData).then(res => res.arrayBuffer());

    // Embed grayscale image page into the new PDF
    const embeddedImage = await grayscalePdf.embedJpg(jpegBytes);
    const newPage = grayscalePdf.addPage([viewport.width, viewport.height]);
    
    newPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });

    if (onProgress) {
      onProgress(Math.round((i / pageCount) * 100));
    }
  }

  return await grayscalePdf.save();
}
