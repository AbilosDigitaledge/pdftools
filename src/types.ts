/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Types for LocalPdfTools.com
 */

export type AppRoute =
  | '/'
  | '/pdf-page-remover'
  | '/pdf-splitter'
  | '/pdf-watermark'
  | '/pdf-grayscale'
  | '/base64-to-pdf'
  | '/pdf-metadata'
  | '/how-to-remove-pages-from-a-pdf'
  | '/how-to-split-a-pdf'
  | '/how-to-add-a-watermark-to-a-pdf'
  | '/how-to-convert-pdf-to-grayscale'
  | '/how-to-convert-base64-to-pdf'
  | '/pdf-tools'
  | '/privacy'
  | '/terms'
  | '/about'
  | '/contact';

export interface PdfFileState {
  name: string;
  size: number; // in bytes
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export interface PdfPageInfo {
  pageNumber: number;
  selected: boolean;
  thumbnailUrl?: string;
}

export interface WatermarkSettings {
  text: string;
  fontSize: number;
  opacity: number; // 0 to 1
  rotation: number; // in degrees, e.g. -45
  position: 'center' | 'topLeft' | 'topCenter' | 'topRight' | 'middleLeft' | 'middleRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
  textColor: string; // hex color e.g. '#FF0000'
  pageSelection: 'all' | 'selected' | 'first' | 'last' | 'even' | 'odd';
}

export interface SplitSettings {
  mode: 'range' | 'extract' | 'everyN' | 'individual';
  rangeInput: string; // e.g. "1-3, 5"
  splitEveryN: number; // e.g. 2
}

export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  pdfVersion: string;
  pageCount: number;
  fileSize: string;
  isEncrypted: boolean;
}
