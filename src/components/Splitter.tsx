/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Scissors, FileText, Download, ArrowLeft, Loader2, 
  CheckCircle, Plus, HelpCircle, Archive, AlertCircle 
} from 'lucide-react';
import { PdfFileState, SplitSettings } from '../types';
import { splitPdfByRanges, splitPdfEveryNPages, createZipBlob } from '../lib/pdf/pdfOperations';
import FileUploader from './FileUploader';
import AdContainer from './AdContainer';

export default function Splitter() {
  const [fileState, setFileState] = useState<PdfFileState | null>(null);
  const [settings, setSettings] = useState<SplitSettings>({
    mode: 'range',
    rangeInput: '',
    splitEveryN: 1,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [splitFiles, setSplitFiles] = useState<{ name: string; data: Uint8Array; blobUrl: string }[]>([]);
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);

  const handleFileLoaded = (file: File, arrayBuffer: ArrayBuffer) => {
    setFileState({
      name: file.name,
      size: file.size,
      pageCount: 0, // will be updated when we load
      arrayBuffer,
    });
    // Immediately calculate page count via PDFDocument load
    import('pdf-lib').then(async ({ PDFDocument }) => {
      try {
        const doc = await PDFDocument.load(arrayBuffer);
        const pageCount = doc.getPageCount();
        setFileState(prev => prev ? { ...prev, pageCount } : null);
        
        // Preset range input default based on page count
        if (pageCount > 1) {
          const mid = Math.floor(pageCount / 2);
          setSettings(prev => ({ ...prev, rangeInput: `1-${mid}; ${mid + 1}-${pageCount}` }));
        } else {
          setSettings(prev => ({ ...prev, rangeInput: '1' }));
        }
      } catch (err) {
        console.error("Failed to read page count", err);
      }
    });

    setSplitFiles([]);
    setZipBlobUrl(null);
    setErrorMsg(null);
  };

  const handleSplitPdf = async () => {
    if (!fileState) return;
    setErrorMsg(null);
    setIsProcessing(true);
    setSplitFiles([]);
    setZipBlobUrl(null);

    try {
      let results: { name: string; data: Uint8Array }[] = [];

      if (settings.mode === 'range') {
        if (!settings.rangeInput.trim()) {
          throw new Error("Please specify at least one page range. Example: 1-2; 3-5");
        }
        results = await splitPdfByRanges(fileState.arrayBuffer, settings.rangeInput, fileState.name);
      } else if (settings.mode === 'everyN') {
        if (settings.splitEveryN <= 0) {
          throw new Error("Split interval must be 1 or greater.");
        }
        results = await splitPdfEveryNPages(fileState.arrayBuffer, settings.splitEveryN, fileState.name);
      } else if (settings.mode === 'individual') {
        results = await splitPdfEveryNPages(fileState.arrayBuffer, 1, fileState.name);
      }

      if (results.length === 0) {
        throw new Error("No output PDFs were produced. Please review your settings.");
      }

      // Convert Uint8Arrays to blobUrls for individual downloads
      const processedResults = results.map(item => {
        const b = new Blob([item.data], { type: 'application/pdf' });
        return {
          name: item.name,
          data: item.data,
          blobUrl: URL.createObjectURL(b),
        };
      });

      setSplitFiles(processedResults);

      // If multiple files, bundle into ZIP client-side
      if (processedResults.length > 1) {
        const zipBlob = await createZipBlob(results);
        const zipUrl = URL.createObjectURL(zipBlob);
        setZipBlobUrl(zipUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "We couldn't split the PDF. Please check your ranges.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWorkspace = () => {
    setFileState(null);
    setSplitFiles([]);
    setZipBlobUrl(null);
    setErrorMsg(null);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="pdf-splitter-workspace">
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center justify-center gap-2">
          <Scissors className="text-indigo-600 w-8 h-8" />
          Split PDF Online
        </h1>
        <p className="text-stone-500 text-sm">
          Divide a PDF document into multiple smaller documents by page ranges or intervals. Processing happens 100% locally in your browser.
        </p>
      </div>

      {!fileState ? (
        <div className="space-y-6">
          <FileUploader onFileLoaded={handleFileLoaded} />
          <AdContainer type="banner" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Settings Left Column */}
          <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Split Settings</h2>

            {/* Split Mode Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">Split Mode</label>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, mode: 'range' }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    settings.mode === 'range'
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Split by Page Range
                  <span className="block text-[10px] font-normal text-stone-400 mt-1">Specify custom groups (e.g. 1-3; 4-6)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, mode: 'everyN' }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    settings.mode === 'everyN'
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Split every N pages
                  <span className="block text-[10px] font-normal text-stone-400 mt-1">Break down into equal segments of N pages</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, mode: 'individual' }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    settings.mode === 'individual'
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Extract All Individual Pages
                  <span className="block text-[10px] font-normal text-stone-400 mt-1">Export every single page into its own PDF</span>
                </button>
              </div>
            </div>

            {/* Dynamic input fields based on Mode */}
            {settings.mode === 'range' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="splitter-ranges" className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Page Ranges
                  </label>
                  <span className="text-[10px] font-semibold text-stone-400">Total: {fileState.pageCount} pages</span>
                </div>
                <input
                  type="text"
                  id="splitter-ranges"
                  value={settings.rangeInput}
                  onChange={(e) => setSettings(prev => ({ ...prev, rangeInput: e.target.value }))}
                  placeholder="e.g. 1-2; 3-5; 6"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-850 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
                <div className="flex gap-1.5 items-start text-[11px] text-stone-400 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <HelpCircle className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                  <span>
                    Separate distinct outputs with semicolons (<code className="font-semibold text-stone-700">;</code>). Example: <code className="bg-stone-200 px-1 py-0.5 rounded">1-3; 4-6; 7-10</code> creates 3 files.
                  </span>
                </div>
              </div>
            )}

            {settings.mode === 'everyN' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="splitter-interval" className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Interval (N Pages)
                  </label>
                  <span className="text-[10px] font-semibold text-stone-400">Total: {fileState.pageCount} pages</span>
                </div>
                <input
                  type="number"
                  id="splitter-interval"
                  min={1}
                  max={fileState.pageCount}
                  value={settings.splitEveryN}
                  onChange={(e) => setSettings(prev => ({ ...prev, splitEveryN: parseInt(e.target.value, 10) || 1 }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-850 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
                <div className="flex gap-1.5 items-start text-[11px] text-stone-400 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <HelpCircle className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                  <span>
                    If set to <code className="font-semibold text-stone-700">2</code>, a 10-page document is split into five separate 2-page documents.
                  </span>
                </div>
              </div>
            )}

            {settings.mode === 'individual' && (
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-[11px] text-stone-500 leading-relaxed flex gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                <span>
                  Our local engine will extract all {fileState.pageCount} pages individually. This will generate {fileState.pageCount} PDF files packaged in a single download ZIP.
                </span>
              </div>
            )}

            {/* Split Action Button */}
            <button
              onClick={handleSplitPdf}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Splits...
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  Split PDF
                </>
              )}
            </button>

            {/* Change File Link */}
            <button
              onClick={resetWorkspace}
              className="w-full text-center text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Change PDF Document
            </button>
          </div>

          {/* Results Area Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Info Summary */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate max-w-sm">
                  <p className="font-bold text-stone-850 text-sm truncate">{fileState.name}</p>
                  <p className="text-[10px] text-stone-400 font-medium">
                    {fileState.pageCount} Pages • {(fileState.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                Processed Locally
              </span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-red-900">Splitting Error</p>
                  <p className="text-xs text-red-700 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Success Area */}
            {splitFiles.length > 0 ? (
              <div className="space-y-6 animate-fade-in" id="splits-results-section">
                {/* ZIP Download Bar */}
                {zipBlobUrl && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Archive className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 text-center sm:text-left">
                        <p className="text-sm font-bold text-emerald-900">Splits Completed Successfully!</p>
                        <p className="text-xs text-emerald-700">Created {splitFiles.length} separate documents. Download them packaged inside a ZIP.</p>
                      </div>
                    </div>
                    <a
                      href={zipBlobUrl}
                      download={`${fileState.name.replace(/\.[^/.]+$/, "")}_splits.zip`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Download All as ZIP
                    </a>
                  </div>
                )}

                {/* Individual Splits List */}
                <div className="bg-white border border-stone-150 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-stone-50 border-b border-stone-150 px-5 py-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Generated PDFs ({splitFiles.length})</span>
                    <span className="text-[10px] font-semibold text-stone-400">Save individually</span>
                  </div>

                  <div className="divide-y divide-stone-100 max-h-[400px] overflow-y-auto">
                    {splitFiles.map((file, idx) => (
                      <div key={idx} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                        <div className="flex items-center gap-3 truncate min-w-0">
                          <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-stone-700 truncate">{file.name}</span>
                        </div>
                        <a
                          href={file.blobUrl}
                          download={file.name}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-600 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Instructions Placeholder when no split files are generated yet */
              <div className="bg-stone-50/50 border border-stone-200/65 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3 min-h-[300px]" id="splits-empty-state">
                <Scissors className="w-8 h-8 text-stone-300" />
                <div className="space-y-1">
                  <p className="font-bold text-stone-600 text-sm">No Splits Generated Yet</p>
                  <p className="text-xs text-stone-400 max-w-sm">
                    Configure your desired split modes and parameters in the settings panel, then click <strong className="text-stone-500">"Split PDF"</strong> to run the local pipeline.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
