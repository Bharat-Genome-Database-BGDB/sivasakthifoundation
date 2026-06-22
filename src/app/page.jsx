// src/app/page.jsx
'use client';

import Layout from "@layout/Layout";
import "@styles/home.css";

export default function HomePage() {
  return (
    <Layout title="Home" description="Advancing field research, public training, and computational genomics platforms.">
      <main className="home-container">
        
        {/* 1. Hero Title Header Banner */}
        <section className="home-hero">
          <h1>Advancing Scientific Research, Specialized Training & Education</h1>
          <p>
            Bridging high-throughput genomics with modern computational deep learning systems to serve community welfare and drive open-access scientific discovery.
          </p>
        </section>

        {/* 2. Unified Mission Statement Focus Block */}
        <section className="home-mission-summary">
          <h2>Our Core Scientific Manifesto</h2>
          <p>
            Sivasakthi Science Foundation™ is structured around a clear directive: moving beyond raw data processing to establish meaningful, verifiable computational breakthroughs. By supplying infrastructure, computational analytics pipelines, and milestone grants, we build environment models engineered for the long-term advancement of science and biological insight.
          </p>
        </section>

        {/* 3. The Core Platforms & Verticals Workspace Grid */}
        <section className="verticals-wrapper">
          <div className="verticals-grid">
            
            <div className="vertical-card">
              <div className="icon-box">
                <i className="fas fa-dna"></i>
              </div>
              <h3>Genomics & BioInfo</h3>
              <p>Deploying open-source sequence processing maps and data hubs to archive and analyze biological datasets across regional profiles.</p>
            </div>

            <div className="vertical-card">
              <div className="icon-box">
                <i className="fas fa-brain"></i>
              </div>
              <h3>Artificial Intelligence</h3>
              <p>Leveraging neural pattern mapping and computational deep learning to speed up predictive sequence modeling and translational informatics.</p>
            </div>

            <div className="vertical-card">
              <div className="icon-box">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Incubator Systems</h3>
              <p>Providing independent research funding, high-performance cloud compute assets, and direct academic pipelines for emerging scientific talents.</p>
            </div>

          </div>
        </section>

      </main>
    </Layout>
  );
}