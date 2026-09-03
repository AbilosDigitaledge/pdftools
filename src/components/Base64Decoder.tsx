/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileCode, Clipboard, Trash, Download, CheckCircle, 
  AlertCircle, ShieldCheck, RefreshCw, Copy 
} from 'lucide-react';
import { decodeBase64ToPdf } from '../lib/pdf/pdfOperations';
import AdContainer from './AdContainer';

export default function Base64Decoder() {
  const [base64Input, setBase64Input] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Validate base64 input reactively
  useEffect(() => {
    setErrorMsg(null);
    setPdfBlobUrl(null);
    setFileSizeStr(null);

    const trimmed = base64Input.trim().replace(/\s/g, '');
    if (!trimmed) return;

    // Estimate decoded file size: (len * 3) / 4
    let cleanLen = trimmed;
    if (trimmed.startsWith('data:application/pdf;base64,')) {
      cleanLen = trimmed.substring('data:application/pdf;base64,'.length);
    }
    const estimatedBytes = Math.floor((cleanLen.length * 3) / 4);

    if (estimatedBytes > 0) {
      if (estimatedBytes > 1024 * 1024) {
        setFileSizeStr(`~ ${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`);
      } else if (estimatedBytes > 1024) {
        setFileSizeStr(`~ ${(estimatedBytes / 1024).toFixed(1)} KB`);
      } else {
        setFileSizeStr(`~ ${estimatedBytes} Bytes`);
      }
    }
  }, [base64Input]);

  const handleDecode = () => {
    if (!base64Input.trim()) {
      setErrorMsg("Please paste a Base64 string to decode.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setPdfBlobUrl(null);

    try {
      const bytes = decodeBase64ToPdf(base64Input);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to decode Base64 into PDF. Check your input formatting.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCleanBase64 = () => {
    let cleaned = base64Input.trim().replace(/\s/g, '');
    if (cleaned.startsWith('data:application/pdf;base64,')) {
      cleaned = cleaned.substring('data:application/pdf;base64,'.length);
    }
    navigator.clipboard.writeText(cleaned).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setBase64Input('');
    setErrorMsg(null);
    setPdfBlobUrl(null);
    setFileSizeStr(null);
  };

  return (
    <section className="py-10 max-w-4xl mx-auto px-4" id="base64-decoder-workspace">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center justify-center gap-2">
          <FileCode className="text-indigo-600 w-8 h-8" />
          Base64 to PDF Converter
        </h1>
        <p className="text-stone-500 text-sm">
          Decode ASCII Base64 data blocks or standard data URIs into viewable binary PDF documents. Done entirely client-side.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <label htmlFor="base64-input" className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Paste Base64 Payload / Data URI
          </label>
          {fileSizeStr && (
            <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
              Estimated Binary Size: {fileSizeStr}
            </span>
          )}
        </div>

        {/* Text Input Block */}
        <div className="relative">
          <textarea
            id="base64-input"
            rows={8}
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs font-mono text-stone-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all resize-none leading-relaxed"
            placeholder="Paste your Base64 encoded PDF string here (e.g. JVBERi0xLjQK... or data:application/pdf;base64,JVBERi0xLjQK...)"
          ></textarea>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCleanBase64}
              disabled={!base64Input.trim()}
              className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-850 bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Copied Payload
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" />
                  Copy Clean Base64
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={!base64Input.trim()}
              className="px-3.5 py-2 text-xs font-semibold text-stone-500 hover:text-red-600 bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
            >
              <Trash className="w-3.5 h-3.5" />
              Clear Input
            </button>
          </div>

          <button
            onClick={handleDecode}
            disabled={!base64Input.trim() || isProcessing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileCode className="w-4 h-4" />
            )}
            Decode & Convert to PDF
          </button>
        </div>

        {/* Error messaging */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 animate-fade-in" id="base64-error">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-red-900">Decoding Exception</p>
              <p className="text-xs text-red-700 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Download State Banner */}
        {pdfBlobUrl && !errorMsg && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in" id="base64-success">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-sm font-bold text-emerald-900">Binary PDF decoded successfully!</p>
                <p className="text-xs text-emerald-700">The file has been parsed and is fully valid for local saving.</p>
              </div>
            </div>
            <a
              href={pdfBlobUrl}
              download="decoded_document.pdf"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download Decoded PDF
            </a>
          </div>
        )}
      </div>

      <AdContainer type="banner" />
    </section>
  );
}
