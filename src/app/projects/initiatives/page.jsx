// src/app/projects/initiatives/page.jsx
'use client';
import Layout from "@layout/Layout";
import "@styles/main.css";

export default function InitiativesPage() {
  const initiatives = [
    {
      badge: "Track 01",
      title: "Bioinformatics & Genomics Research",
      bio: "We focus on unlocking the genetic profiles of indigenous species by bridging raw processing infrastructure with modern analytics tools. This vertical powers open-source mapping pipelines, providing structural data points crucial for ecological monitoring and regional biological discovery.",
      items: [
        "High-Throughput Sequencing Maps",
        "Indigenous Species Archiving",
        "Open-Access Data Infrastructures",
        "Comparative Phylogeny Tools"
      ]
    },
    {
      badge: "Track 02",
      title: "AI & Deep Learning Verticals",
      bio: "Applying advanced computational models to complex biological datasets. By leveraging targeted machine learning architectures and deep neural patterns, this initiative speeds up predictive sequence analysis, structural modeling, and translational health informatics.",
      items: [
        "Predictive Neural Networks",
        "Automated Feature Annotation",
        "Algorithm Pipeline Validation",
        "Scalable Inference Frameworks"
      ]
    },
    {
      badge: "Track 03",
      title: "Incubator Research Fund",
      bio: "Supporting innovative ideas and independent scientific inquiries. Our program offers seed funding, cloud compute resources, and structured academic mentorship channels to accelerate early-stage projects into robust, peer-reviewed realities.",
      items: [
        "Seed Project Grants",
        "Compute Cluster Allocation",
        "Milestone-Driven Fellowships",
        "Academic Publishing Support"
      ]
    }
  ];

  return (
    <Layout title="Programs & Initiatives" description="Explore our active genomics, bioinformatics, and AI research tracks.">
      <main className="container py-xl">

        {/* Standard Hero Section */}
        <header className="hero mb-lg">
          <h1 className="hero-title">Programs & Initiatives</h1>
          <p className="hero-tagline">Advancing scientific frontiers through innovative computational research and grants.</p>
        </header>

        {/* Initiatives Grid */}
        <section className="grid grid-cols-1 gap-lg">
          {initiatives.map((item, idx) => (
            <div key={idx} className="card p-xl">
              <span className="badge">{item.badge}</span>
              <h2 className="card-title text-2xl mb-md">{item.title}</h2>
              <p className="card-body mb-lg">{item.bio}</p>

              {/* Feature List Grid */}
              <ul className="bullet-list">
                {item.items.map((list, i) => (
                  <li key={i} >
                    <span className="text-brand-violet">✓</span> {list}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

      </main>
    </Layout>
  );
}