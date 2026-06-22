// src/app/about/trustees/page.jsx
'use client';

import Layout from "@layout/Layout";
import "@styles/trustees.css";

export default function TrusteesPage() {
  const trustees = [
    {
      name: "Dr. Sabarinath Subramaniam",
      role: "Managing Trustee",
      initials: "SS",
      bio: "Dr. Sabarinath Subramaniam is a scientist specializing in Genomics, Bioinformatics, and Data Analytics. He holds a Ph.D. in Bioinformatics. With over 15 years of research experience, he is passionate about integrating genomics data with Deep Learning models to extract meaningful insights."
    },
    {
      name: "Mrs. Sridevi Balla",
      role: "Trustee",
      initials: "SB",
      bio: "Mrs. Sridevi Balla is an IT professional with over 20 years of experience specializing in Quality Engineering and Product Management. She handles governance, structural delivery metrics, and platform roadmap integrity for the foundation's technological pipelines."
    }
  ];

  return (
    <Layout title="Board of Trustees | About" description="Meet the leadership guiding the Sivasakthi Science Foundation™ infrastructure.">
      <main className="trustees-container">
        
        <header className="trustees-hero hero-identity-group">
          <h1 className="hero-main-title">Board of Trustees</h1>
          <p className="hero-sub-tagline">The leadership team guiding our scientific direction and organizational governance.</p>
        </header>

        <section className="trustees-grid">
          {trustees.map((member, idx) => (
            <div key={idx} className="profile-card">
              
              {/* Initial-based placeholder avatar */}
              <div className="profile-avatar-fallback">
                {member.initials}
              </div>

              <div className="profile-info">
                <h2>{member.name}</h2>
                <div className="profile-role">{member.role}</div>
                <p className="profile-bio">{member.bio}</p>
              </div>

            </div>
          ))}
        </section>

      </main>
    </Layout>
  );
}