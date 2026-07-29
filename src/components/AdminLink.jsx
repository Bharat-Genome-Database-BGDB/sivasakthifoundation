'use client';

export default function AdminLink() {
  const DASHBOARD_URL = 'https://sivasakthifoundation.org/admin/dashboard'; // Unified Admin Dashboard URL

  return (
    <a
      href={DASHBOARD_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Access Ecosystem Admin Dashboard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: '#94a3b8', // Muted slate gray
        fontSize: '12px',
        textDecoration: 'none',
        opacity: 0.6,
        transition: 'opacity 0.2s ease, color 0.2s ease',
        cursor: 'pointer',
        marginLeft: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.color = '#38bdf8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.6';
        e.currentTarget.style.color = '#94a3b8';
      }}
    >
      <span style={{ fontSize: '11px' }}>🔒</span>
      <span>Staff Portal</span>
    </a>
  );
}