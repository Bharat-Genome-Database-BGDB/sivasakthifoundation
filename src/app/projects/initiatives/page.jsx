// src/app/projects/initiatives/page.jsx
'use client';
import Layout from "@layout/Layout";
import Link from "next/link";
import "@styles/main.css";

export default function InitiativesPage() {
  const initiatives = [
    {
      badge: "Track 01",
      title: "BioHeritage",
      link: "/blogs/decoding-india-s-biodiversity-safeguarding-our-living-heritage-for-future-generations",
      bio: "Dedicated to the genomic preservation, characterization, and cataloging of native and endemic biodiversity across the Indian subcontinent. Through open-access multi-omics frameworks, automated annotation pipelines, and computational databases, the program safeguards biological heritage to empower evolutionary research and targeted conservation.",
      items: [
        "Biodiversity Genomics",
        "Endemic Species",
        "Evolutionary Multi-Omics",
        "Open Science Databases"
      ]
    },
    {
      badge: "Track 02",
      title: "AarogyaSakthi",
      // No link property for this one, so it renders normally
      bio: "Harnessing translational genomics, microbiome profiling, and artificial intelligence to pioneer precision healthcare and targeted wellness solutions. This initiative focuses on unraveling population-specific disease markers, gut-microbiome dynamics, and preventative health diagnostics tailored to native demographic contexts.",
      items: [
        "Precision Medicine",
        "Microbiome Therapeutics",
        "Translational Omics",
        "Preventative Health AI"
      ]
    },
    {
      badge: "Track 03",
      title: "VidyaSakthi",
      bio: "Democratizing computational life sciences education through hands-on fellowships, specialized Master’s tracks, and open-access scientific resources. The initiative trains the next generation of bioinformaticians, data scientists, and computational biologists through interdisciplinary mentorship and direct research immersion.",
      items: [
        "Bioinformatics Capacity",
        "Research Fellowships",
        "STEM Democratization",
        "Scientific Pedagogy"
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

              {/* Conditionally render the title as a Link if `item.link` exists */}
              <h2 className="card-title">
                {item.link ? (
                  <Link href={item.link} title="Click link to learn more">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h2>

              <p className="card-body">{item.bio}</p>

              {/* Feature List Grid */}
              <ul className="card-list">
                {item.items.map((list, i) => (
                  <li key={i}>
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