/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PDF Core Client-Side Operations using pdf-lib
 */

import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { PdfMetadata, WatermarkSettings } from '../../types';

/**
 * Parses page ranges like "1-3, 5, 8-10" into 0-indexed page numbers.
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pages = new Set<number>();
  if (!rangeStr.trim()) return [];

  const parts = rangeStr.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        // Convert to 0-indexed and clamp
        const from = Math.max(1, min);
        const to = Math.min(totalPages, max);

        for (let i = from; i <= to; i++) {
          pages.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pages.add(pageNum - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Creates a new PDF document by removing selected pages.
 * @param arrayBuffer The original PDF array buffer
 * @param selectedPages 0-indexed page numbers to REMOVE
 */
export async function removePagesFromPdf(
  arrayBuffer: ArrayBuffer,
  selectedPages: number[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  // Create a list of pages to KEEP (0-indexed)
  const pagesToKeep = [];
  for (let i = 0; i < totalPages; i++) {
    if (!selectedPages.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) {
    throw new Error("You cannot remove all pages. At least one page must remain.");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
  for (const page of copiedPages) {
    newPdf.addPage(page);
  }

  return await newPdf.save();
}

/**
 * Creates a new PDF document by keeping only selected pages (Extract pages).
 * @param arrayBuffer The original PDF array buffer
 * @param selectedPages 0-indexed page numbers to KEEP
 */
export async function extractPagesFromPdf(
  arrayBuffer: ArrayBuffer,
  selectedPages: number[]
): Promise<Uint8Array> {
  if (selectedPages.length === 0) {
    throw new Error("No pages selected for extraction.");
  }

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, selectedPages);
  for (const page of copiedPages) {
    newPdf.addPage(page);
  }

  return await newPdf.save();
}

/**
 * Splits a PDF by page ranges into multiple PDFs.
 * Returns an array of objects containing the filename and PDF Uint8Array.
 */
export async function splitPdfByRanges(
  arrayBuffer: ArrayBuffer,
  rangesStr: string,
  originalName: string
): Promise<{ name: string; data: Uint8Array }[]> {
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const parts = rangesStr.split(';');
  const results: { name: string; data: Uint8Array }[] = [];

  const baseName = originalName.replace(/\.[^/.]+$/, "");

  let index = 1;
  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    const pageIndices = parsePageRanges(trimmedPart, totalPages);
    if (pageIndices.length === 0) continue;

    const subPdf = await PDFDocument.create();
    const copiedPages = await subPdf.copyPages(pdfDoc, pageIndices);
    for (const page of copiedPages) {
      subPdf.addPage(page);
    }

    const savedData = await subPdf.save();
    // Use the custom range in the name
    const rangeNameStr = trimmedPart.replace(/[\s,]+/g, "_");
    results.push({
      name: `${baseName}_range_${rangeNameStr}.pdf`,
      data: savedData,
    });
    index++;
  }

  if (results.length === 0) {
    throw new Error("No valid page ranges entered. Example: 1-3; 4-6");
  }

  return results;
}

/**
 * Splits a PDF into multiple PDFs, each containing N pages.
 */
export async function splitPdfEveryNPages(
  arrayBuffer: ArrayBuffer,
  n: number,
  originalName: string
): Promise<{ name: string; data: Uint8Array }[]> {
  if (n <= 0) throw new Error("Split page count must be greater than 0");

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();
  const results: { name: string; data: Uint8Array }[] = [];

  const baseName = originalName.replace(/\.[^/.]+$/, "");

  for (let start = 0; start < totalPages; start += n) {
    const end = Math.min(start + n, totalPages);
    const pageIndices: number[] = [];
    for (let i = start; i < end; i++) {
      pageIndices.push(i);
    }

    const subPdf = await PDFDocument.create();
    const copiedPages = await subPdf.copyPages(pdfDoc, pageIndices);
    for (const page of copiedPages) {
      subPdf.addPage(page);
    }

    const savedData = await subPdf.save();
    results.push({
      name: `${baseName}_pages_${start + 1}_to_${end}.pdf`,
      data: savedData,
    });
  }

  return results;
}

/**
 * Creates a ZIP file containing multiple PDFs and returns its Blob.
 */
export async function createZipBlob(
  files: { name: string; data: Uint8Array }[]
): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.data);
  }
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Adds watermarks to pages of a PDF document based on settings.
 */
