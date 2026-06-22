// src/app/about/ourstory/page.jsx
'use client';
import Layout from "@layout/Layout";
import "@styles/ourstory.css";

export default function OurStoryPage() {
  return (
    <Layout title="Our Story | About" description="The journey, mission, and vision of Sivasakthi Science Foundation™">
      <main className="story-container">
        
        {/* Hero Identity Block */}
        <header className="story-hero-section hero-identity-group">
          <h1 className="hero-main-title">Our Story & History</h1>
          <p className="hero-sub-tagline">Tracing our foundational journey, core values, and scientific trajectory.</p>
        </header>

        <article className="story-narrative">
          
          {/* Section 1: About Us / Background */}
          <section className="story-block">
            <h2>Who We Are</h2>
            <p>
              Sivasakthi Science Foundation™ is a public charitable trust dedicated to advancing education, research, and scientific innovation. The foundation works across disciplines to encourage knowledge creation, support meaningful learning, and connect academic ideas with practical, real-world impact.
            </p>
            <p>
              By establishing strategic partnerships and bringing together students, educators, researchers, and professionals, we create robust environments for continuous scientific engagement that benefit both individuals and community healthcare infrastructures.
            </p>
          </section>

          {/* Section 2: Mission & Vision Grid */}
          <section className="story-block">
            <h2>Mission & Vision</h2>
            <p>
              Our operations are bound to a strict scientific manifesto: moving beyond simple metrics or raw data collection, and starting to drive deep, strategic healthcare value through technology.
            </p>
            
            <div className="story-callout-grid">
              <div className="story-card">
                <h3>Our Mission</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  To bridge high-throughput genomics with computational deep learning tools to solve complex biological questions while prioritizing exploratory human assessment and transparency.
                </p>
              </div>
              <div className="story-card">
                <h3>Core Directives</h3>
                <ul>
                  <li>Open-access infrastructure deployment.</li>
                  <li>Sustaining independent research funding.</li>
                  <li>Fostering specialized training and internships.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: History Chronology */}
          <section className="story-block">
            <h2>Continuing the Legacy</h2>
            <p>
              The foundation began with a singular focus: offering scholarships and foundational guidance to young students within underrepresented regional communities. Over time, that directive scaled as the intersection of computational power and biological datasets transformed the scientific map.
            </p>
            <p>
              Today, our core initiatives have matured into complex bioinformatics programs, genomics resource hosting, and open-source validation models. From those local scholarship roots to our present-day multi-vertical platform pipelines, our core mission remains entirely fixed: ensuring the structural scientists of tomorrow are fully equipped for the data challenges of today.
            </p>
          </section>

        </article>
      </main>
    </Layout>
  );
}