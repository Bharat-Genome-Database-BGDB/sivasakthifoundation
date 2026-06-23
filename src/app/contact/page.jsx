//src/app/contact/page.jsx
'use client';

import { useState } from "react";
import Layout from "@layout/Layout";
import { supabase } from "@/services/supabaseClient"; // Imports our database bridge
import "@styles/contact.css";

export default function ContactPage() {
  // Submission UI States
  const [formStatus, setFormStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    // 1. Gather the exact 4 fields supported by both Web3Forms and our DB
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // 📦 Pack exactly what Web3Forms expects using standard FormData encoding
    const web3FormData = new FormData();
    web3FormData.append("access_key", "397ff88e-3f30-4e1e-9db1-a330f565b886");
    web3FormData.append("name", name);
    web3FormData.append("email", email);
    web3FormData.append("subject", subject);
    web3FormData.append("message", message);

    try {
      // 🚀 THE PARALLEL PIPELINE: Send identical data fields to both targets
      const [web3Response, supabaseResult] = await Promise.all([
        
        // Target A: Web3Forms Email Dispatch
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: web3FormData
        }),

        // Target B: Supabase Dashboard Registry
        supabase
          .from("contact_submissions")
          .insert([
            {
              org_slug: "sivasakthifoundation",
              name: name,
              email: email,
              subject: subject,
              message: message
            }
          ])
      ]);

      // 2. Validate Web3Forms Response
      const web3Data = await web3Response.json();
      if (!web3Response.ok || web3Data.success === false) {
        throw new Error(web3Data.message || "Web3Forms email relay failed.");
      }

      // 3. Validate Supabase Response
      if (supabaseResult.error) {
        throw new Error(supabaseResult.error.message);
      }

      // Clearout and Success milestone!
      setFormStatus("success");
      e.target.reset();

    } catch (error) {
      console.error("Submission Error:", error);
      setFormStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

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
            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="name@domain.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Inquiry Subject</label>
                <input type="text" id="subject" name="subject" placeholder="General, Partner, or Volunteer" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message Details</label>
                <textarea id="message" name="message" rows="5" placeholder="Type your detailed message here..." required></textarea>
              </div>

              {/* Status Message Alerts */}
              {formStatus === "success" && (
                <p className="success-banner" style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>
                  ✓ Thank you! Your message has been sent successfully and logged in our system.
                </p>
              )}

              {formStatus === "error" && (
                <p className="error-banner" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>
                  ⚠ Submission Error: {errorMessage}
                </p>
              )}

              <button
                type="submit"
                className="form-submit-btn"
                disabled={formStatus === "submitting"}
                style={{ opacity: formStatus === "submitting" ? 0.6 : 1 }}
              >
                {formStatus === "submitting" ? (
                  <>Sending Message... <i className="fas fa-spinner fa-spin"></i></>
                ) : (
                  <>Send Message <i className="fas fa-paper-plane"></i></>
                )}
              </button>

            </form>
          </section>

        </div>
      </main>
    </Layout>
  );
}