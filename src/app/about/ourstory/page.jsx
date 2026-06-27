'use client';
import Layout from "@layout/Layout";
import "@styles/main.css";

export default function OurStoryPage() {
  return (
    <Layout title="Our Story | About" description="The journey, mission, and vision of Sivasakthi Science Foundation™">
      <main className="container">
        
        {/* Editorial Layout: Center-aligned narrative block */}
        <header className="hero-section">
          <h1 className="hero-title">Our Story & History</h1>
          <p className="hero-tagline">Tracing our foundational journey, core values, and scientific trajectory.</p>
        </header>

        <article className="content-editorial">
          {/* Main Story Content */}
          <section className="card">
            <h2>Who We Are</h2>
            <p>
              Sivasakthi Science Foundation™ is a public charitable trust dedicated to advancing education, research, and scientific innovation. The foundation works across disciplines to encourage knowledge creation, support meaningful learning, and connect academic ideas with practical, real-world impact.
            </p>
            <p>
              By establishing strategic partnerships and bringing together students, educators, researchers, and professionals, we create robust environments for continuous scientific engagement that benefit both individuals and community healthcare infrastructures.
            </p>
          </section>

          {/* New Callout Style: Integrated Focus Block */}
          <section className="card">
            <h2>Our Scientific Vision</h2>
            <p>
              To solve complex biological questions while prioritizing exploratory human assessment and transparency.
            </p>
            <h3>Core Directives</h3>
            <ul>
              <li>Open-access infrastructure deployment.</li>
              <li>Sustaining independent research funding.</li>
              <li>Fostering specialized training and internships.</li>
            </ul>
          </section>

          {/* History Chronology */}
          <section className="card">
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