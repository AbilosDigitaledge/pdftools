/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Upload, File, AlertCircle, ShieldAlert } from 'lucide-react';

interface FileUploaderProps {
  onFileLoaded: (file: File, arrayBuffer: ArrayBuffer) => void;
  accept?: string;
  maxSizeMB?: number;
}

export default function FileUploader({
  onFileLoaded,
  accept = 'application/pdf',
  maxSizeMB = 150, // Huge standard files are acceptable in browser if memory permits
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMsg(null);

    // Basic size validation
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`We couldn't process this PDF because it exceeds the ${maxSizeMB}MB file size limit. Please try a smaller PDF.`);
      return;
    }

    // Extension and mime validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && file.type !== 'application/pdf') {
      setErrorMsg('Invalid file type. Please upload a valid PDF document (.pdf).');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Simple PDF Header verification (%PDF- )
      const headerBytes = new Uint8Array(arrayBuffer.slice(0, 4));
      const isPdfHeader = headerBytes[0] === 37 && headerBytes[1] === 80 && headerBytes[2] === 68 && headerBytes[3] === 70; // "%PDF"

      if (!isPdfHeader) {
        setErrorMsg("We couldn't process this PDF. The file structure may be corrupted, encrypted, or not a standard PDF. Please try another PDF.");
        return;
      }

      onFileLoaded(file, arrayBuffer);
    } catch (err) {
      setErrorMsg('Failed to read the file. Please make sure the PDF is not corrupted or password-protected.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processSelectedFile(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto" id="file-uploader-wrapper">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`relative border-2 border-dashed rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-stone-250 hover:border-indigo-400 bg-white hover:bg-stone-50/50 shadow-xs'
        }`}
        id="file-uploader-zone"
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerFileSelect();
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          id="pdf-hidden-file-input"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${isDragOver ? 'bg-indigo-100 text-indigo-600' : 'bg-stone-50 text-stone-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg md:text-xl font-bold text-stone-800">
              Drop your PDF here
            </h3>
            <p className="text-sm text-stone-500">
              or <span className="text-indigo-600 font-semibold underline">choose a file</span> from your device
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-stone-400 pt-2">
            <span className="flex items-center gap-1 font-medium bg-stone-100 px-2.5 py-1 rounded-full">
              <File className="w-3.5 h-3.5 text-stone-500" />
              PDF Format Only
            </span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-full font-medium">
              Up to {maxSizeMB}MB
            </span>
          </div>

          {/* Privacy reassurance */}
          <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Files stay entirely on your device. Processing happens 100% locally.</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-in" id="file-uploader-error">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-red-800">Processing Error</p>
            <p className="text-xs text-red-700 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
