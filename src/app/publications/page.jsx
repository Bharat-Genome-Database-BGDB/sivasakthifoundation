'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('is_published', true)
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (err) {
      console.error('Error fetching publications:', err.message);
      setErrorMessage('Unable to load scientific publications at this time.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPublications = publications.filter((pub) => {
    const query = searchTerm.toLowerCase();
    const matchesQuery =
      (pub.title?.toLowerCase() || '').includes(query) ||
      (pub.authors?.toLowerCase() || '').includes(query) ||
      (pub.journal_or_venue?.toLowerCase() || '').includes(query) ||
      (pub.doi?.toLowerCase() || '').includes(query) ||
      (pub.tags?.some((t) => t.toLowerCase().includes(query)) ?? false);

    const matchesCategory =
      selectedCategory === 'all' || pub.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <Layout
      title="Scientific Publications & Preprints"
      description="Peer-reviewed studies, preprints, and open genomic data releases from the Sivasakthi Science Foundation."
    >
      <main className="container py-xl">
        {/* Page Hero Header */}
        <header className="hero mb-lg text-center">
          <span className="badge mb-md">Open Science Directory</span>
          <h1 className="hero-title">Scientific Publications & Preprints</h1>
          <p className="card-body margin-auto max-w-700">
            Explore peer-reviewed journal articles, bio-computational preprints, and FAIR data repository protocols published across the foundation network.
          </p>
        </header>

        {/* Search & Category Filter Card */}
        <div className="card catalog-search-wrap mb-lg">
          <div className="admin-grid-taxonomy">
            <div className="form-group">
              <label htmlFor="pub_search" className="admin-form-label">
                Search Publications:
              </label>
              <input
                id="pub_search"
                type="text"
                className="form-group input"
                placeholder="🔍 Search by title, author, journal, or DOI (e.g., 10.3390)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_filter" className="admin-form-label">
                Filter by Type:
              </label>
              <select
                id="category_filter"
                className="form-group input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Formats</option>
                <option value="Journal Article">Peer-Reviewed Journals</option>
                <option value="Preprint">Preprints & Working Papers</option>
                <option value="Conference">Conference Proceedings</option>
                <option value="Book Chapter">Book Chapters</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center catalog-status-msg">
            ⏳ Loading scientific publications from database...
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="catalog-error-box text-center">
            {errorMessage}
          </div>
        )}

        {/* Empty State */}
        {!loading && !errorMessage && filteredPublications.length === 0 && (
          <div className="card catalog-empty-card text-center">
            <h3 className="card-title">No publications found matching your criteria.</h3>
            <p className="card-body">Try clearing your search query or selecting a different publication type.</p>
          </div>
        )}

        {/* Publications Listing Grid */}
        {!loading && filteredPublications.length > 0 && (
          <div className="grid grid-cols-1 gap-lg">
            {filteredPublications.map((pub) => {
              const detailTarget = pub.slug || pub.id;
              return (
                <article key={pub.id} className="card p-xl catalog-card-shell">
                  <div className="catalog-card-header mb-md">
                    <div className="flex gap-sm">
                      <span className="badge">
                        {pub.category || 'Journal Article'}
                      </span>
                      {pub.is_peer_reviewed && (
                        <span className="badge text-brand-violet">
                          Peer-Reviewed
                        </span>
                      )}
                    </div>
                    <span className="timestamp">
                      {new Date(pub.publication_date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 className="card-title mb-sm">
                    <Link href={`/publications/${detailTarget}`} className="header__brand">
                      {pub.title}
                    </Link>
                  </h2>

                  <p className="catalog-sci-name mb-sm">
                    {pub.authors}
                  </p>

                  <p className="catalog-family-meta mb-md">
                    <strong>Venue / Journal:</strong> {pub.journal_or_venue}
                  </p>

                  {pub.abstract && (
                    <p className="card-body mb-md line-clamp-3">
                      {pub.abstract}
                    </p>
                  )}

                  {pub.tags && pub.tags.length > 0 && (
                    <div className="blog-tags-container mb-md">
                      {pub.tags.map((tag, idx) => (
                        <span key={idx} className="badge">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="admin-action-bar mt-auto pt-md">
                    <Link
                      href={`/publications/${detailTarget}`}
                      className="btn-solid"
                    >
                      View Details & Citation →
                    </Link>

                    {pub.doi && (
                      <a
                        href={pub.external_url || `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                      >
                        DOI: {pub.doi} ↗
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </Layout>
  );
}