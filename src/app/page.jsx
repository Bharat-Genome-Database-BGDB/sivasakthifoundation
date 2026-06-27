// src/app/page.jsx
'use client';

import Layout from "@layout/Layout";
import "@styles/main.css";

export default function HomePage() {
  return (
    <Layout title="Home" description="Advancing field research, public training, and computational genomics platforms.">
      <main className="container">
        
        {/* 1. Hero Section: Uses hero.css components */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Advancing Scientific Research, Specialized Training & Education</h1>
            <p className="hero-tagline">
              Bridging high-throughput genomics with modern computational deep learning systems to serve community welfare and drive open-access scientific discovery.
            </p>
          </div>
        </section>

        {/* 2. Mission Statement: Uses layout.css scaffolding */}
        <section className="mission-summary">
          <h2>Our Core Scientific Manifesto</h2>
          <p>
            Sivasakthi Science Foundation™ is structured around a clear directive: moving beyond raw data processing to establish meaningful, verifiable computational breakthroughs. By supplying infrastructure, computational analytics pipelines, and milestone grants, we build environment models engineered for the long-term advancement of science and biological insight.
          </p>
        </section>

        {/* 3. Platforms Grid: Uses layout.css (.grid) + cards.css (.card) */}
        <section className="verticals-wrapper">
          <div className="grid grid-3"> {/* Updated to use standard grid system */}
            
            <div className="card">
              <div className="card-icon"><i className="fas fa-dna"></i></div>
              <h3 className="card-title">Genomics & BioInfo</h3>
              <p className="card-body">Deploying open-source sequence processing maps and data hubs to archive and analyze biological datasets across regional profiles.</p>
            </div>

            <div className="card">
              <div className="card-icon"><i className="fas fa-brain"></i></div>
              <h3 className="card-title">Artificial Intelligence</h3>
              <p className="card-body">Leveraging neural pattern mapping and computational deep learning to speed up predictive sequence modeling and translational informatics.</p>
            </div>

            <div className="card">
              <div className="card-icon"><i className="fas fa-seedling"></i></div>
              <h3 className="card-title">Incubator Systems</h3>
              <p className="card-body">Providing independent research funding, high-performance cloud compute assets, and direct academic pipelines for emerging scientific talents.</p>
            </div>

          </div>
        </section>

      </main>
    </Layout>
  );
}