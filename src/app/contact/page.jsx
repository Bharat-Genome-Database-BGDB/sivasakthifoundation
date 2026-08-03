'use client';

import { useState } from "react";
import Layout from "@layout/Layout";
import { supabase } from "@db/supabaseClient";
import "@styles/main.css";
import "@styles/components/forms.css";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    try {
      const { error: supabaseError } = await supabase
        .from("contact_submissions")
        .insert([{
          org_slug: "sivasakthifoundation",
          name,
          email,
          subject,
          message,
          form_intent: "contact_page",
          status: "pending"
        }]);

      if (supabaseError) throw new Error(supabaseError.message);

      setFormStatus("success");
      e.target.reset();
    } catch (error) {
      setFormStatus("error");
      setErrorMessage(error.message || "Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <Layout title="Contact & Connect" description="Get in touch with Sivasakthi Science Foundation™.">
      <main className="container py-xl">
        <header className="hero mb-lg">
          <h1 className="hero-title">Contact & Collaborations</h1>
          <p className="hero-tagline">
            Connect with our coordination teams for inquiries, partner operations, or community programs.
          </p>
        </header>

        <section className="contact-grid-layout">
          {/* Left Column: Context Channels */}
          <div className="section-stack">
            <div className="card p-xl contact-sidebar">
              <div className="icon-box"><i className="fas fa-map-marker-alt"></i></div>
              <h3 className="card-title">Foundation Office</h3>
              <p className="card-body">
                7, Belhaven Gardens, Kawdiar,<br />
                Thiruvananthapuram, Kerala, India
              </p>
              <p className="card-body"><strong>Email:</strong> info@sivasakthifoundation.org</p>
            </div>

            <div className="card p-xl contact-sidebar">
              <div className="icon-box"><i className="fas fa-handshake"></i></div>
              <h3 className="card-title">Institutional Partnerships</h3>
              <p className="card-body">
                We welcome joint biological processing requests and deep learning computational project proposals.
              </p>
            </div>

            <div className="card p-xl contact-sidebar">
              <div className="icon-box"><i className="fas fa-users"></i></div>
              <h3 className="card-title">Engagement Opportunities</h3>
              <p className="card-body">Volunteers support our educational track pathways through:</p>
              <ul className="card-list">
                <li>Science awareness campaigns</li>
                <li>Computational biology training support</li>
                <li>Community data outreach pipelines</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interaction Form Block */}
          <section className="card p-xl">
            <h3 className="card-title">Send a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
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

              {formStatus === "success" && (
                <p className="form-feedback success">✓ Thank you! Your message has been sent.</p>
              )}
              {formStatus === "error" && (
                <p className="form-feedback error">⚠ Error: {errorMessage}</p>
              )}

              <button type="submit" className="submit-btn" disabled={formStatus === "submitting"}>
                {formStatus === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>
        </section>
      </main>
    </Layout>
  );
}