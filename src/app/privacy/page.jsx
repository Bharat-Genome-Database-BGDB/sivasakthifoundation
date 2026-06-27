// src/app/privacy/page.jsx
'use client';
import Layout from "@layout/Layout";
import "@styles/main.css";

export default function PrivacyPage() {
  return (
    <Layout title="Privacy Policy & Terms" description="Legal guidelines and data protocols.">
      <main className="container py-xl">
        
        <header className="hero-section">
          <h1 className="hero-title">Privacy Policy & Terms of Use</h1>
          <p className="hero-tagline">Please read these legal terms and data protocols carefully.</p>
        </header>

        {/* Section 1 as its own Card */}
        <article className="section-stack">
          <div className="text-sm text-brand-violet font-bold uppercase mb-md">Last Updated: May 2026</div>

          <section className="card p-xl">
            <h2 className="card-title">1. Terms of Use</h2>
            <p className="card-body">
              By accessing and using this website, you agree to comply with and be bound by the following terms and rules of usage. The content provided on this site is for general scientific information, educational purposes, and organizational transparency.
            </p>
          </section>

          {/* Section 2 as its own Card */}
          <section className="card p-xl">
            <h2 className="card-title">2. Privacy Policy & Data Collection</h2>
            <p className="card-body mb-md">
              Sivasakthi Science Foundation™ respects your personal privacy and is committed to protecting any information shared via our contact portals.
            </p>
            <ul className="list-disc pl-md card-body">
              <li>Your name and contact coordinates.</li>
              <li>Your email address for communication loops.</li>
              <li>The structural text contents of your message or partnership query.</li>
            </ul>
          </section>

          {/* Section 3 as its own Card */}
          <section className="card p-xl">
            <h2 className="card-title">3. Intellectual Property Rights</h2>
            <p className="card-body">
              The branding, trademarks, design setups, and custom code shells used here are protected property. However, in line with our open-science commitments, foundational data insights are shared under public domain open-access guidelines.
            </p>
          </section>
        </article>
      </main>
    </Layout>
  );
}