'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import Layout from '@/components/Layout/Layout';
import '@styles/main.css';
import '@styles/components/forms.css';
import '@styles/components/cards.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  // Handle Magic Link Email Submission
  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Check if email is in the admin whitelist table
      const { data: adminMatch, error: checkError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (checkError) throw checkError;

      // 2. If email exists in whitelist, request Magic Link from Supabase
      if (adminMatch) {
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            // Redirect back to dashboard upon clicking email link
            emailRedirectTo: `${window.location.origin}/admin/dashboard`
          }
        });

        if (magicLinkError) throw magicLinkError;
      }

      // 3. Display success feedback regardless (prevents email harvesting attacks)
      setEmailSent(true);
      setMessage(`A sign-in link has been sent to ${cleanEmail} if it is registered as an administrator.`);
    } catch (err) {
      console.error('Magic Link Error:', err);
      setIsError(true);
      setMessage('Failed to send sign-in link. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Admin Sign In"
      description="Secure administrative portal access for Sivasakthi Science Foundation."
    >
      <main className="container py-xl">

        <header className="hero mb-lg">
          <h1 className="hero-title">SSF Admin Access</h1>
          <p className="hero-tagline">
            Enter your authorized administrative email address.
          </p>
        </header>

        <section className="card p-xl">
          <h3 className="card-title">Authentication Portal</h3>
          
          <p className="card-body mb-lg">
            {emailSent ? 'Check your mailbox for your secure login link.' : 'Enter your authorized administrative email address.'}
          </p>

          {message && (
            <p className={`form-feedback ${isError ? 'error' : 'success'}`}>
              {message}
            </p>
          )}

          {!emailSent ? (
            <form onSubmit={handleSendMagicLink} className="data-form">
              <div className="form-group">
                <label htmlFor="email">Admin Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@sivasakthifoundation.org"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn" 
              >
                {loading ? 'Verifying access...' : 'Send Sign-In Link ✉️'}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => { setEmailSent(false); setMessage(''); }}
              className="submit-btn"
            >
              ← Try a different email
            </button>
          )}
        </section>
      </main>
    </Layout>
  );
}