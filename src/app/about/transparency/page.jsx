// src/app/about/transparency/page.jsx
'use client';
import Layout from "@layout/Layout";
import "@styles/transparency.css";

export default function TransparencyPage() {
  return (
    <Layout title="Financial Transparency | About" description="Public disclosures, trust registration records, and governance files.">
      <main className="transparency-container">
        
        <header className="transparency-hero hero-identity-group">
          <h1 className="hero-main-title">Financial Transparency</h1>
          <p className="hero-sub-tagline">Our commitment to open governance, public accountability, and compliance standards.</p>
        </header>

        {/* Section 1: Trust Profile & Statutory Registry */}
        <section className="transparency-section">
          <h2>Trust Registration Details</h2>
          <p>
            Sivasakthi Science Foundation™ operates as a legally registered public charitable trust. We maintain strict alignment with non-profit accounting directives, ensuring all capital allocations directly support our core research, internships, and educational tracks.
          </p>
          
          <div className="registry-grid">
            <div className="registry-item">
              <strong>Entity Type</strong>
              <span>Public Charitable Trust</span>
            </div>
            <div className="registry-item">
              <strong>Registration Number</strong>
              <span>IV/163/2024</span>
            </div>
            <div className="registry-item">
              <strong>Place of Registration</strong>
              <span>Thiruvananthapuram, India</span>
            </div>
            <div className="registry-item">
              <strong>Auditing Frequency</strong>
              <span>Annual Statutory Review</span>
            </div>
          </div>
        </section>

        {/* Section 2: Financial Integrity Policies */}
        <section className="transparency-section">
          <h2>Governance & Resource Allocation</h2>
          <p>
            All financial statements, accounting sheets, and capital logs undergo structured external review before public reporting filing. Our internal framework guarantees that foundation funds are utilized efficiently to deploy open-source genomic data hosting architectures, procure lab resources, and sponsor milestone-driven student grants.
          </p>
          <p>
            Full copies of our certified annual audits and financial returns will be uploaded here to this hub following the conclusion of the statutory filing cycle.
          </p>
        </section>

      </main>
    </Layout>
  );
}