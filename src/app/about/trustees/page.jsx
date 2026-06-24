// src/app/about/trustees/page.jsx
'use client';

import Layout from "@layout/Layout";
import "@styles/trustees.css";

export default function TrusteesPage() {
  const trustees = [
    {
      name: "Dr. Sabarinath Subramaniam",
      role: "Chairperson",
      initials: "SS",
      bio: "Dr. Subramaniam is a renowned scientist with over 30 years of experience in life sciences. As Chairperson of the Board, he provides strategic oversight and ensures that the foundation remains true to its mission. Dr. Subramaniam has previously served in leadership roles at Phoenix Bioinformatics, where he spearheaded several groundbreaking research initiatives."
    },
    {
      name: "Dr. Rajkumari Kylas",
      role: "Vice Chairperson",
      initials: "RK",
      bio: "Dr. Kylas is a leading expert in Microbiology, with an extensive background in both academia and industry. As Vice Chairperson, she supports the Chairperson in strategic planning and governance. Dr. Kylas is also a faculty member at a prestigious institution, where she focuses on advancing research in her specific area of expertise."
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
        {/* New Closing Statement Section */}
        <section className="trustees-footer-note">
          <p>
            Our Board of Trustees is committed to advancing the foundation’s mission and ensuring that our
            programs and initiatives have a lasting impact on the scientific community and society.
            Each trustee brings a unique perspective and set of skills, making our board a dynamic and
            effective governing body.
          </p>
          <p>
            We are grateful for their dedication and leadership, and we look forward to continuing our
            journey under their guidance.
          </p>
        </section>

      </main>
    </Layout>
  );
}