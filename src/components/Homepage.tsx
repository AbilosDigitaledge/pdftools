/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trash2, Scissors, Type, RefreshCw, FileCode, Eye, 
  ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, ChevronRight, ArrowRight, HelpCircle 
} from 'lucide-react';
import { AppRoute } from '../types';
import FileUploader from './FileUploader';
import AdContainer from './AdContainer';

interface HomepageProps {
  setRoute: (route: AppRoute) => void;
  onFeaturedFileLoaded: (file: File, arrayBuffer: ArrayBuffer) => void;
}

export default function Homepage({ setRoute, onFeaturedFileLoaded }: HomepageProps) {
  const navigateTo = (route: AppRoute) => {
    setRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toolCards = [
    {
      title: 'PDF Page Remover',
      desc: 'Delete duplicate pages, empty cover sheets, or sensitive pages visually.',
      route: '/pdf-page-remover' as AppRoute,
      icon: Trash2,
      badge: 'Flagship'
    },
    {
      title: 'PDF Splitter',
      desc: 'Divide document ranges, split every N pages, or extract individual sheets.',
      route: '/pdf-splitter' as AppRoute,
      icon: Scissors
    },
    {
      title: 'PDF Watermark Adder',
      desc: 'Add text watermarks like CONFIDENTIAL. Set size, color, opacity, and rotation.',
      route: '/pdf-watermark' as AppRoute,
      icon: Type
    },
    {
      title: 'PDF Grayscale Converter',
      desc: 'Convert colored PDFs to monochrome. Printer-friendly and saves ink.',
      route: '/pdf-grayscale' as AppRoute,
      icon: RefreshCw
    },
    {
      title: 'Base64 to PDF Decoder',
      desc: 'Paste Base64 data blocks or URIs to decode back into downloadable binary PDFs.',
      route: '/base64-to-pdf' as AppRoute,
      icon: FileCode
    },
    {
      title: 'PDF Metadata Viewer',
      desc: 'Inspect authors, modification dates, software version, and encryption properties.',
      route: '/pdf-metadata' as AppRoute,
      icon: Eye
    }
  ];

  const faqs = [
    {
      q: 'Are these PDF tools really free?',
      a: 'Yes, 100% free. There are no daily caps, no hidden fees, and no account requirements. You do not need to register with an email or password to use any utility.'
    },
    {
      q: 'Are my PDFs uploaded to a server?',
      a: 'No. Unlike other online converters, LocalPdfTools.com runs entirely client-side using JavaScript inside your web browser. Your files never leave your device.'
    },
    {
      q: 'Can I remove specific PDF pages?',
      a: 'Absolutely. Using our PDF Page Remover flagship workspace, you can view thumbnails of every page, click to select the pages you want to delete or extract, and immediately save the processed document.'
    },
    {
      q: 'Can I split a PDF by custom page range?',
      a: 'Yes. Our PDF Splitter lets you divide documents by range intervals (e.g. 1-3; 4-6) or extract all individual pages. You can download the splits as separate files or packaged as a single ZIP.'
    },
    {
      q: 'Does it work on smartphones and mobile browsers?',
      a: 'Yes. The entire platform is built with mobile-first precision. You can upload, edit, split, and watermark PDFs seamlessly on iPhone, Android, and tablets.'
    },
    {
      q: 'What browsers are supported?',
      a: 'Any modern web browser with standard HTML5 and Web Assembly capabilities is supported, including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge.'
    }
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-16 py-10" id="homepage-container">
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6" id="hero-section">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Local, Fast & Private Client-Side Suite</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Free PDF Tools That Work <span className="text-indigo-600">Locally</span> in Your Browser
        </h1>
        
        <p className="text-lg md:text-xl text-stone-500 max-w-3xl mx-auto leading-relaxed">
          Remove pages, split PDFs, add watermarks, convert PDFs to grayscale, decode Base64 files, and inspect PDF metadata. Your files never leave your device.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigateTo('/pdf-page-remover')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Open PDF Page Remover
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigateTo('/pdf-tools')}
            className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-8 py-3.5 rounded-xl transition-all cursor-pointer"
          >
            Explore All PDF Tools
          </button>
        </div>

        {/* Quick compact benefit tags */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 border-t border-stone-100 text-center">
          <div>
            <span className="block text-sm font-bold text-stone-950">100% Private</span>
            <span className="text-xs text-stone-400">Processed locally in browser</span>
          </div>
          <div className="border-x border-stone-100">
            <span className="block text-sm font-bold text-stone-950">Completely Free</span>
            <span className="text-xs text-stone-400">No account required</span>
          </div>
          <div>
            <span className="block text-sm font-bold text-stone-950">Instant Download</span>
            <span className="text-xs text-stone-400">Zero wait times or queues</span>
          </div>
        </div>
      </section>

      {/* 2. SPONSOR AREA / AD */}
      <AdContainer type="leaderboard" />

      {/* 3. FEATURED TOOL INTERACTIVE CARD */}
      <section className="max-w-4xl mx-auto px-4" id="featured-tool-card">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest">
            Featured Tool
          </div>
          
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-stone-900">PDF Page Remover</h2>
              <p className="text-sm text-stone-500">
                Drop your PDF below to open our flagship visual page editor workspace. Select and remove pages instantly.
              </p>
            </div>

            {/* Local uploader */}
            <FileUploader onFileLoaded={onFeaturedFileLoaded} />

            <div className="text-xs text-stone-400 font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>We comply with absolute privacy guidelines. Filenames and pages remain sandboxed in RAM.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-stone-50 py-16 border-y border-stone-100" id="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">How LocalPdfTools Works</h2>
            <p className="text-sm text-stone-500">Fast browser-based conversion in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 p-6 bg-white border border-stone-100 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center justify-center mx-auto text-sm border border-indigo-100">1</div>
              <h3 className="font-bold text-stone-900 text-base">Upload Your PDF</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Select your document or drag it directly into our secure loader. Your file stays inside your computer's memory.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white border border-stone-100 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center justify-center mx-auto text-sm border border-indigo-100">2</div>
              <h3 className="font-bold text-stone-900 text-base">Choose What You Want To Do</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Select unwanted pages, specify splitting ranges, add watermark text, convert pages to grayscale, or inspect metadata.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white border border-stone-100 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center justify-center mx-auto text-sm border border-indigo-100">3</div>
              <h3 className="font-bold text-stone-900 text-base">Download Your Result</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Download the processed document immediately in one click. No waiting times, queues, or server lag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPLETE TOOLS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="tools-grid-section">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Explore Our Client-Side PDF Utilities</h2>
          <p className="text-sm text-stone-500">Every tool is free, secure, and processes files locally in your browser.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.route}
                onClick={() => navigateTo(tool.route)}
                className="group relative bg-white border border-stone-200 hover:border-indigo-400 p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                )}
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">{tool.title}</h3>
                    <p className="text-stone-500 text-xs leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
                
                <div className="pt-5 flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  <span>Open Tool</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TRUST PRIVACY STRATEGY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="trust-banner-section">
        <div className="bg-indigo-900 text-indigo-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle light element background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-850 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

          <div className="space-y-4 max-w-2xl relative z-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Your Files Stay on Your Device</h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              LocalPdfTools is designed around client-side browser processing. When you upload a file, the PDF data is loaded directly into your local browser's memory sandbox. We do not transmit, analyze, or cache documents on external servers.
            </p>
            <p className="text-xs text-indigo-300 font-semibold">
              No remote database tracking • Zero data persistence traces • Full GDPR compliant design
            </p>
          </div>

          <div className="shrink-0 relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => navigateTo('/privacy')}
              className="w-full sm:w-auto bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer text-center whitespace-nowrap"
            >
              Read Privacy Policy
            </button>
            <button
              onClick={() => navigateTo('/about')}
              className="w-full sm:w-auto bg-indigo-800 hover:bg-indigo-750 text-white font-bold text-sm px-6 py-3 rounded-xl border border-indigo-700 transition-all cursor-pointer text-center"
            >
              About Client-Side Engine
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="max-w-3xl mx-auto px-4" id="faq-section">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Frequently Asked Questions</h2>
          <p className="text-sm text-stone-500">Find quick answers about our client-side platform.</p>
        </div>

        <div className="space-y-3" id="faq-accordion">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-stone-850 hover:text-indigo-600 text-sm transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  {faq.q}
                </span>
                <span className="text-stone-400 font-light text-lg">{activeFaq === idx ? '−' : '+'}</span>
              </button>

              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-stone-600 text-xs leading-relaxed border-t border-stone-100 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
