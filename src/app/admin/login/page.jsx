'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient'; // Adjust path as needed

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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-sans, sans-serif)' }}>
      <div style={{ maxWidth: '420px', width: '100%', padding: '32px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>
          SSF Admin Access
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
          {emailSent ? 'Check your mailbox for your secure login link.' : 'Enter your authorized administrative email address.'}
        </p>

        {message && (
          <div style={{ padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', background: isError ? '#fef2f2' : '#f0fdf4', color: isError ? '#991b1b' : '#166534', border: `1px solid ${isError ? '#fca5a5' : '#bbf7d0'}`, lineHeight: '1.4' }}>
            {message}
          </div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSendMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', uppercase: 'true' }}>
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sivasakthifoundation.org"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Verifying access...' : 'Send Sign-In Link ✉️'}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => { setEmailSent(false); setMessage(''); }}
            style={{ width: '100%', padding: '10px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            ← Try a different email
          </button>
        )}
      </div>
    </div>
  );
}