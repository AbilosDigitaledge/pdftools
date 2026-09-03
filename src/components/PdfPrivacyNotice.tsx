/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function PdfPrivacyNotice() {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto my-12" id="privacy-notice-block">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-base md:text-lg">
              Your Files Stay on Your Device
            </h4>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
            LocalPdfTools.com is built entirely on modern client-side Web APIs. When you load a document, its contents are processed directly inside your browser's sandboxed environment. We do not use servers to parse, edit, or store your documents.
          </p>
        </div>
        
        <div className="w-full md:w-auto shrink-0 space-y-2 text-xs font-semibold text-stone-700 bg-white/65 p-4 rounded-xl border border-indigo-50/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0" />
            <span>No Server Uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0" />
            <span>Zero Account Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0" />
            <span>GDPR & CCPA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
