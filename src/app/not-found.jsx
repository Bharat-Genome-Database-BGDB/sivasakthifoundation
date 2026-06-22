// src/app/not-found.jsx
'use client';

import Link from "next/link";
import Layout from "@layout/Layout";

export default function NotFound() {
  return (
    <Layout title="404 - Page Not Found" description="The requested route could not be found.">
      <main style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "100px 24px",
        textAlign: "center",
        fontFamily: "var(--font-sans)"
      }}>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "72px",
          color: "var(--brand-violet)",
          marginBottom: "16px"
        }}>404</h1>
        
        <h2 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "28px",
          color: "var(--ink-primary)",
          marginBottom: "16px"
        }}>Route Not Found</h2>
        
        <p style={{
          fontSize: "16px",
          color: "#4b5563",
          lineHeight: "1.6",
          marginBottom: "32px"
        }}>
          The page you are looking for doesn't exist or has been consolidated into one of our centralized scientific information hubs.
        </p>

        <Link href="/" style={{
          background: "var(--brand-violet)",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          textDecoration: "none",
          display: "inline-block",
          transition: "background 0.2s ease"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "var(--brand-violet-hover)"}
        onMouseOut={(e) => e.currentTarget.style.background = "var(--brand-violet)"}
        >
          Return to Homepage
        </Link>
      </main>
    </Layout>
  );
}