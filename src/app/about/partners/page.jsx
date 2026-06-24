'use client';

import Layout from "@layout/Layout";
import "@styles/partners.css";

export default function PartnersPage() {
  const partners = [
    { name: "UC Berkeley", desc: "World-leading research university fostering innovation, computational sciences, and global impact.", link: "https://www.berkeley.edu", logo: "/images/partnerships/UCB.png" },
    { name: "University of Arizona", desc: "Pioneering research and education in life sciences, genomics, and technology.", link: "https://www.arizona.edu", logo: "/images/partnerships/UA.png" },
    { name: "Cornell University", desc: "Ivy League institution advancing knowledge, agricultural sciences, and societal progress.", link: "https://www.cornell.edu", logo: "/images/partnerships/cornell.png" },
    { name: "Washington State University", desc: "Driving innovation and interdisciplinary research for a more sustainable tomorrow.", link: "https://www.wsu.edu", logo: "/images/partnerships/WSU.png" },
    { name: "CyVerse", desc: "Empowering global life science research with advanced, scalable cyberinfrastructure.", link: "https://www.cyverse.org", logo: "/images/partnerships/cyverse.png" },
    { name: "McGill University", desc: "A global leader in research, teaching, and pioneering bioinformatics innovation.", link: "https://www.mcgill.ca", logo: "/images/partnerships/mcgill.png" },
    { name: "Ramakrishna Mission Hospital", desc: "Delivering compassionate healthcare, medical research, and community service.", link: "https://rkmshospitalvrindavan.rkmm.org/", logo: "/images/partnerships/rk.jpeg" },
    { name: "VIT", desc: "Excellence in technical education, engineering, and research innovation.", link: "https://vit.ac.in/", logo: "/images/partnerships/vit.png" },
    { name: "Amrita University", desc: "Advancing biotechnology, deep learning, and interdisciplinary scientific research.", link: "https://www.amrita.edu/school/biotechnology/", logo: "/images/partnerships/AmUni.png" }
  ];

  return (
    <Layout title="Partners & Collaborators | About" description="Our global network of leading universities and research institutions.">
      <main className="partners-container">

        <header className="partners-hero hero-identity-group">
          <h1 className="hero-main-title">Partners & <em>Collaborators</em></h1>
          <p className="hero-sub-tagline">Building strong alliances for impactful science. We believe in the power of collaboration to advance global research, training, and education.</p>
        </header>

        <section className="partners-grid">
          {partners.map((partner, idx) => (
            <div key={idx} className="partner-card">
              <div className="partner-logo-wrap">
                <img src={partner.logo} alt={partner.name} />
              </div>
              <h3>{partner.name}</h3>
              <p>{partner.desc}</p>
              {/* Updated to a distinct button element */}
              <a href={partner.link} target="_blank" rel="noopener noreferrer" className="btn-solid">
                Visit Website
              </a>
            </div>
          ))}

          
        </section>

        <div className="cta-box">
          <h2>Let's Collaborate</h2>
          <p>Are you an institution or researcher interested in partnering with us?</p>
          <a href="mailto:partnerships@sivasakthifoundation.org" className="btn-cta">Contact Partnerships Team</a>
        </div>
      </main>
    </Layout>
  );
}