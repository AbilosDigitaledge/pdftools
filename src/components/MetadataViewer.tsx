/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, FileText, Download, ArrowLeft, Loader2, 
  CheckCircle, Copy, Clipboard, AlertCircle, Info 
} from 'lucide-react';
import { PdfFileState, PdfMetadata } from '../types';
import { getPdfMetadata } from '../lib/pdf/pdfOperations';
import FileUploader from './FileUploader';
import AdContainer from './AdContainer';

export default function MetadataViewer() {
  const [fileState, setFileState] = useState<PdfFileState | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileLoaded = async (file: File, arrayBuffer: ArrayBuffer) => {
    setFileState({
      name: file.name,
      size: file.size,
      pageCount: 0,
      arrayBuffer,
    });
    setMetadata(null);
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const info = await getPdfMetadata(arrayBuffer, file.name, file.size);
      setMetadata(info);
    } catch (err: any) {
      setErrorMsg("Failed to read properties. The file may be corrupt or encrypted.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyMetadata = () => {
    if (!metadata) return;
    const formattedText = `
PDF Document Metadata Report:
----------------------------------------
Filename: ${fileState?.name || 'Not available'}
Title: ${metadata.title}
Author: ${metadata.author}
Subject: ${metadata.subject}
Keywords: ${metadata.keywords}
Creator: ${metadata.creator}
Producer: ${metadata.producer}
Creation Date: ${metadata.creationDate}
Modification Date: ${metadata.modificationDate}
PDF Version: ${metadata.pdfVersion}
Page Count: ${metadata.pageCount}
File Size: ${metadata.fileSize}
Encryption: ${metadata.isEncrypted ? 'Encrypted (Protected)' : 'None (Unprotected)'}
----------------------------------------
Exported locally via LocalPdfTools.com
`;

    navigator.clipboard.writeText(formattedText.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadJson = () => {
    if (!metadata) return;
    const reportData = {
      filename: fileState?.name || '',
      exportDate: new Date().toISOString(),
      properties: metadata,
    };
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileState?.name.replace(/\.[^/.]+$/, "")}_metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetWorkspace = () => {
    setFileState(null);
    setMetadata(null);
    setErrorMsg(null);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="metadata-viewer-workspace">
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center justify-center gap-2">
          <Eye className="text-indigo-600 w-8 h-8" />
          PDF Metadata Viewer
        </h1>
        <p className="text-stone-500 text-sm">
          Inspect document properties, creation logs, producer software, and encryption statuses. Processed entirely inside your local sandbox.
        </p>
      </div>

      {!fileState ? (
        <div className="space-y-6">
          <FileUploader onFileLoaded={handleFileLoaded} />
          <AdContainer type="banner" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6" id="metadata-active-section">
          {/* Active summary top-bar */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate max-w-xs sm:max-w-md">
                <p className="font-bold text-stone-850 text-sm truncate">{fileState.name}</p>
                <p className="text-[10px] text-stone-400 font-medium">
                  Size: {(fileState.size / (1024 * 1024)).toFixed(2)} MB • File loaded successfully
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

          {isProcessing && (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-sm text-stone-500 font-semibold animate-pulse">Extracting document headers locally...</p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-red-900">Extraction Error</p>
                <p className="text-xs text-red-700 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {metadata && (
            <div className="space-y-6 animate-fade-in">
              {/* Properties Grid Table */}
              <div className="bg-white border border-stone-150 rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-stone-50 border-b border-stone-150 px-6 py-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Document Properties</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyMetadata}
                      className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-indigo-600 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Report
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download JSON
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Title */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Document Title</span>
                      <p className="text-sm font-bold text-stone-800 break-words">{metadata.title}</p>
                    </div>

                    {/* Author */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Author</span>
                      <p className="text-sm font-semibold text-stone-700 break-words">{metadata.author}</p>
                    </div>

                    {/* Subject */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Subject</span>
                      <p className="text-sm text-stone-600 break-words">{metadata.subject}</p>
                    </div>

                    {/* Keywords */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Keywords</span>
                      <p className="text-sm text-stone-600 break-words">{metadata.keywords}</p>
                    </div>

                    {/* Creator */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Creator Application</span>
                      <p className="text-xs text-stone-600 font-mono break-words">{metadata.creator}</p>
                    </div>

                    {/* Producer */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">PDF Producer</span>
                      <p className="text-xs text-stone-600 font-mono break-words">{metadata.producer}</p>
                    </div>

                    {/* Creation Date */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Creation Date</span>
                      <p className="text-xs text-stone-600 font-semibold">{metadata.creationDate}</p>
                    </div>

                    {/* Mod Date */}
                    <div className="py-2 border-b border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Modification Date</span>
                      <p className="text-xs text-stone-600 font-semibold">{metadata.modificationDate}</p>
                    </div>

                    {/* PDF Version */}
                    <div className="py-2 space-y-1 md:border-0 border-b border-stone-100">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">PDF Specification Version</span>
                      <p className="text-xs text-stone-600 font-mono font-bold">v{metadata.pdfVersion}</p>
                    </div>

                    {/* Page Count */}
                    <div className="py-2 space-y-1 md:border-0 border-b border-stone-100">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Page Count</span>
                      <p className="text-xs text-stone-600 font-bold">{metadata.pageCount} Pages</p>
                    </div>

                    {/* Encryption status */}
                    <div className="py-2 space-y-1 md:col-span-2 bg-stone-50 p-4 rounded-xl border border-stone-150 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Security & Encryption</span>
                        <p className="text-xs font-semibold text-stone-700 mt-1">
                          {metadata.isEncrypted 
                            ? 'This file has active encryption flags enabled.' 
                            : 'This document does not contain active password/encryption structures.'}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        metadata.isEncrypted ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {metadata.isEncrypted ? 'Encrypted' : 'Unprotected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informational reassurance */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-2.5 items-start">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-stone-600 leading-relaxed">
                  LocalPdfTools parses document headers strictly within your client browser RAM. The contents of your documents or their properties are never stored, logged, or uploaded to any web servers.
                </p>
              </div>
            </div>
          )}
          <AdContainer type="banner" />
        </div>
      )}
    </section>
  );
}
