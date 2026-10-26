'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function PublicationsDirectoryPage() {
  const [publications, setPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
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
      setErrorMessage('Unable to load publications at this time.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPublications = publications.filter((pub) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (pub.title?.toLowerCase() || '').includes(query) ||
      (pub.authors?.toLowerCase() || '').includes(query) ||
      (pub.journal_or_venue?.toLowerCase() || '').includes(query) ||
      (pub.doi?.toLowerCase() || '').includes(query) ||
      (pub.tags?.some((t) => t.toLowerCase().includes(query)) ?? false);

    const matchesTag = !selectedTag || (pub.tags && pub.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <Layout
      title="Publications & Preprints"
      description="Scientific papers, journal publications, and preprints from the Sivasakthi Science Foundation."
    >
      <main className="container py-xl">
        <header className="hero mb-lg text-center">
          <span className="badge mb-md">Research Directory</span>
          <h1 className="hero-title">Scientific Publications & Preprints</h1>
          <p className="card-body margin-auto max-w-700">
            Access peer-reviewed articles, genomic discoveries, and preprints authored and supported by the Sivasakthi Science Foundation.
          </p>
        </header>

        <div className="card catalog-search-wrap mb-lg">
          <div className="form-group">
            <label htmlFor="pub_search_bar" className="admin-form-label">
              Search Publications:
            </label>
            <input
              id="pub_search_bar"
              type="text"
              className="admin-input-text"
              placeholder="🔍 Search by study title, author, journal, DOI, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {selectedTag && (
            <div className="admin-action-bar pt-sm">
              <span className="badge">Active Tag Filter: #{selectedTag}</span>
              <button
                type="button"
                onClick={() => setSelectedTag('')}
                className="btn-outline admin-btn-sm"
              >
                ✕ Clear Tag Filter
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="catalog-status-msg text-center">
            ⏳ Loading publications catalog...
          </div>
        )}

        {errorMessage && (
          <div className="catalog-error-box text-center">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && filteredPublications.length === 0 && (
          <div className="card catalog-empty-card text-center">
            <h2 className="card-title">No matching publications found.</h2>
            <p className="card-body">Try clearing your search query or tag filter.</p>
          </div>
        )}

        {!loading && filteredPublications.length > 0 && (
          <div className="grid grid-cols-1 gap-lg">
            {filteredPublications.map((pub) => (
              <article key={pub.id} className="card p-xl catalog-card-shell">
                <div className="catalog-card-header mb-sm">
                  <span className="badge">
                    {pub.journal_or_venue}
                  </span>
                  <span className="timestamp">
                    {pub.publication_date}
                  </span>
                </div>

                <h2 className="card-title mb-sm">
                  {pub.title}
                </h2>

                <p className="catalog-sci-name mb-sm">
                  {pub.authors}
                </p>

                {/* Render Tag Pills */}
                {pub.tags && pub.tags.length > 0 && (
                  <div className="blog-tags-container mb-md">
                    {pub.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className="badge"
                        title={`Filter by #${tag}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="admin-action-bar mt-auto pt-sm">
                  <a
                    href={pub.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-solid"
                  >
                    View Publication (DOI: {pub.doi}) ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}