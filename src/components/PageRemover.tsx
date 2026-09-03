/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trash2, FileText, RefreshCw, CheckSquare, Square, 
  Download, ArrowLeft, ShieldCheck, CheckCircle, Info, Loader2 
} from 'lucide-react';
import { PdfFileState, PdfPageInfo } from '../types';
import { renderPdfPageToDataUrl } from '../lib/pdf/pdfRenderer';
import { removePagesFromPdf, extractPagesFromPdf } from '../lib/pdf/pdfOperations';
import FileUploader from './FileUploader';
import AdContainer from './AdContainer';

interface PageRemoverProps {
  initialFile?: { file: File; arrayBuffer: ArrayBuffer } | null;
  onClearInitialFile?: () => void;
}

export default function PageRemover({ initialFile, onClearInitialFile }: PageRemoverProps) {
  const [fileState, setFileState] = useState<PdfFileState | null>(null);
  const [pages, setPages] = useState<PdfPageInfo[]>([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);
  const [rangeInput, setRangeInput] = useState('');
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedBlobUrl, setProcessedBlobUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load from initialFile if provided
  useEffect(() => {
    if (initialFile) {
      setFileState({
        name: initialFile.file.name,
        size: initialFile.file.size,
        pageCount: 0,
        arrayBuffer: initialFile.arrayBuffer,
      });
      setSuccessMsg(null);
      setProcessedBlobUrl(null);
    }
  }, [initialFile]);

  // Load PDF file details and render thumbnails
  const handleFileLoaded = async (file: File, arrayBuffer: ArrayBuffer) => {
    setFileState({
      name: file.name,
      size: file.size,
      pageCount: 0, // will be updated once we read pages
      arrayBuffer,
    });
    setSuccessMsg(null);
    setProcessedBlobUrl(null);
  };

  useEffect(() => {
    if (!fileState) return;

    const loadPages = async () => {
      setLoadingThumbnails(true);
      try {
        // Read page count and render each page thumbnail
        const tempPages: PdfPageInfo[] = [];
        const pdfjsLib = await import('pdfjs-dist');
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(fileState.arrayBuffer) }).promise;
        const pageCount = doc.numPages;

        setFileState(prev => prev ? { ...prev, pageCount } : null);

        // Render thumbnails in parallel
        const promises = [];
        for (let i = 1; i <= pageCount; i++) {
          promises.push(
            renderPdfPageToDataUrl(fileState.arrayBuffer, i, 0.4)
              .then(url => {
                tempPages.push({
                  pageNumber: i,
                  selected: false,
                  thumbnailUrl: url,
                });
              })
              .catch(() => {
                // fallback placeholder if render fails
                tempPages.push({
                  pageNumber: i,
                  selected: false,
                });
              })
          );
        }

        await Promise.all(promises);
        tempPages.sort((a, b) => a.pageNumber - b.pageNumber);
        setPages(tempPages);
      } catch (err) {
        console.error("Failed to render thumbnails:", err);
      } finally {
        setLoadingThumbnails(false);
      }
    };

    loadPages();
  }, [fileState?.arrayBuffer]);

  const togglePageSelection = (pageNumber: number) => {
    setPages(prev => prev.map(p => p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const invertSelection = () => {
    setPages(prev => prev.map(p => ({ ...p, selected: !p.selected })));
  };

  // Select pages based on range input e.g. "1-3, 5"
  const handleApplyRange = () => {
    setRangeError(null);
    if (!rangeInput.trim() || !fileState) return;

    const selectedNumbers = new Set<number>();
    const parts = rangeInput.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > fileState.pageCount || end > fileState.pageCount) {
          setRangeError(`Invalid range: ${trimmed}. Page numbers must be between 1 and ${fileState.pageCount}`);
          return;
        }
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        for (let i = min; i <= max; i++) {
          selectedNumbers.add(i);
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (isNaN(num) || num < 1 || num > fileState.pageCount) {
          setRangeError(`Invalid page number: ${trimmed}. Must be between 1 and ${fileState.pageCount}`);
          return;
        }
        selectedNumbers.add(num);
      }
    }

    setPages(prev => prev.map(p => ({
      ...p,
      selected: selectedNumbers.has(p.pageNumber)
    })));
  };

  const getSelectedIndices = () => {
    return pages.filter(p => p.selected).map(p => p.pageNumber - 1);
  };

  // Perform Page Removal (Discard selected pages)
  const handleRemoveSelected = async () => {
    const selectedIndices = getSelectedIndices();
    if (selectedIndices.length === 0) {
      alert("Please select at least one page to remove.");
      return;
    }
    if (selectedIndices.length === pages.length) {
      alert("You cannot remove all pages from the PDF. At least one page must remain.");
      return;
    }

    setIsProcessing(true);
    setSuccessMsg(null);
    try {
      if (!fileState) return;
      const resultData = await removePagesFromPdf(fileState.arrayBuffer, selectedIndices);
      
      const blob = new Blob([resultData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProcessedBlobUrl(url);

      const baseName = fileState.name.replace(/\.[^/.]+$/, "");
      setProcessedFileName(`${baseName}_removed.pdf`);
      setSuccessMsg(`Successfully removed ${selectedIndices.length} page(s). Your new PDF has ${pages.length - selectedIndices.length} page(s).`);
    } catch (err: any) {
      alert(err.message || "An error occurred while removing pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Perform Page Extraction (Keep only selected pages)
  const handleKeepSelected = async () => {
    const selectedIndices = getSelectedIndices();
    if (selectedIndices.length === 0) {
      alert("Please select at least one page to keep.");
      return;
    }

    setIsProcessing(true);
    setSuccessMsg(null);
    try {
      if (!fileState) return;
      const resultData = await extractPagesFromPdf(fileState.arrayBuffer, selectedIndices);
      
      const blob = new Blob([resultData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProcessedBlobUrl(url);

      const baseName = fileState.name.replace(/\.[^/.]+$/, "");
      setProcessedFileName(`${baseName}_extracted.pdf`);
      setSuccessMsg(`Successfully extracted ${selectedIndices.length} page(s). Your new PDF is ready.`);
    } catch (err: any) {
      alert(err.message || "An error occurred while extracting pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWorkspace = () => {
    setFileState(null);
    setPages([]);
    setRangeInput('');
    setProcessedBlobUrl(null);
    setSuccessMsg(null);
  };

  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="page-remover-workspace">
      {/* Back Link & Info */}
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center justify-center gap-2">
          <Trash2 className="text-indigo-600 w-8 h-8" />
          Remove Pages from PDF
        </h1>
        <p className="text-stone-500 text-sm">
          Delete unwanted blank pages, duplicated records, or sensitive chapters locally. Your document never leaves your machine.
        </p>
      </div>

      {!fileState ? (
        <div className="space-y-6">
          <FileUploader onFileLoaded={handleFileLoaded} />
          <AdContainer type="banner" />
        </div>
      ) : (
        <div className="space-y-6" id="workspace-active-section">
          {/* Top Info Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-center md:text-left">
                <p className="font-bold text-stone-850 text-sm truncate max-w-xs md:max-w-md">{fileState.name}</p>
                <p className="text-xs text-stone-400 font-medium">
                  {fileState.pageCount} Pages • {(fileState.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={resetWorkspace}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Choose Another File
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Quick selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={selectAll}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Deselect All
              </button>
              <button
                onClick={invertSelection}
                className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Invert Selection
              </button>
            </div>

            {/* Custom Range Selector */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Select range e.g. 1-3, 5"
                value={rangeInput}
                onChange={(e) => {
                  setRangeInput(e.target.value);
                  setRangeError(null);
                }}
                className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-850 focus:outline-hidden focus:border-indigo-500 transition-colors flex-1"
              />
              <button
                onClick={handleApplyRange}
                className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Apply Range
              </button>
            </div>
            {rangeError && (
              <p className="text-xs text-red-600 font-semibold">{rangeError}</p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-200">
              <button
                onClick={handleRemoveSelected}
                disabled={selectedCount === 0 || isProcessing}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCount === 0 || isProcessing
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Remove ({selectedCount})
              </button>

              <button
                onClick={handleKeepSelected}
                disabled={selectedCount === 0 || isProcessing}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCount === 0 || isProcessing
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckSquare className="w-3.5 h-3.5" />
                )}
                Extract & Keep ({selectedCount})
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successMsg && processedBlobUrl && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-center sm:text-left">
                  <p className="text-sm font-bold text-emerald-900">Your PDF is ready!</p>
                  <p className="text-xs text-emerald-700">{successMsg}</p>
                </div>
              </div>
              <a
                href={processedBlobUrl}
                download={processedFileName}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          )}

          {/* Thumbnail loading states */}
          {loadingThumbnails ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-sm text-stone-500 font-semibold animate-pulse">Generating secure page previews locally...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                <Info className="w-4 h-4 text-stone-400" />
                <span>Tip: Click on pages to select them. Selected pages will be targeted by the toolbar actions.</span>
              </div>

              {/* Grid of Pages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" id="thumbnails-grid">
                {pages.map((page) => (
                  <div
                    key={page.pageNumber}
                    onClick={() => togglePageSelection(page.pageNumber)}
                    className={`group relative bg-white border rounded-xl p-3 cursor-pointer select-none transition-all ${
                      page.selected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/25 shadow-md bg-indigo-50/10'
                        : 'border-stone-200 hover:border-stone-300 shadow-xs'
                    }`}
                  >
                    {/* Visual Checkbox */}
                    <div className="absolute top-4 right-4 z-10">
                      {page.selected ? (
                        <div className="bg-indigo-600 text-white p-0.5 rounded-md">
                          <CheckSquare className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="bg-white/80 backdrop-blur-xs text-stone-400 border border-stone-200 p-0.5 rounded-md group-hover:text-stone-600">
                          <Square className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Canvas Thumbnail Image */}
                    <div className="aspect-3/4 bg-stone-50 border border-stone-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {page.thumbnailUrl ? (
                        <img
                          src={page.thumbnailUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4">
                          <FileText className="w-8 h-8 text-stone-300 mb-1" />
                          <span className="text-[10px] text-stone-400 font-medium">No Preview</span>
                        </div>
                      )}
                    </div>

                    {/* Footer page number indicator */}
                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-stone-500">
                      <span>Page {page.pageNumber}</span>
                      {page.selected && <span className="text-indigo-600 text-[10px] uppercase font-bold">Selected</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
