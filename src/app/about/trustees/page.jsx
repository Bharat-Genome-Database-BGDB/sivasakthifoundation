// src/app/about/trustees/page.jsx
'use client';

import Layout from "@layout/Layout";
import "@styles/main.css";

export default function TrusteesPage() {
  const trustees = [
    {
      name: "Dr. Sabarinath Subramaniam",
      role: "Chairperson",
      initials: "SS",
      bio: "Dr. Sabarinath Subramaniam is a distinguished scientist with over three decades of expertise in the life sciences. As Chairperson of the Board, he provides the strategic foresight necessary to ensure the Sivasakthi Science Foundation remains steadfast in its mission. With a proven history of executive leadership—most notably at Phoenix Bioinformatics, where he directed pioneering research initiatives—Dr. Subramaniam brings a deep commitment to excellence in governance and a visionary approach to advancing scientific innovation."
      // "Dr. Subramaniam is a renowned scientist with over 30 years of experience in life sciences. As Chairperson of the Board, he provides strategic oversight and ensures that the foundation remains true to its mission. Dr. Subramaniam has previously served in leadership roles at Phoenix Bioinformatics, where he spearheaded several groundbreaking research initiatives."
    },
    {
      name: "Dr. Rajkumari Kylas",
      role: "Trustee",
      initials: "RK",
      bio: "Dr. Rajkumari Kylas brings a profound legacy of public health leadership and medical governance to the Sivasakthi Science Foundation. A former anesthesiologist, Dr. Kylas transitioned into high-impact public service, notably serving as the Director of Health Services (DHS) for the State of Kerala and leading the Public Health Laboratory in Trivandrum. Following her distinguished tenure in government, she further advanced clinical infrastructure as the Director of the Blood Bank at the Amrita Institute of Medical Sciences (AIMS), Kochi. As an SSF Trustee, Dr. Kylas leverages her deep domain expertise in public health architecture, laboratory operations, and translational research to steer our strategic initiatives and healthcare collaborations."
      // "Dr. Rajkumari Kylas brings an extraordinary legacy of public health leadership, medical expertise, and institutional governance to the Sivasakthi Science Foundation. She began her distinguished medical career as an anesthesiologist before pivoting into critical frontiers of medical science, including Vaccine Research and Development and leading the Public Health Laboratory in Trivandrum. Her exceptional administrative and clinical acumen ultimately led to her appointment as the Director of Health Services (DHS) for the State of Kerala, from which she retired after years of dedicated public service. Following her retirement from the government sector, Dr. Kylas continued to advance healthcare infrastructure by serving as the Director of the Blood Bank at Amrita Institute of Medical Sciences (AIMS), Kochi. As a Trustee of SSF, her deep domain expertise in public health architectures, laboratory operations, and translational research helps steer the foundation’s open-science initiatives, public health collaborations, and strategic research frameworks."
    },
    {
      name: "Mrs. Sridevi (Srilu) Balla",
      role: "Trustee",
      initials: "SB",
      bio: "Mrs. Sridevi (Srilu) Balla is a seasoned Quality Engineering and Product Management professional with two and a half decades of experience in delivering complex technological solutions. At SSF, Sridevi serves as a Trustee, where she is instrumental in shaping the foundation’s structural delivery, platform roadmap integrity, and technical governance. Her expertise in bridging the gap between rigorous engineering standards and user-centric product strategy ensures that SSF’s technological pipelines are not only robust but scalable, effectively supporting our mission to drive global impact in science and research."
    },
    {
      name: "Mrs. A Ramya Nandhini",
      role: "Trustee",
      initials: "RN",
      bio: "An accomplished entrepreneur and strategic leader, Mrs. Ramya Nandhini brings unparalleled expertise in infrastructure development and institutional governance to the SSF Board of Trustees. Her professional career—marked by years of executive leadership and a mastery of organizational efficiency—is now dedicated to scaling the foundation’s operations. Ms. Nandhini is instrumental in steering SSF’s growth, utilizing her seasoned administrative skills to govern resource allocation, enhance systemic delivery, and catalyze our collaborative potential in the scientific sphere."
      // "Ms. Ramya Nandhini brings an extensive background in strategic business operations, large-scale project execution, and organizational leadership to the Sivasakthi Science Foundation. Beginning her career as an entrepreneur from a young age in Madurai, Tamil Nadu, she initialed her foundational experience working closely within her father's established business in the civil engineering sector. With decades of experience at the helm of an Infrastructure Development Group, Ms. Nandhini specializes in building robust operational structures, managing complex institutional growth, and driving systemic efficiency. As a Trustee of SSF, her seasoned administrative expertise and entrepreneurial vision play a vital role in scaling the foundation’s infrastructure, governing its resource allocations, and expanding its collaborative networks."
    }
  ];

  return (
    <Layout title="Board of Trustees | About" description="...">
      <main className="container"> {/* Using global spacing utility */}

        <header className="hero mb-lg">
          <h1 className="hero-title">Board of Trustees</h1>
          <p className="hero-tagline">The leadership team guiding our scientific direction.</p>
        </header>

        {/* Using the updated 'card' and 'card-horizontal' modifier */}
        <section className="grid grid-cols-1 gap-lg">
          {trustees.map((member, idx) => (
            <div key={idx} className="card card-horizontal">
              {/* Avatar remains distinct */}
              <div className="initials-box">
                {member.initials}
              </div>

              {/* Bio and Info block */}
              <div className="profile-info">
                <h2 className="card-title">{member.name}</h2>
                <div className="card-subtitle">{member.role}</div>
                <p className="card-body">{member.bio}</p>
              </div>
            </div>
          ))}
        </section>

        <footer className="footer-note">
          <p>Our Board of Trustees serves as the cornerstone of the Sivasakthi Science Foundation, driving our mission to cultivate transformative scientific advancement. By leveraging a diverse synthesis of expertise and insight, our trustees foster a dynamic governance framework dedicated to ensuring our initiatives yield a profound, lasting impact on both the scientific community and society at large.

            We are deeply honored by their steadfast leadership and remain committed to charting the future of scientific discovery under their guidance.</p>
        </footer>

      </main>
    </Layout>
  );
}