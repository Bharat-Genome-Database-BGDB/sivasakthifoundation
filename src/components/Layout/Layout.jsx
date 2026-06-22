// src/components/Layout/Layout.jsx
'use client';

import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

/**
 * @component Layout
 * @description Master framework template wrapper handling dynamic document titles, meta descriptions, and cache-busting favicon linking.
 */
export default function Layout({ title, description, children }) {
  
  useEffect(() => {
    const baseBranding = "Sivasakthi Science Foundation™";
    
    // 1. Handle Dynamic Breadcrumb Document Titles
    if (!title || title.toLowerCase() === "home") {
      document.title = baseBranding;
    } else {
      document.title = `${title} | ${baseBranding}`;
    }
    
    // 2. Dynamically Update Meta Description Tag for SEO Crawlers
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }

    // 3. Force-Inject Favicon to Override Aggressive Browser Caches
    let faviconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = `/favicon.ico?v=${Date.now()}`; 
  }, [title, description]);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}