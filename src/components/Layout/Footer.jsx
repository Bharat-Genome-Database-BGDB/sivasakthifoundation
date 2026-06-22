// src/components/Layout/Footer.jsx
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@db/supabaseClient";
import "@styles/footer.css";

/**
 * @component Footer
 * @description Master multi-column template footer styling utilizing deep plum layouts matching original FAQ specifications.
 */
const Footer = () => {
  const [userRole, setUserRole] = useState("public");
  const [loading, setLoading] = useState(true);

  // --- Auth Role-Based Access Control (RBAC) Listener ---
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setUserRole("public");
          return;
        }

        const { data: roleData, error } = await supabase
          .from("user_role_assignments")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (!error && roleData?.role) {
          setUserRole(roleData.role.toLowerCase());
        }
      } catch (err) {
        // Silently capture for standard public navigation views
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Column 1: Core Branding Block */}
        <div className="footer-brand">
          <strong className="footer-brand-title">Sivasakthi Science Foundation™</strong>
          <address className="footer-address">
            Kowdiar, Thiruvananthapuram,<br />
            Kerala, India
          </address>
          <p className="footer-copyright">
            &copy; {currentYear}. Advancing Research, Training & Education.
          </p>
        </div>

        {/* Column 3: Engagement & Utilities */}
        <div className="footer-links">
          <h4>Engage</h4>
          <Link href="/faq">Frequently Asked Questions</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/privacy">Privacy & Terms</Link>
        </div>

        {/* Dynamic Column 4: Template Access Layer for RBAC states */}
        {!loading && ["admin", "superadmin", "member"].includes(userRole) && (
          <div className="footer-links member-gate-links">
            <h4>Member Area</h4>
            <Link href="/dashboard">Researcher Dashboard</Link>
            <Link href="/internships">Internship Portal</Link>
          </div>
        )}

      </div>
    </footer>
  );
};

export default Footer;