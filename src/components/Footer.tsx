/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Mail, Lock } from 'lucide-react';
import { AppRoute } from '../types';

interface FooterProps {
  setRoute: (route: AppRoute) => void;
}

export default function Footer({ setRoute }: FooterProps) {
  const navigateTo = (route: AppRoute) => {
    setRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4" id="footer-brand-col">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
              <div className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                LocalPdf<span className="text-indigo-400">Tools</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Fast, privacy-first, and completely local PDF utilities. Processing happens entirely within your web browser. No files are ever sent to a server.
            </p>
            <div className="flex items-center gap-2 text-stone-400 text-xs bg-stone-800 p-3 rounded-lg border border-stone-700/50">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Built for fast, simple PDF tasks without unnecessary uploads or accounts.</span>
            </div>
          </div>

          {/* PDF Tools Column */}
          <div id="footer-tools-col">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">PDF Utilities</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('/pdf-page-remover')} className="hover:text-white transition-colors cursor-pointer text-left">
                  PDF Page Remover
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/pdf-splitter')} className="hover:text-white transition-colors cursor-pointer text-left">
                  PDF Splitter
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/pdf-watermark')} className="hover:text-white transition-colors cursor-pointer text-left">
                  PDF Watermark Adder
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/pdf-grayscale')} className="hover:text-white transition-colors cursor-pointer text-left">
                  PDF Grayscale Converter
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/base64-to-pdf')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Base64 to PDF Decoder
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/pdf-metadata')} className="hover:text-white transition-colors cursor-pointer text-left">
                  PDF Metadata Viewer
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Resources Column */}
          <div id="footer-resources-col">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">How-To Guides</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('/how-to-remove-pages-from-a-pdf')} className="hover:text-white transition-colors cursor-pointer text-left">
                  How to Remove Pages from PDF
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/how-to-split-a-pdf')} className="hover:text-white transition-colors cursor-pointer text-left">
                  How to Split a PDF
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/how-to-add-a-watermark-to-a-pdf')} className="hover:text-white transition-colors cursor-pointer text-left">
                  How to Add a Watermark
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/how-to-convert-pdf-to-grayscale')} className="hover:text-white transition-colors cursor-pointer text-left">
                  How to Grayscale a PDF
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/how-to-convert-base64-to-pdf')} className="hover:text-white transition-colors cursor-pointer text-left">
                  How to Decode Base64 to PDF
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/pdf-tools')} className="hover:text-white transition-colors cursor-pointer text-left font-medium text-indigo-400">
                  Explore All Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Contact Column */}
          <div id="footer-legal-col">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">SaaS Utility</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('/about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/privacy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-stone-800">
              <span className="text-xs text-stone-500 block mb-2">Have questions?</span>
              <button 
                onClick={() => navigateTo('/contact')} 
                className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                abilosdigitaledge1@gmail.com
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer / Bottom bar */}
        <div className="border-t border-stone-850 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 text-center md:text-left" id="footer-bottom-bar">
          <div className="space-y-1">
            <p>© {currentYear} LocalPdfTools.com. All rights reserved.</p>
            <p className="text-stone-600 max-w-2xl leading-relaxed">
              Disclaimer: LocalPdfTools is an independent web utility and is not affiliated with, endorsed by, or associated with Adobe Inc. or other proprietary PDF software providers. All files are handled strictly within the client browser.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-full text-[11px] border border-stone-800 shrink-0 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Zero Server Uploads Enabled
          </div>
        </div>
      </div>
    </footer>
  );
}