export async function addWatermarkToPdf(
  arrayBuffer: ArrayBuffer,
  settings: WatermarkSettings
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Convert settings color from hex to RGB
  const hex = settings.textColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0;

  // Draw on selected pages
  for (let i = 0; i < totalPages; i++) {
    let shouldWatermark = false;

    if (settings.pageSelection === 'all') {
      shouldWatermark = true;
    } else if (settings.pageSelection === 'first' && i === 0) {
      shouldWatermark = true;
    } else if (settings.pageSelection === 'last' && i === totalPages - 1) {
      shouldWatermark = true;
    } else if (settings.pageSelection === 'even' && (i + 1) % 2 === 0) {
      shouldWatermark = true;
    } else if (settings.pageSelection === 'odd' && (i + 1) % 2 !== 0) {
      shouldWatermark = true;
    }

    // Note: 'selected' mode is handled in App state by copying current active page indexes
    if (!shouldWatermark && settings.pageSelection !== 'selected') {
      continue;
    }

    // Draw watermark
    const page = pages[i];
    const { width, height } = page.getSize();

    // Text metrics
    const textWidth = helveticaFont.widthOfTextAtSize(settings.text, settings.fontSize);
    const textHeight = helveticaFont.heightAtSize(settings.fontSize);

    // Calculate coordinates based on position
    let x = 0;
    let y = 0;
    const padding = 30;

    switch (settings.position) {
      case 'center':
        x = width / 2 - textWidth / 2;
        y = height / 2 - textHeight / 2;
        break;
      case 'topLeft':
        x = padding;
        y = height - padding - textHeight;
        break;
      case 'topCenter':
        x = width / 2 - textWidth / 2;
        y = height - padding - textHeight;
        break;
      case 'topRight':
        x = width - padding - textWidth;
        y = height - padding - textHeight;
        break;
      case 'middleLeft':
        x = padding;
        y = height / 2 - textHeight / 2;
        break;
      case 'middleRight':
        x = width - padding - textWidth;
        y = height / 2 - textHeight / 2;
        break;
      case 'bottomLeft':
        x = padding;
        y = padding;
        break;
      case 'bottomCenter':
        x = width / 2 - textWidth / 2;
        y = padding;
        break;
      case 'bottomRight':
        x = width - padding - textWidth;
        y = padding;
        break;
    }

    page.drawText(settings.text, {
      x,
      y,
      size: settings.fontSize,
      font: helveticaFont,
      color: rgb(r, g, b),
      opacity: settings.opacity,
      rotate: degrees(settings.rotation),
    });
  }

  return await pdfDoc.save();
}

/**
 * Reads document metadata from a PDF file.
 */
export async function getPdfMetadata(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  fileSizeInBytes: number
): Promise<PdfMetadata> {
  const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
  
  const title = pdfDoc.getTitle() || 'Not available';
  const author = pdfDoc.getAuthor() || 'Not available';
  const subject = pdfDoc.getSubject() || 'Not available';
  const keywords = pdfDoc.getKeywords() || 'Not available';
  const creator = pdfDoc.getCreator() || 'Not available';
  const producer = pdfDoc.getProducer() || 'Not available';

  const creationDateObj = pdfDoc.getCreationDate();
  const modDateObj = pdfDoc.getModificationDate();

  const creationDate = creationDateObj ? creationDateObj.toLocaleString() : 'Not available';
  const modificationDate = modDateObj ? modDateObj.toLocaleString() : 'Not available';

  const pageCount = pdfDoc.getPageCount();
  
  // Format file size
  let fileSizeStr = `${fileSizeInBytes} Bytes`;
  if (fileSizeInBytes > 1024 * 1024) {
    fileSizeStr = `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (fileSizeInBytes > 1024) {
    fileSizeStr = `${(fileSizeInBytes / 1024).toFixed(1)} KB`;
  }

  const pdfVersion = '1.7'; // standard output version of pdf-lib
  const isEncrypted = pdfDoc.isEncrypted;

  return {
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    creationDate,
    modificationDate,
    pdfVersion,
    pageCount,
    fileSize: fileSizeStr,
    isEncrypted,
  };
}

/**
 * Cleans and decodes a Base64 string into a Uint8Array, checking for PDF signature.
 */
export function decodeBase64ToPdf(base64Input: string): Uint8Array {
  // Strip spaces, line breaks, and potential data uri prefix
  let cleaned = base64Input.trim().replace(/\s/g, '');
  
  if (cleaned.startsWith('data:application/pdf;base64,')) {
    cleaned = cleaned.substring('data:application/pdf;base64,'.length);
  } else if (cleaned.includes(';base64,')) {
    // try to split by base64,
    const split = cleaned.split(';base64,');
    if (split.length > 1) {
      cleaned = split[1];
    }
  }

  try {
    const binaryString = atob(cleaned);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Verify PDF Magic Bytes Signature: %PDF (ASCII [37, 80, 68, 70])
    if (bytes.length < 4 || bytes[0] !== 37 || bytes[1] !== 80 || bytes[2] !== 68 || bytes[3] !== 70) {
      throw new Error("Invalid format. The decoded file does not appear to start with the PDF signature (%PDF).");
    }

    return bytes;
  } catch (error: any) {
    if (error.message && error.message.includes("PDF signature")) {
      throw error;
    }
    throw new Error("Invalid Base64 string. Please make sure the input is a valid Base64 encoded payload.");
  }
}
