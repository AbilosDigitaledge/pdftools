/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppRoute } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import PageRemover from './components/PageRemover';
import Splitter from './components/Splitter';
import WatermarkAdder from './components/WatermarkAdder';
import GrayscaleConverter from './components/GrayscaleConverter';
import Base64Decoder from './components/Base64Decoder';
import MetadataViewer from './components/MetadataViewer';
import SeoContent from './components/SeoContent';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('/');
  const [featuredFile, setFeaturedFile] = useState<{ file: File; arrayBuffer: ArrayBuffer } | null>(null);

  // Sync hash routing so clicking back/forward or deep linking works elegantly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppRoute;
      const validRoutes: AppRoute[] = [
        '/',
        '/pdf-page-remover',
        '/pdf-splitter',
        '/pdf-watermark',
        '/pdf-grayscale',
        '/base64-to-pdf',
        '/pdf-metadata',
        '/how-to-remove-pages-from-a-pdf',
        '/how-to-split-a-pdf',
        '/how-to-add-a-watermark-to-a-pdf',
        '/how-to-convert-pdf-to-grayscale',
        '/how-to-convert-base64-to-pdf',
        '/pdf-tools',
        '/privacy',
        '/terms',
        '/about',
        '/contact'
      ];
      if (validRoutes.includes(hash)) {
        setRoute(hash);
      } else if (!hash) {
        setRoute('/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initialize on load
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSetRoute = (newRoute: AppRoute) => {
    setRoute(newRoute);
    window.location.hash = newRoute === '/' ? '' : newRoute;
  };

  const handleFeaturedFileLoaded = (file: File, arrayBuffer: ArrayBuffer) => {
    setFeaturedFile({ file, arrayBuffer });
    handleSetRoute('/pdf-page-remover');
  };

  const handleClearFeaturedFile = () => {
    setFeaturedFile(null);
  };

  const renderActiveView = () => {
    switch (route) {
      case '/':
        return (
          <Homepage 
            setRoute={handleSetRoute} 
            onFeaturedFileLoaded={handleFeaturedFileLoaded} 
          />
        );
      case '/pdf-page-remover':
        return (
          <PageRemover 
            initialFile={featuredFile} 
            onClearInitialFile={handleClearFeaturedFile} 
          />
        );
      case '/pdf-splitter':
        return <Splitter />;
      case '/pdf-watermark':
        return <WatermarkAdder />;
      case '/pdf-grayscale':
        return <GrayscaleConverter />;
      case '/base64-to-pdf':
        return <Base64Decoder />;
      case '/pdf-metadata':
        return <MetadataViewer />;
      default:
        // Render informational guides, policies, etc.
        return <SeoContent route={route} setRoute={handleSetRoute} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-800" id="app-root-layout">
      {/* Dynamic Header */}
      <Header currentRoute={route} setRoute={handleSetRoute} />

      {/* Main Workspace Frame */}
      <main className="flex-1" id="main-content-flow">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer setRoute={handleSetRoute} />
    </div>
  );
}
