// src/app/projects/initiatives/page.jsx
'use client';
import Layout from "@layout/Layout";
import "@styles/initiatives.css";

export default function InitiativesPage() {
  return (
    <Layout title="Programs & Initiatives" description="Explore our active genomics, bioinformatics, and AI research tracks.">
      <main className="initiatives-container">
        
        <header className="initiatives-hero hero-identity-group">
          <h1 className="hero-main-title">Programs & Initiatives</h1>
          <p className="hero-sub-tagline">Advancing scientific frontiers through innovative computational research and grants.</p>
        </header>

        <div className="initiatives-grid">
          
          {/* Track 1: Bioinformatics & Genomics */}
          <section className="vertical-section">
            <span className="vertical-badge">Track 01</span>
            <h2>Bioinformatics & Genomics Research</h2>
            <p>
              We focus on unlocking the genetic profiles of indigenous species by bridging raw processing infrastructure with modern analytics tools. This vertical powers open-source mapping pipelines, providing structural data points crucial for ecological monitoring and regional biological discovery.
            </p>
            <ul className="bullet-list">
              <li><i className="fas fa-check"></i> High-Throughput Sequencing Maps</li>
              <li><i className="fas fa-check"></i> Indigenous Species Archiving</li>
              <li><i className="fas fa-check"></i> Open-Access Data Infrastructures</li>
              <li><i className="fas fa-check"></i> Comparative Phylogeny Tools</li>
            </ul>
          </section>

          {/* Track 2: Artificial Intelligence */}
          <section className="vertical-section">
            <span className="vertical-badge">Track 02</span>
            <h2>AI & Deep Learning Verticals</h2>
            <p>
              Applying advanced computational models to complex biological datasets. By leveraging targeted machine learning architectures and deep neural patterns, this initiative speeds up predictive sequence analysis, structural modeling, and translational health informatics.
            </p>
            <ul className="bullet-list">
              <li><i className="fas fa-check"></i> Predictive Neural Networks</li>
              <li><i className="fas fa-check"></i> Automated Feature Annotation</li>
              <li><i className="fas fa-check"></i> Algorithm Pipeline Validation</li>
              <li><i className="fas fa-check"></i> Scalable Inference Frameworks</li>
            </ul>
          </section>

          {/* Track 3: Incubator Fund */}
          <section className="vertical-section">
            <span className="vertical-badge">Track 03</span>
            <h2>Incubator Research Fund</h2>
            <p>
              Supporting innovative ideas and independent scientific inquiries. Our program offers seed funding, cloud compute resources, and structured academic mentorship channels to accelerate early-stage projects into robust, peer-reviewed realities.
            </p>
            <ul className="bullet-list">
              <li><i className="fas fa-check"></i> Seed Project Grants</li>
              <li><i className="fas fa-check"></i> Compute Cluster Allocation</li>
              <li><i className="fas fa-check"></i> Milestone-Driven Fellowships</li>
              <li><i className="fas fa-check"></i> Academic Publishing Support</li>
            </ul>
          </section>

        </div>
      </main>
    </Layout>
  );
}