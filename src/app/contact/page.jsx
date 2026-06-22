// src/app/contact/page.jsx
'use client'; 

import Layout from "@layout/Layout";
import "@styles/contact.css";

export default function ContactPage() {
  return (
    <Layout title="Contact & Connect" description="Get in touch with Sivasakthi Science Foundation™ for inquiries, volunteering, and institutional partnerships.">
      <main className="contact-container">
        
        <header className="hero-identity-group">
          <h1 className="hero-main-title">Contact & Collaborations</h1>
          <p className="hero-sub-tagline">Connect with our coordination teams for general inquiries, partner operations, or community programs.</p>
        </header>

        <div className="contact-grid">
          
          {/* Left Column: Context Channels */}
          <aside className="contact-info-sidebar">
            <div className="info-card">
              <h3><i className="fas fa-map-marker-alt"></i> Foundation Office</h3>
              <p>
                7, Belhaven Gardens, Kawdiar,<br />
                Thiruvananthapuram, Kerala, India
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong>Email:</strong> info@sivasakthifoundation.org
              </p>
            </div>

            <div className="info-card">
              <h3><i className="fas fa-handshake"></i> Institutional Partnerships</h3>
              <p>
                We welcome joint biological processing requests and deep learning computational project proposals from research groups and universities.
              </p>
            </div>

            <div className="info-card">
              <h3><i className="fas fa-users"></i> Engagement Opportunities</h3>
              <p>Volunteers support our educational track pathways through:</p>
              <ul>
                <li>Science awareness campaigns</li>
                <li>Computational biology training support</li>
                <li>Community data outreach pipelines</li>
              </ul>
            </div>
          </aside>

          {/* Right Column: Interaction Form Block */}
          <section className="contact-form-card">
            <form onSubmit={(e) => e.preventDefault()}>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Your name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="name@domain.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Inquiry Subject</label>
                <input type="text" id="subject" placeholder="General, Partner, or Volunteer" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message Details</label>
                <textarea id="message" rows="5" placeholder="Type your detailed message here..." required></textarea>
              </div>

              <button type="submit" className="form-submit-btn">
                Send Message <i className="fas fa-paper-plane"></i>
              </button>

            </form>
          </section>

        </div>
      </main>
    </Layout>
  );
}