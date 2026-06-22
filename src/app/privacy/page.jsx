// src/app/privacy/page.jsx
'use client';
import Layout from "@layout/Layout";
import "@styles/privacy.css";

export default function PrivacyPage() {
  return (
    <Layout title="Privacy Policy & Terms" description="Legal guidelines, privacy protection protocols, and website terms of use.">
      <main className="privacy-container">
        
        <header className="privacy-hero hero-identity-group">
          <h1 className="hero-main-title">Privacy Policy & Terms of Use</h1>
          <p className="hero-sub-tagline">Please read these legal terms and data protocols carefully before utilizing our platforms.</p>
        </header>

        <article className="privacy-content">
          <div className="privacy-meta-date">Last Updated: May 2026</div>

          {/* Section 1: Terms of Use Scope */}
          <section className="privacy-section">
            <h2>1. Terms of Use</h2>
            <p>
              By accessing and using this website, you agree to comply with and be bound by the following terms and rules of usage. The content provided on this site is for general scientific information, educational purposes, and organizational transparency.
            </p>
            <p>
              Unauthorized use of this website, including modification of open-source frameworks without compliance with their respective licenses, or attempts to disrupt hosting stability, is strictly prohibited.
            </p>
          </section>

          {/* Section 2: Data Collection & Privacy */}
          <section className="privacy-section">
            <h2>2. Privacy Policy & Data Collection</h2>
            <p>
              Sivasakthi Science Foundation™ respects your personal privacy and is committed to protecting any information shared via our contact portals.
            </p>
            <p>
              When you submit an item through our site (such as on our Contact and Connect framework), we may collect:
            </p>
            <ul>
              <li>Your name and contact coordinates.</li>
              <li>Your email address for communication loops.</li>
              <li>The structural text contents of your message or partnership query.</li>
            </ul>
            <p>
              This data is strictly utilized to respond to your specific inquiry or organize volunteer operations. We do not rent, sell, or distribute your email addresses or submitted information to outside corporate third parties.
            </p>
          </section>

          {/* Section 3: Intellectual Property & Open Access */}
          <section className="privacy-section">
            <h2>3. Intellectual Property Rights</h2>
            <p>
              The branding, trademarks, design setups, and custom code shells used here are protected property. However, in line with our open-science commitments, foundational data insights and research publications are shared under public domain open-access guidelines unless stated otherwise.
            </p>
          </section>

        </article>
      </main>
    </Layout>
  );
}
