/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  RefreshCw, FileText, Download, ArrowLeft, Loader2, 
  CheckCircle, AlertTriangle, Eye, Info 
} from 'lucide-react';
import { PdfFileState } from '../types';
import { convertPdfToGrayscale } from '../lib/pdf/pdfRenderer';
import FileUploader from './FileUploader';
import AdContainer from './AdContainer';

export default function GrayscaleConverter() {
  const [fileState, setFileState] = useState<PdfFileState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedBlobUrl, setProcessedBlobUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileLoaded = (file: File, arrayBuffer: ArrayBuffer) => {
    setFileState({
      name: file.name,
      size: file.size,
      pageCount: 0,
      arrayBuffer,
    });
    // Calculate page count in background
    import('pdf-lib').then(async ({ PDFDocument }) => {
      try {
        const doc = await PDFDocument.load(arrayBuffer);
        const pageCount = doc.getPageCount();
        setFileState(prev => prev ? { ...prev, pageCount } : null);
      } catch (err) {
        console.error("Failed to load PDF in background", err);
      }
    });

    setProcessedBlobUrl(null);
    setSuccessMsg(null);
  };

  const handleGrayscaleConvert = async () => {
    if (!fileState) return;
    setIsProcessing(true);
    setProgress(0);
    setProcessedBlobUrl(null);
    setSuccessMsg(null);

    try {
      const grayscaleBytes = await convertPdfToGrayscale(fileState.arrayBuffer, (p) => {
        setProgress(p);
      });

      const blob = new Blob([grayscaleBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProcessedBlobUrl(url);

      const baseName = fileState.name.replace(/\.[^/.]+$/, "");
      setProcessedFileName(`${baseName}_grayscale.pdf`);
      setSuccessMsg(`Successfully converted all ${fileState.pageCount} page(s) to grayscale.`);
    } catch (err) {
      console.error(err);
      alert("An error occurred during grayscale conversion. Please try a different or smaller PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWorkspace = () => {
    setFileState(null);
    setProcessedBlobUrl(null);
    setSuccessMsg(null);
    setProgress(0);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="pdf-grayscale-workspace">
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center justify-center gap-2">
          <RefreshCw className="text-indigo-600 w-8 h-8" />
          Convert PDF to Grayscale
        </h1>
        <p className="text-stone-500 text-sm">
          Remove color channels from your PDFs locally. Make files print-ready and save ink. Your documents never leave your computer.
        </p>
      </div>

      {!fileState ? (
        <div className="space-y-6">
          <FileUploader onFileLoaded={handleFileLoaded} />
          <AdContainer type="banner" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6" id="grayscale-active-section">
          {/* File summary and Back bar */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate max-w-xs sm:max-w-md">
                <p className="font-bold text-stone-850 text-sm truncate">{fileState.name}</p>
                <p className="text-[10px] text-stone-400 font-medium">
                  {fileState.pageCount} Pages • {(fileState.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={resetWorkspace}
              className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Choose Different File
            </button>
          </div>

          {/* Grayscale Trade-off Warning block */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Rasterization Notice</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                For absolute compatibility across all types of PDF files (including vector art, scans, form fills, and tables), our engine converts color spaces by rendering pages as high-DPI images inside a new PDF container.
              </p>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">
                Note: Original searchable text layers will be converted to monochrome visual blocks.
              </p>
            </div>
          </div>

          {/* Core Action Section */}
          <div className="bg-white border border-stone-150 rounded-2xl p-8 text-center space-y-6 shadow-xs">
            {!isProcessing && !processedBlobUrl && (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="p-4 bg-indigo-50/50 rounded-full w-fit mx-auto text-indigo-600">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-base">Ready for monochrome conversion</h3>
                  <p className="text-xs text-stone-500">
                    Click the button below to process all {fileState.pageCount} page(s) on your local device.
                  </p>
                </div>
                <button
                  onClick={handleGrayscaleConvert}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Convert to Grayscale
                </button>
              </div>
            )}

            {/* Active converting state with progress bar */}
            {isProcessing && (
              <div className="space-y-5 max-w-md mx-auto py-6" id="grayscale-processing-state">
                <div className="flex justify-center">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-stone-600">
                    <span>Rendering page-by-page grayscale...</span>
                    <span>{progress}%</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 font-medium">
                  This takes a moment depending on document complexity and page count. Do not close this tab.
                </p>
              </div>
            )}

            {/* Finished State and Download */}
            {processedBlobUrl && successMsg && (
              <div className="space-y-5 max-w-md mx-auto py-6 animate-fade-in" id="grayscale-finished-state">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto border border-emerald-100">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-950 text-base">Conversion Completed!</h3>
                  <p className="text-xs text-stone-500">{successMsg}</p>
                </div>
                
                <div className="pt-2">
                  <a
                    href={processedBlobUrl}
                    download={processedFileName}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Grayscale PDF
                  </a>
                </div>

                <button
                  onClick={resetWorkspace}
                  className="text-xs font-semibold text-stone-500 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Convert another document
                </button>
              </div>
            )}
          </div>

          <AdContainer type="banner" />
        </div>
      )}
    </section>
  );
}
