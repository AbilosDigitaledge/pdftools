/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEO Content & Educational Guides for LocalPdfTools.com
 */

import React, { useState } from 'react';
import { AppRoute } from '../types';
import { 
  Trash2, Scissors, Type, Eye, RefreshCw, FileCode, CheckCircle2, 
  HelpCircle, Shield, Clock, Smartphone, Globe, Mail, MessageSquare, Send
} from 'lucide-react';

interface SeoContentProps {
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
}

export default function SeoContent({ route, setRoute }: SeoContentProps) {
  const navigateTo = (r: AppRoute) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
    }
  };

  const cardStyle = "bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-xs hover:shadow-md transition-all";

  // Render the respective view based on current route
  switch (route) {
    case '/how-to-remove-pages-from-a-pdf':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12" id="how-to-remove-pages-article">
          <nav className="text-xs text-stone-500 mb-6 flex items-center gap-1.5 font-medium">
            <button onClick={() => navigateTo('/')} className="hover:text-indigo-600">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/pdf-tools')} className="hover:text-indigo-600">Guides</button>
            <span>/</span>
            <span className="text-stone-850">How to Remove Pages</span>
          </nav>

          <header className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              How to Remove Pages from a PDF in Your Browser
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Learn how to quickly delete unwanted or duplicate pages from any PDF document. This guide explains how to extract pages locally in 3 seconds without installing files or risking document privacy.
            </p>
          </header>

          <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed text-base">
            <section className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <h2 className="text-lg font-bold text-stone-850 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                Quick Steps to Delete Pages:
              </h2>
              <ol className="list-decimal list-inside space-y-2.5 text-stone-600 font-medium text-sm">
                <li>Open the <button onClick={() => navigateTo('/pdf-page-remover')} className="text-indigo-600 hover:underline font-semibold">PDF Page Remover tool</button>.</li>
                <li>Drag and drop your PDF into the secure upload area.</li>
                <li>Click on the pages you wish to remove (a selection ring will appear).</li>
                <li>Click the <strong className="text-stone-800">"Remove Selected Pages"</strong> action button in the toolbar.</li>
                <li>Immediately download your new, compacted PDF file!</li>
              </ol>
            </section>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Why Remove Unused PDF Pages?</h2>
            <p>
              Often, when downloading reports, receipts, academic texts, or presentation slides, we end up with files containing unnecessary filler pages, legal disclaimers, or blank cover sheets. Removing these pages before sharing:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-4 text-stone-600">
              <li>Reduces file size for easier email and message attachments.</li>
              <li>Improves reader experience by pointing them directly to valuable content.</li>
              <li>Keeps confidential drafts or unnecessary personal details private.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Is My Document Safe When I Remove Pages?</h2>
            <p>
              Yes, when using LocalPdfTools.com. Unlike standard online conversion portals, we never transmit your document to any external servers. Your browser executes the PDF parsing, deletion, and file saving using JavaScript memory. Because the document never leaves your machine, this tool is fully safe for confidential tax documents, work reports, contracts, and medical records.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Need to Split the PDF Instead?</h2>
            <p>
              If instead of deleting pages you wish to chop a file into multiple parts (for instance, splitting a 20-page document into 2 files of 10 pages), you can use our dedicated <button onClick={() => navigateTo('/pdf-splitter')} className="text-indigo-600 hover:underline font-semibold">PDF Splitter Online</button> for range-based segment exports.
            </p>
          </div>
        </article>
      );

    case '/how-to-split-a-pdf':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12" id="how-to-split-article">
          <nav className="text-xs text-stone-500 mb-6 flex items-center gap-1.5 font-medium">
            <button onClick={() => navigateTo('/')} className="hover:text-indigo-600">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/pdf-tools')} className="hover:text-indigo-600">Guides</button>
            <span>/</span>
            <span className="text-stone-850">How to Split PDF</span>
          </nav>

          <header className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              How to Split a PDF Into Multiple Documents for Free
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Splitting PDFs by ranges, page intervals, or individual sheets shouldn't require complex software. Read this quick guide to learn how to divide documents client-side.
            </p>
          </header>

          <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed text-base">
            <section className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <h2 className="text-lg font-bold text-stone-850 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                How to Split Your PDF Document:
              </h2>
              <ol className="list-decimal list-inside space-y-2.5 text-stone-600 font-medium text-sm">
                <li>Go to our <button onClick={() => navigateTo('/pdf-splitter')} className="text-indigo-600 hover:underline font-semibold">PDF Splitter Tool</button>.</li>
                <li>Select the PDF file you wish to split.</li>
                <li>Choose your desired split mode:
                  <ul className="list-disc list-inside pl-6 mt-1 space-y-1 font-normal text-stone-500">
                    <li><strong className="text-stone-700">Split by range:</strong> Specify groups separated by semicolons (e.g. <code className="bg-stone-200 px-1 py-0.5 rounded">1-3; 4-6</code>).</li>
                    <li><strong className="text-stone-700">Extract Pages:</strong> Extract specific sheets to create a new, custom PDF.</li>
                    <li><strong className="text-stone-700">Split every N pages:</strong> Break down a huge file into equal smaller chunks.</li>
                  </ul>
                </li>
                <li>Click <strong className="text-stone-800">"Split PDF"</strong> to run the local algorithm.</li>
                <li>Download your individual files, or download all of them compressed in a single ZIP.</li>
              </ol>
            </section>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Common Scenarios for PDF Splitting</h2>
            <p>
              Splitting a large document is incredibly helpful in numerous everyday contexts:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-4 text-stone-600">
              <li><strong className="text-stone-800">Invoices and Receipts:</strong> Separating a compiled monthly billing file into individual invoices for different clients.</li>
              <li><strong className="text-stone-800">School Chapters:</strong> Splitting bulky textbook chapters into separate reading materials.</li>
              <li><strong className="text-stone-800">Legal Submissions:</strong> Segmenting exhibits or contract clauses to submit separately.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">No File Loss & Completely Private</h2>
            <p>
              Standard server-side splitters upload your document, divide it on their server, and serve it back. This compromises your private business data or accounting files. By performing all operations client-side, LocalPdfTools.com ensures that zero document data is leaked. Try our <button onClick={() => navigateTo('/pdf-splitter')} className="text-indigo-600 hover:underline font-semibold">PDF Splitter</button> now and feel the difference of instant local processing.
            </p>
          </div>
        </article>
      );

    case '/how-to-add-a-watermark-to-a-pdf':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12" id="how-to-watermark-article">
          <nav className="text-xs text-stone-500 mb-6 flex items-center gap-1.5 font-medium">
            <button onClick={() => navigateTo('/')} className="hover:text-indigo-600">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/pdf-tools')} className="hover:text-indigo-600">Guides</button>
            <span>/</span>
            <span className="text-stone-850">How to Add Watermark</span>
          </nav>

          <header className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              How to Add a Secure Watermark to a PDF Document
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Protect your intellectual property, label sensitive drafts as "CONFIDENTIAL", or brand your documents. Learn how to overlay watermark text locally in your browser.
            </p>
          </header>

          <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed text-base">
            <section className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <h2 className="text-lg font-bold text-stone-850 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                How to Add Watermark:
              </h2>
              <ol className="list-decimal list-inside space-y-2.5 text-stone-600 font-medium text-sm">
                <li>Load our <button onClick={() => navigateTo('/pdf-watermark')} className="text-indigo-600 hover:underline font-semibold">PDF Watermark Adder</button>.</li>
                <li>Select the PDF file from your device.</li>
                <li>Enter your preferred watermark text (e.g., <code className="bg-stone-200 px-1 py-0.5 rounded">DRAFT</code> or <code className="bg-stone-200 px-1 py-0.5 rounded">PROPERTY OF COMPANY</code>).</li>
                <li>Customize options: font size, opacity level, orientation angle, text color, and layout position.</li>
                <li>Target specific page options (all pages, only first, only last, etc.).</li>
                <li>Click <strong className="text-stone-800">"Add Watermark"</strong> and download your secured document instantly!</li>
              </ol>
            </section>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Benefits of PDF Watermarking</h2>
            <p>
              Watermarks act as critical visual cues about file security and copyright ownership. They are useful for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-4 text-stone-600">
              <li>Preventing unauthorized distribution or printing of draft versions.</li>
              <li>Marking documents with status indicators (e.g., "APPROVED", "FOR REVIEW").</li>
              <li>Protecting designs, manuscripts, or portfolios from copying.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Zero Watermarking Data Traces</h2>
            <p>
              Your security and privacy are paramount. Adding watermarks on server-based editors risks exposing sensitive papers to server caches and third-party databases. By processing files 100% locally on your computer, LocalPdfTools.com guarantees absolute data sanitization. Use our <button onClick={() => navigateTo('/pdf-watermark')} className="text-indigo-600 hover:underline font-semibold">PDF Watermark Tool</button> for immediate and reliable file security.
            </p>
          </div>
        </article>
      );

    case '/how-to-convert-pdf-to-grayscale':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12" id="how-to-grayscale-article">
          <nav className="text-xs text-stone-500 mb-6 flex items-center gap-1.5 font-medium">
            <button onClick={() => navigateTo('/')} className="hover:text-indigo-600">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/pdf-tools')} className="hover:text-indigo-600">Guides</button>
            <span>/</span>
            <span className="text-stone-850">How to Convert to Grayscale</span>
          </nav>

          <header className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              How to Convert a PDF to Grayscale (Black & White)
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Convert colored PDFs to monochrome to save printing ink, reduce visual clutter, or comply with document requirements. Read on to learn how to run this conversion locally.
            </p>
          </header>

          <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed text-base">
            <section className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <h2 className="text-lg font-bold text-stone-850 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                How to Grayscale Your PDF:
              </h2>
              <ol className="list-decimal list-inside space-y-2.5 text-stone-600 font-medium text-sm">
                <li>Visit our <button onClick={() => navigateTo('/pdf-grayscale')} className="text-indigo-600 hover:underline font-semibold">PDF Grayscale Converter</button>.</li>
                <li>Choose your file.</li>
                <li>Inspect your page count and dimensions.</li>
                <li>Click <strong className="text-stone-800">"Convert to Grayscale"</strong>. Our engine renders pages to canvas and strips color channels manually.</li>
                <li>Download your monochrome PDF!</li>
              </ol>
            </section>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Why Grayscale Your PDF File?</h2>
            <p>
              Converting colored documents to grayscale is a common workflow for numerous reasons:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-4 text-stone-600">
              <li><strong className="text-stone-800">Printer-Friendly:</strong> Avoid using expensive color ink when printing text-based forms or schematics.</li>
              <li><strong className="text-stone-800">Submission Requirements:</strong> Government portals, judicial sites, and university departments often mandate gray documents.</li>
              <li><strong className="text-stone-800">Visual Neutrality:</strong> Grayscaling design drafts lets reviewers focus on layouts, hierarchy, and copy rather than distracting color palettes.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">How Our Grayscale Technology Works</h2>
            <p>
              For maximum standard compatibility, our local grayscale engine converts PDF vector blocks, scans, text layers, and embedded media elements by generating a high-DPI rendering and manually filtering pixel values. While searchable text layers are transformed into black and white image blocks, the layout and text crispness remain fully preserved across all modern PDF readers. Convert your file now using our <button onClick={() => navigateTo('/pdf-grayscale')} className="text-indigo-600 hover:underline font-semibold">Grayscale PDF Tool</button>.
            </p>
          </div>
        </article>
      );

    case '/how-to-convert-base64-to-pdf':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12" id="how-to-base64-article">
          <nav className="text-xs text-stone-500 mb-6 flex items-center gap-1.5 font-medium">
            <button onClick={() => navigateTo('/')} className="hover:text-indigo-600">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('/pdf-tools')} className="hover:text-indigo-600">Guides</button>
            <span>/</span>
            <span className="text-stone-850">How to Convert Base64 to PDF</span>
          </nav>

          <header className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              How to Decode Base64 Strings to PDF Files Online
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Base64 data URIs are commonly used to transmit file payloads inside APIs and databases. Learn how to convert raw Base64 back into viewable and downloadable PDF files.
            </p>
          </header>

          <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed text-base">
            <section className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <h2 className="text-lg font-bold text-stone-850 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                How to Decode Base64 to PDF:
              </h2>
              <ol className="list-decimal list-inside space-y-2.5 text-stone-600 font-medium text-sm">
                <li>Navigate to our <button onClick={() => navigateTo('/base64-to-pdf')} className="text-indigo-600 hover:underline font-semibold">Base64 to PDF Converter</button>.</li>
                <li>Paste your Base64 payload or your full <code className="bg-stone-200 px-1 py-0.5 rounded">data:application/pdf;base64,...</code> URI string.</li>
                <li>Our client-side system instantly sanitizes whitespaces, detects prefixes, calculates file size, and validates the magic file signature.</li>
                <li>Click <strong className="text-stone-800">"Convert to PDF"</strong> and download your file in one click!</li>
              </ol>
            </section>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">What is Base64?</h2>
            <p>
              Base64 is a binary-to-text encoding scheme. It translates binary data into an ASCII string representation. When building web tools, databases, or REST APIs, developers often utilize Base64 strings to represent and store documents (like PDFs, PNGs, and JPEGs) directly inside JSON fields or databases.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-stone-900 pt-4">Why Decode Base64 Locally?</h2>
            <p>
              Since Base64 represents the raw content of your documents, uploading an encoded payload to online converters sends your valuable invoices, agreements, or records to remote servers. At LocalPdfTools.com, we use standard browser window APIs (like `atob` and Uint8Array buffers) to recreate the binary PDF locally in your RAM. Your data stays entirely in your browser sandbox. Convert your strings securely using our <button onClick={() => navigateTo('/base64-to-pdf')} className="text-indigo-600 hover:underline font-semibold">Base64 to PDF Decoder</button>.
            </p>
          </div>
        </article>
      );

    case '/pdf-tools':
      return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="all-tools-directory">
          <header className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              A Complete Suite of Free, Local PDF Utilities
            </h1>
            <p className="text-lg text-stone-600">
              No registration, no file limits, no security concerns. Process documents directly in your web browser with our modular, fast tools.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={cardStyle} id="dir-page-remover-card">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-fit mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">PDF Page Remover</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Delete unnecessary pages, blank cover sheets, or confidential chapters from any PDF. Preview pages visually before deleting.
              </p>
              <button onClick={() => navigateTo('/pdf-page-remover')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer">
                Launch Page Remover →
              </button>
            </div>

            <div className={cardStyle} id="dir-splitter-card">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-fit mb-4">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">PDF Splitter</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Split large PDFs into individual documents by custom page ranges, extract selected pages, or split every N pages into equal files.
              </p>
              <button onClick={() => navigateTo('/pdf-splitter')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer">
                Launch PDF Splitter →
              </button>
            </div>

            <div className={cardStyle} id="dir-watermark-card">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-fit mb-4">
                <Type className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">PDF Watermark Adder</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Add customizable text watermarks like "CONFIDENTIAL" or "DRAFT" to your documents. Set colors, opacities, rotations, and positions.
              </p>
              <button onClick={() => navigateTo('/pdf-watermark')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer">
                Launch Watermark Adder →
              </button>
            </div>

            <div className={cardStyle} id="dir-grayscale-card">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-fit mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">PDF Grayscale Converter</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Convert fully colored PDFs into print-friendly monochrome. High-DPI grayscale canvas rendering guarantees outstanding compatibility.
              </p>
              <button onClick={() => navigateTo('/pdf-grayscale')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer">
                Launch Grayscale Converter →
              </button>
            </div>

            <div className={cardStyle} id="dir-base64-card">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-fit mb-4">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Base64 to PDF Decoder</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Paste raw Base64 data strings or full application data URIs to decode and download the target binary PDF document instantly.
              </p>
              <button onClick={() => navigateTo('/base64-to-pdf')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer">
                Launch Base64 Decoder →
              </button>
            </div>

            <div className={cardStyle} id="dir-metadata-card">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 w-fit mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">PDF Metadata Viewer</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                Inspect author, creation date, modification details, producers, and encryption flags. Export full clean metadata reports to JSON files.
              </p>
              <button onClick={() => navigateTo('/pdf-metadata')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer">
                Launch Metadata Viewer →
              </button>
            </div>
          </div>
        </section>
      );

    case '/privacy':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12" id="privacy-policy-view">
          <header className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-stone-500">Effective Date: August 12, 2026</p>
          </header>

          <div className="prose prose-stone space-y-6 text-stone-700 leading-relaxed text-sm">
            <p>
              At <strong className="text-stone-950">LocalPdfTools.com</strong>, we are deeply committed to protecting your privacy. This page explains how we operate with a 100% client-side data philosophy.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">1. No File Transmission</h2>
            <p>
              Our application relies strictly on modern browser technologies (including PDF.js, pdf-lib, JSZip, and canvas manipulation scripts). When you drag, drop, or select a document, it is loaded into your browser's sandboxed RAM. No files are ever sent, cached, or transferred to remote servers. All file operations take place locally.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">2. Technical Analytics & Cookies</h2>
            <p>
              We may utilize privacy-conscious, non-intrusive analytic scripts to record actions (e.g., "Page Remover Tool Opened", "Grayscale Task Completed") to improve usability. We do not gather personal identifiers, filenames, document contents, metadata, or Base64 string values.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">3. Display Advertising</h2>
            <p>
              To maintain our tools as 100% free with zero signup required, we display minimal advertising banners. Ad networks may utilize standard cookies or telemetry to serve relevant banners. No document details are ever shared with advertisers.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">4. Compliance</h2>
            <p>
              Because we do not store, process, or view your files, our operational model is completely GDPR, CCPA, and HIPAA compliant. You hold absolute control over your sensitive records.
            </p>
          </div>
        </article>
      );

    case '/terms':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12" id="terms-of-service-view">
          <header className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-stone-500">Effective Date: August 12, 2026</p>
          </header>

          <div className="prose prose-stone space-y-6 text-stone-700 leading-relaxed text-sm">
            <p>
              By accessing and using <strong className="text-stone-950">LocalPdfTools.com</strong>, you agree to these Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">1. Permitted Use</h2>
            <p>
              You are free to use all tools, utilities, and guides on this platform for personal or professional document editing. There is no usage cap or forced account signup.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">2. Client-Side Operations & Liability</h2>
            <p>
              Our operations run locally inside your web browser. We do not warrant that our tools are immune to browser memory exceptions or crashes when loading exceptionally large or corrupt files. You are encouraged to maintain copies of any critical original files.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">3. Prohibited Activities</h2>
            <p>
              You may not abuse our platform, attempt to inject malware, disrupt the site structure, or scrape content dynamically.
            </p>

            <h2 className="text-lg font-bold text-stone-900 pt-4">4. Disclaimer</h2>
            <p>
              LOCALPDFTOOLS.COM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE ARE NOT AFFILIATED WITH ADOBE INC. OR OTHER PDF SOFTWARE ENTERPRISES. IN NO EVENT SHALL WE BE LIABLE FOR LOSS OF FILES OR MISPROCESSING.
            </p>
          </div>
        </article>
      );

    case '/about':
      return (
        <article className="max-w-4xl mx-auto px-4 py-12 space-y-8" id="about-us-view">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              About LocalPdfTools.com
            </h1>
            <p className="text-lg text-stone-600">
              Simplifying document utilities while restoring absolute user privacy.
            </p>
          </header>

          <div className="prose prose-stone text-stone-700 leading-relaxed space-y-6 text-sm md:text-base">
            <p>
              The internet is flooded with online PDF portals that claim to be "free" but act as data harvesting farms. Every document you upload to standard servers stays cached in third-party clouds, creating massive security hazards for personal tax returns, company statements, and proprietary legal work.
            </p>
            <p>
              We built <strong className="text-indigo-600 font-semibold">LocalPdfTools.com</strong> to solve this fundamental flaw. By taking advantage of powerful client-side browser engines like `pdf-lib` and `pdf.js`, our toolset manipulates, splits, grayscale-converts, and watermarks PDFs directly inside your browser. No files ever leave your machine, offering absolute safety.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-100 text-center">
                <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-bold text-stone-900 text-sm">Privacy-First</h4>
                <p className="text-xs text-stone-500 mt-1">Zero remote file transmissions</p>
              </div>
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-100 text-center">
                <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-bold text-stone-900 text-sm">No Signup</h4>
                <p className="text-xs text-stone-500 mt-1">Instant, frictionless usage</p>
              </div>
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-100 text-center">
                <Smartphone className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-bold text-stone-900 text-sm">Fully Responsive</h4>
                <p className="text-xs text-stone-500 mt-1">Works seamlessly on any screen</p>
              </div>
            </div>
          </div>
        </article>
      );

    case '/contact':
      return (
        <article className="max-w-xl mx-auto px-4 py-12 space-y-8" id="contact-us-view">
          <header className="text-center space-y-3">
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Contact LocalPdfTools
            </h1>
            <p className="text-sm text-stone-600">
              Have questions, feedback, or a tool request? We'd love to hear from you.
            </p>
          </header>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-150 shadow-sm">
            {formSubmitted ? (
              <div className="text-center space-y-4 py-8" id="contact-success">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-lg">Message Sent</h3>
                  <p className="text-xs text-stone-500">Thank you for getting in touch. We will review your message and respond shortly.</p>
                </div>
                <button 
                  onClick={() => setFormSubmitted(false)} 
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5" id="contact-form">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-850 focus:outline-hidden focus:border-indigo-500 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-850 focus:outline-hidden focus:border-indigo-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-850 focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Describe your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </article>
      );

    default:
      return null;
  }
}
