/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEO and Structured Data Metadata Manager for LocalPdfTools.com
 */

import { AppRoute } from '../types';

export interface SeoMetadataConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  jsonLd: any;
}

export function getSeoConfigForRoute(route: AppRoute, siteBaseUrl: string): SeoMetadataConfig {
  const canonicalUrl = `${siteBaseUrl}${route === '/' ? '' : route}`;
  
  switch (route) {
    case '/pdf-page-remover':
      return {
        title: 'PDF Page Remover Online Free | Remove Pages from PDF',
        description: 'Delete unwanted pages from a PDF directly in your browser. Fully private and instant local processing, no signup or file upload required.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'PDF Page Remover',
          'description': 'Delete individual or multiple pages from any PDF document completely client-side.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }
      };

    case '/pdf-splitter':
      return {
        title: 'Split PDF Online Free | Client-Side PDF Splitter',
        description: 'Split any PDF document by page ranges, extract selected sheets, or split every N pages into equal smaller chunks. No uploads, entirely private.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'PDF Splitter',
          'description': 'Divide, split, or extract PDF pages into custom segments entirely in the browser.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }
      };

    case '/pdf-watermark':
      return {
        title: 'Add Watermark to PDF Online Free | Secure PDF Watermark',
        description: 'Add customizable text watermarks like CONFIDENTIAL or DRAFT to your PDFs. Completely local, adjustable colors, sizes, and orientations.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'PDF Watermark Adder',
          'description': 'Overlay secure text watermarks with custom opacities and alignments locally.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }
      };

    case '/pdf-grayscale':
      return {
        title: 'Convert PDF to Grayscale Online Free | Monochrome PDF',
        description: 'Convert colored PDFs to print-friendly grayscale. High-fidelity client-side canvas processing ensures maximum compatibility.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'PDF Grayscale Converter',
          'description': 'Apply ink-saving monochrome transformations to any PDF file without uploads.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }
      };

    case '/base64-to-pdf':
      return {
        title: 'Base64 to PDF Converter Online Free | Decode PDF',
        description: 'Decode raw Base64 data strings or full data URIs back into downloadable binary PDF files in seconds. Fully local, safe processing.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'Base64 to PDF Decoder',
          'description': 'Extract binary PDF files from raw Base64 data blocks directly on your local device.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }
      };

    case '/pdf-metadata':
      return {
        title: 'PDF Metadata Viewer Online Free | Inspect PDF Properties',
        description: 'Inspect authors, creation dates, software, versions, encryption status, and structural counts of any PDF. Export metadata reports to JSON locally.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'PDF Metadata Viewer',
          'description': 'Inspect and extract embedded properties of PDF files locally inside your browser.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }
      };

    case '/how-to-remove-pages-from-a-pdf':
    case '/how-to-split-a-pdf':
    case '/how-to-add-a-watermark-to-a-pdf':
    case '/how-to-convert-pdf-to-grayscale':
    case '/how-to-convert-base64-to-pdf':
      return {
        title: 'Educational Guide | PDF How-To Guide',
        description: 'Detailed instructions and helpful tutorials explaining how to use client-side technology to manage and edit PDF documents.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          'headline': 'PDF Manipulation Educational Tutorial Guide',
          'inLanguage': 'en',
          'author': {
            '@type': 'Organization',
            'name': 'LocalPdfTools'
          }
        }
      };

    case '/pdf-tools':
      return {
        title: 'All Free PDF Utilities | Private Client-Side Tool Directory',
        description: 'Browse our complete catalog of private document converters, splits, metadata inspectors, and watermark overlays.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'LocalPdfTools Suit',
          'description': 'Comprehensive directory of free browser-based local PDF management applications.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All'
        }
      };

    case '/about':
      return {
        title: 'About LocalPdfTools.com | Client-Side Document Vision',
        description: 'Learn about our privacy-first philosophy, why we never upload files to server portals, and our commitment to browser-based utilities.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          'name': 'About LocalPdfTools'
        }
      };

    case '/contact':
      return {
        title: 'Contact LocalPdfTools.com | Support & Tool Requests',
        description: 'Have a feature proposal, document bug report, or business inquiry? Get in touch with the LocalPdfTools engineering team.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          'name': 'Contact LocalPdfTools'
        }
      };

    case '/':
    default:
      return {
        title: 'Free PDF Tools That Work Locally in Your Browser | LocalPdfTools.com',
        description: 'Remove pages, split PDFs, add watermarks, convert PDFs to grayscale, decode Base64 files, and inspect PDF metadata. Your files never leave your device.',
        canonicalUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'LocalPdfTools',
          'url': siteBaseUrl,
          'description': 'Free PDF utilities that run entirely inside your browser. No server uploads, zero signups required.',
          'applicationCategory': 'Utility',
          'operatingSystem': 'All',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }
      };
  }
}

/**
 * React Side Effect to synchronize page metadata and schemas
 */
export function syncSeoMetadata(route: AppRoute, siteBaseUrl: string) {
  const config = getSeoConfigForRoute(route, siteBaseUrl);
  
  // Update Title
  document.title = config.title;
  
  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);
  
  // Update Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', config.canonicalUrl);
  
  // Update Open Graph tags
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', config.title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', config.description);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', config.canonicalUrl);

  // Update JSON-LD Script
  let ldJsonScript = document.getElementById('seo-jsonld-schema') as HTMLScriptElement;
  if (ldJsonScript) {
    ldJsonScript.textContent = JSON.stringify(config.jsonLd);
  } else {
    ldJsonScript = document.createElement('script');
    ldJsonScript.id = 'seo-jsonld-schema';
    ldJsonScript.type = 'application/ld+json';
    ldJsonScript.textContent = JSON.stringify(config.jsonLd);
    document.head.appendChild(ldJsonScript);
  }
}
