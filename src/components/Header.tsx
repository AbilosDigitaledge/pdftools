/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Shield, FileText, ChevronDown } from 'lucide-react';
import { AppRoute } from '../types';

interface HeaderProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
}

export default function Header({ currentRoute, setRoute }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigateTo = (route: AppRoute) => {
    setRoute(route);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Page Remover', route: '/pdf-page-remover' as AppRoute },
    { label: 'PDF Splitter', route: '/pdf-splitter' as AppRoute },
    { label: 'Watermark', route: '/pdf-watermark' as AppRoute },
    { label: 'Grayscale', route: '/pdf-grayscale' as AppRoute },
  ];

  const moreItems = [
    { label: 'Base64 to PDF', route: '/base64-to-pdf' as AppRoute },
    { label: 'Metadata Viewer', route: '/pdf-metadata' as AppRoute },
    { label: 'How to Remove Pages', route: '/how-to-remove-pages-from-a-pdf' as AppRoute },
    { label: 'How to Split PDF', route: '/how-to-split-a-pdf' as AppRoute },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs" id="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')} id="header-logo-container">
            <div className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900">
                LocalPdf<span className="text-indigo-600">Tools</span>
              </span>
              <span className="block text-[10px] text-stone-500 font-medium leading-none">
                100% Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" id="header-desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 py-2 cursor-pointer ${
                  currentRoute === item.route ? 'text-indigo-600' : 'text-stone-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Dropdown for More Tools */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-indigo-600 py-2 cursor-pointer"
              >
                More Tools
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-100 rounded-xl shadow-lg py-2 z-50">
                  {moreItems.map((item) => (
                    <button
                      key={item.route}
                      onClick={() => navigateTo(item.route)}
                      className="block w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('/pdf-tools')}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              All Tools
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-500 hover:text-stone-900 p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white shadow-lg absolute w-full left-0 py-4 px-6 z-40 space-y-3" id="header-mobile-drawer">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 mb-2">Main Utilities</p>
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                  currentRoute === item.route ? 'bg-indigo-50 text-indigo-600' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3 space-y-1">
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 mb-2">Extended Suit & Help</p>
            {moreItems.map((item) => (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentRoute === item.route ? 'bg-indigo-50 text-indigo-600' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4">
            <button
              onClick={() => navigateTo('/pdf-tools')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              All PDF Tools
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
