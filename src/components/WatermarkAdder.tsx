/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Type, FileText, Download, ArrowLeft, Loader2, 
  CheckCircle, Palette, RotateCw, AlignCenter, Sliders, AlertCircle 
} from 'lucide-react';
import { PdfFileState, WatermarkSettings } from '../types';
import { addWatermarkToPdf } from '../lib/pdf/pdfOperations';
import FileUploader from './FileUploader';
import AdContainer from './AdContainer';

export default function WatermarkAdder() {
  const [fileState, setFileState] = useState<PdfFileState | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>({
    text: 'CONFIDENTIAL',
    fontSize: 50,
    opacity: 0.25,
    rotation: -45,
    position: 'center',
    textColor: '#FF0000',
    pageSelection: 'all',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    // Dynamically query page count in background
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
    setErrorMsg(null);
  };

  const handleApplyWatermark = async () => {
    if (!fileState) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setProcessedBlobUrl(null);
    setIsProcessing(true);

    try {
      if (!settings.text.trim()) {
        throw new Error("Watermark text cannot be empty.");
      }

      const watermarkedBytes = await addWatermarkToPdf(fileState.arrayBuffer, settings);
      const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProcessedBlobUrl(url);

      const baseName = fileState.name.replace(/\.[^/.]+$/, "");
      setProcessedFileName(`${baseName}_watermarked.pdf`);
      setSuccessMsg("Watermark applied successfully! Download your watermarked document.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add watermark. Make sure the PDF is not encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWorkspace = () => {
    setFileState(null);
    setProcessedBlobUrl(null);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="pdf-watermark-workspace">
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center justify-center gap-2">
          <Type className="text-indigo-600 w-8 h-8" />
          Add Watermark to PDF
        </h1>
        <p className="text-stone-500 text-sm">
          Overlay high-fidelity text watermarks across your document pages. Set colors, opacities, alignments, and sizes. Processing is completed 100% locally.
        </p>
      </div>

      {!fileState ? (
        <div className="space-y-6">
          <FileUploader onFileLoaded={handleFileLoaded} />
          <AdContainer type="banner" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Settings Column */}
          <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Watermark Options</h2>

            {/* Text Input */}
            <div className="space-y-2">
              <label htmlFor="watermark-text" className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Watermark Text
              </label>
              <input
                type="text"
                id="watermark-text"
                value={settings.text}
                onChange={(e) => setSettings(prev => ({ ...prev, text: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-855 focus:outline-hidden focus:border-indigo-500 transition-colors"
                placeholder="e.g. CONFIDENTIAL"
              />
            </div>

            {/* Colors and Opacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="watermark-color" className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" />
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="watermark-color"
                    value={settings.textColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-8 h-8 rounded-md cursor-pointer border border-stone-200 p-0"
                  />
                  <span className="text-xs font-mono font-medium text-stone-600 uppercase">{settings.textColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="watermark-fontsize" className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Font Size
                </label>
                <input
                  type="number"
                  id="watermark-fontsize"
                  min={8}
                  max={120}
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value, 10) || 12 }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-850 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Opacity slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="watermark-opacity" className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Opacity
                </label>
                <span className="text-xs font-mono font-bold text-stone-500">{Math.round(settings.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                id="watermark-opacity"
                min="0.05"
                max="1"
                step="0.05"
                value={settings.opacity}
                onChange={(e) => setSettings(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Rotation slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="watermark-rotation" className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  Rotation Angle
                </label>
                <span className="text-xs font-mono font-bold text-stone-500">{settings.rotation}°</span>
              </div>
              <input
                type="range"
                id="watermark-rotation"
                min="-180"
                max="180"
                step="5"
                value={settings.rotation}
                onChange={(e) => setSettings(prev => ({ ...prev, rotation: parseInt(e.target.value, 10) }))}
                className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Position Select */}
            <div className="space-y-2">
              <label htmlFor="watermark-position" className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                <AlignCenter className="w-3.5 h-3.5" />
                Layout Position
              </label>
              <select
                id="watermark-position"
                value={settings.position}
                onChange={(e) => setSettings(prev => ({ ...prev, position: e.target.value as any }))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 focus:outline-hidden focus:border-indigo-500 transition-colors"
              >
                <option value="center">Center / Diagonal</option>
                <option value="topLeft">Top Left</option>
                <option value="topCenter">Top Center</option>
                <option value="topRight">Top Right</option>
                <option value="middleLeft">Middle Left</option>
                <option value="middleRight">Middle Right</option>
                <option value="bottomLeft">Bottom Left</option>
                <option value="bottomCenter">Bottom Center</option>
                <option value="bottomRight">Bottom Right</option>
              </select>
            </div>

            {/* Target pages */}
            <div className="space-y-2">
              <label htmlFor="watermark-targets" className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Target Pages
              </label>
              <select
                id="watermark-targets"
                value={settings.pageSelection}
                onChange={(e) => setSettings(prev => ({ ...prev, pageSelection: e.target.value as any }))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 focus:outline-hidden focus:border-indigo-500 transition-colors"
              >
                <option value="all">Apply to All Pages</option>
                <option value="first">Apply to First Page Only</option>
                <option value="last">Apply to Last Page Only</option>
                <option value="even">Apply to Even Pages Only</option>
                <option value="odd">Apply to Odd Pages Only</option>
              </select>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleApplyWatermark}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Embedding Watermark...
                </>
              ) : (
                <>
                  <Type className="w-4 h-4" />
                  Add Watermark
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

          {/* Preview Panel Right Columns */}
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
                100% Offline
              </span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-red-900">Embedding Error</p>
                  <p className="text-xs text-red-700 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Success Download Bar */}
            {successMsg && processedBlobUrl && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in" id="watermark-success">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-center sm:text-left">
                    <p className="text-sm font-bold text-emerald-900">Your Watermarked PDF is ready!</p>
                    <p className="text-xs text-emerald-700">{successMsg}</p>
                  </div>
                </div>
                <a
                  href={processedBlobUrl}
                  download={processedFileName}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Download Watermarked PDF
                </a>
              </div>
            )}

            {/* Visual preview box representing the page layout with the settings overlay */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-8 flex flex-col items-center justify-center relative min-h-[360px]" id="watermark-preview-panel">
              <span className="absolute top-4 left-4 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Watermark Preview Guide</span>
              
              <div className="w-56 h-80 bg-white border border-stone-300 rounded-lg shadow-md flex items-center justify-center p-4 relative overflow-hidden select-none">
                {/* Mock Content Lines to resemble a document page */}
                <div className="w-full space-y-3 opacity-15">
                  <div className="h-4 bg-stone-900 rounded-xs w-4/5"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-full"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-5/6"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-11/12"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-2/3"></div>
                  <div className="h-4 bg-stone-900 rounded-xs w-1/2 pt-4"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-full"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-5/6"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-4/5"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-11/12"></div>
                  <div className="h-3 bg-stone-900 rounded-xs w-3/4"></div>
                </div>

                {/* Overlaid active watermark simulation */}
                <div 
                  className="absolute pointer-events-none transition-all flex items-center justify-center font-bold tracking-tight text-center truncate"
                  style={{
                    color: settings.textColor,
                    opacity: settings.opacity,
                    fontSize: `${Math.min(settings.fontSize / 2.5, 36)}px`,
                    transform: `rotate(${settings.rotation}deg)`,
                    ...(() => {
                      switch (settings.position) {
                        case 'topLeft': return { top: 12, left: 12, transformOrigin: 'top left' };
                        case 'topCenter': return { top: 12, left: '50%', transform: `translateX(-50%) rotate(${settings.rotation}deg)` };
                        case 'topRight': return { top: 12, right: 12, transformOrigin: 'top right' };
                        case 'middleLeft': return { top: '50%', left: 12, transform: `translateY(-50%) rotate(${settings.rotation}deg)` };
                        case 'middleRight': return { top: '50%', right: 12, transform: `translateY(-50%) rotate(${settings.rotation}deg)` };
                        case 'bottomLeft': return { bottom: 12, left: 12, transformOrigin: 'bottom left' };
                        case 'bottomCenter': return { bottom: 12, left: '50%', transform: `translateX(-50%) rotate(${settings.rotation}deg)` };
                        case 'bottomRight': return { bottom: 12, right: 12, transformOrigin: 'bottom right' };
                        case 'center':
                        default:
                          return { top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${settings.rotation}deg)` };
                      }
                    })()
                  }}
                >
                  {settings.text || 'CONFIDENTIAL'}
                </div>
              </div>
              <p className="text-[11px] text-stone-400 font-medium mt-4 text-center">
                Visual mock demonstrating text size, color, opacity, rotation, and alignment relative to a single page.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
