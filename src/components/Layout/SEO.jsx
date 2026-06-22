'use client';
import React from 'react';
import Head from 'next/head';

/**
 * @component SEO
 * @description Standardized SEO component for the Sivasakthi ecosystem.
 * Follows the POT "Shift-Left" philosophy by locking in brand integrity.
 * @param {string} title - Page-specific title
 * @param {string} description - Meta description
 * @param {string} keywords - Array of keyword strings
 * @param {string} image - Path to the social sharing image
 */
const SEO = ({ title, description, keywords, image }) => {
  // --- PROJECT-SPECIFIC BRANDING (Update manually after cloning) ---
  const brandName = 'Sivasakthi Science Foundation™';
  const titleSuffix = ' | Sivasakthi Science Foundation™';
  const siteUrl = 'https://www.sivasakthifoundation.org';
  const defaultImage = '/images/global/Seo_ssf.png';
  
  // --- LOGIC ---
  const pageTitle = title 
    ? `${title}${titleSuffix}` 
    : brandName;

  const pageDescription = description || 'Advancing Research, Training & Education in Genomics and AI.';
  const pageKeywords = keywords?.join(', ') || 'Genomics, Bharat Genome Database, AI, Research, India';
  const pageImage = image || `${siteUrl}${defaultImage}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />

      {/* Twitter */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default SEO;