'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function PublicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPublication();
    }
  }, [slug]);

  const fetchPublication = async () => {
    try {
      setLoading(true);

      // Support query by slug or fallback numeric id
      const isNumeric = /^\d+$/.test(slug);
      let query = supabase
        .from('publications')
        .select('*')
        .eq('is_published', true);

      if (isNumeric) {
        query = query.or(`slug.eq.${slug},id.eq.${slug}`);
      } else {
        query = query.eq('slug', slug);
      }

      const { data, error } = await query.single();
      if (error) throw error;
      setPub(data);
    } catch (err) {
      console.error('Error fetching publication record:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCitation = () => {
    if (!pub) return;
    const year = new Date(pub.publication_date).getFullYear();
    const citation = `${pub.authors} (${year}). "${pub.title}." ${pub.journal_or_venue}. https://doi.org/${pub.doi}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <Layout title="Loading Publication Details...">
        <div className="container py-xl text-center catalog-status-msg">
          ⏳ Loading publication metadata...
        </div>
      </Layout>
    );
  }

  if (!pub) {
    return (
      <Layout title="Publication Not Found">
        <main className="container py-xl text-center">
          <div className="card p-xl catalog-empty-card margin-auto max-w-700">
            <h1 className="hero-title mb-md">Publication Not Found</h1>
            <p className="card-body mb-lg">
              The research publication you are looking for does not exist or may have been unlisted.
            </p>
            <button
              type="button"
              onClick={() => router.push('/publications')}
              className="btn-solid"
            >
              ← Back to All Publications
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  const directDoiUrl = pub.external_url || `https://doi.org/${pub.doi}`;

  return (
    <Layout
      title={pub.title}
      description={pub.abstract || `Scientific publication: ${pub.title}`}
    >
      <main className="container py-xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-lg">
          <Link href="/publications" className="btn-outline admin-btn-sm">
            ← Return to Publications Directory
          </Link>
        </div>

        {/* Primary Publication Card */}
        <article className="card p-xl mb-lg">
          <div className="catalog-card-header mb-md">
            <div className="flex gap-sm">
              <span className="badge">
                {pub.category || 'Journal Article'}
              </span>
              {pub.is_peer_reviewed ? (
                <span className="badge text-brand-violet">Peer-Reviewed</span>
              ) : (
                <span className="badge">Preprint Archive</span>
              )}
            </div>
            <span className="timestamp">
              Published on {new Date(pub.publication_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="hero-title mb-md">
            {pub.title}
          </h1>

          <div className="catalog-sci-name mb-lg">
            <strong>Authors:</strong> {pub.authors}
          </div>

          {/* Metadata Block */}
          <div className="card admin-select-card mb-lg">
            <div className="admin-grid-3">
              <div>
                <span className="admin-form-label">Journal / Venue</span>
                <p className="card-body"><strong>{pub.journal_or_venue}</strong></p>
              </div>
              <div>
                <span className="admin-form-label">DOI</span>
                <p className="card-body">{pub.doi}</p>
              </div>
              <div>
                <span className="admin-form-label">Classification</span>
                <p className="card-body">{pub.category}</p>
              </div>
            </div>
          </div>

          {/* Abstract */}
          {pub.abstract && (
            <div className="mb-lg">
              <h3 className="admin-section-title">Abstract</h3>
              <p className="card-body leading-relaxed">
                {pub.abstract}
              </p>
            </div>
          )}

          {/* Tags */}
          {pub.tags && pub.tags.length > 0 && (
            <div className="mb-lg">
              <h3 className="admin-section-title">Keywords & Subject Areas</h3>
              <div className="blog-tags-container">
                {pub.tags.map((tag, idx) => (
                  <span key={idx} className="badge">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="admin-action-bar pt-md">
            <a
              href={directDoiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid"
            >
              Access Full Study via Publisher (DOI) ↗
            </a>

            <button
              type="button"
              onClick={handleCopyCitation}
              className="btn-outline"
            >
              {copied ? '✓ Citation Copied to Clipboard!' : '📋 Copy Citation (APA)'}
            </button>
          </div>
        </article>
      </main>
    </Layout>
  );
}