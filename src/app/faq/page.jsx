// src/app/faq/page.jsx
'use client';
import Layout from "@layout/Layout";
import "@styles/main.css";

export default function FaqPage() {

  const faqData = [
    {
      q: "What is Sivasakthi Science Foundation?",
      a: "Sivasakthi Science Foundation is a public charitable trust dedicated to advancing education, research, and scientific innovation. The foundation works across disciplines to encourage knowledge creation, support meaningful learning, and connect academic ideas with practical, real-world impact."
    },
    {
      q: "How does the foundation operate?",
      a: "The foundation operates through research initiatives, educational programs, collaborative projects, and public outreach activities. By bringing together students, educators, researchers, and professionals, we create opportunities for learning, discovery, and applied scientific engagement that benefit both individuals and communities."
    },
    {
      q: "What are the foundation’s major focus areas?",
      a: "Our focus areas include scientific research, student development, innovation-driven learning, and interdisciplinary work in emerging fields such as genomics, artificial intelligence, and deep learning. We also support initiatives that strengthen science education and expand access to knowledge, training, and research opportunities."
    },
    {
      q: "How does Sivasakthi Science Foundation support students?",
      a: "The foundation supports students by encouraging scientific curiosity, strengthening academic and practical skills, and promoting research-oriented thinking. Through mentorship, learning resources, workshops, and project-based opportunities, we help students build confidence and prepare for future pathways in science, technology, and innovation."
    },
    {
      q: "How can I get involved with the foundation?",
      a: "There are several ways to get involved, including volunteering, participating in outreach efforts, collaborating on projects, supporting institutional initiatives, or engaging with our educational programs. We welcome individuals and organizations who share our commitment to science, learning, and long-term social impact."
    },
    {
      q: "What kinds of volunteer opportunities does the foundation offer?",
      a: "Volunteer opportunities may include assisting with science awareness campaigns, educational workshops, student engagement programs, community outreach activities, and project support. Volunteers play an important role in helping the foundation extend its reach and deliver meaningful scientific and educational value to a wider audience."
    }
  ];

  return (
    <Layout title="FAQ" description="Frequently Asked Questions">
      <main className="container py-xl">
        <header className="hero mb-lg">
          <h1 className="hero-title">Frequently Asked Questions</h1>
          <p className="hero-tagline">Learn more about our mission and focus areas.</p>
        </header>

        {/* Clean, static grid of cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {faqData.map((item, idx) => (
            <div key={idx} className="card faq-card p-xl">
              <h3 className="card-title text-xl">{item.q}</h3>
              <p className="card-body text-ink-secondary">{item.a}</p>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
}