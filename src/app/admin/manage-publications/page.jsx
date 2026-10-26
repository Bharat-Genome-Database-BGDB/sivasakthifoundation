'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function ManagePublicationsPage() {
  const [doiInput, setDoiInput] = useState('');
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ state: 'idle', message: '' });

  // List of existing saved publications
  const [publications, setPublications] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchSavedPublications();
  }, []);

  const fetchSavedPublications = async () => {
    try {
      setLoadingList(true);
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (err) {
      console.error('Error fetching publications:', err.message);
    } finally {
      setLoadingList(false);
    }
  };

  // Helper to sanitize DOIs
  const cleanDoiString = (raw) => {
    return raw.trim().replace(/^https?:\/\/doi\.org\//i, '').replace(/^doi:\s*/i, '');
  };

  // 1. Fetch metadata directly from the official Crossref Registry
  const handleFetchMetadata = async (e) => {
    if (e) e.preventDefault();

    const doi = cleanDoiString(doiInput);
    if (!doi) {
      setStatusMessage({ state: 'error', message: 'Please enter a valid DOI.' });
      return;
    }

    setIsFetchingMetadata(true);
    setStatusMessage({ state: 'idle', message: '' });
    setPreviewData(null);

    try {
      const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
      
      if (!response.ok) {
        throw new Error(`DOI not found on Crossref (${response.status}). Please check the identifier.`);
      }

      const json = await response.json();
      const item = json.message;

      // Extract title
      const title = Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled Publication');

      // Extract authors
      let authors = 'SSF Research Team';
      if (Array.isArray(item.author) && item.author.length > 0) {
        authors = item.author
          .map((a) => {
            if (a.name) return a.name;
            return [a.given, a.family].filter(Boolean).join(' ');
          })
          .filter(Boolean)
          .join(', ');
      }

      // Extract venue / journal
      let journal = 'Academic Repository';
      if (Array.isArray(item['container-title']) && item['container-title'].length > 0) {
        journal = item['container-title'][0];
      } else if (item.institution && item.institution[0]?.name) {
        journal = item.institution[0].name;
      } else if (item.publisher) {
        journal = item.publisher;
      }

      // Extract publication date / year
      let pubDate = 'Recent';
      if (item.published?.['date-parts']?.[0]) {
        pubDate = item.published['date-parts'][0].join('-');
      } else if (item.created?.['date-parts']?.[0]) {
        pubDate = item.created['date-parts'][0].join('-');
      }

      const extracted = {
        doi,
        title,
        authors,
        journal_or_venue: journal,
        publication_date: pubDate,
        external_url: `https://doi.org/${doi}`,
        is_published: true,
      };

      setPreviewData(extracted);
      setStatusMessage({ state: 'success', message: '✓ Metadata retrieved from official publisher registry!' });
    } catch (err) {
      console.error('Crossref lookup error:', err);
      setStatusMessage({ state: 'error', message: err.message || 'Failed to fetch DOI metadata.' });
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  // 2. Save previewed publication to Supabase
  const handleSavePublication = async () => {
    if (!previewData) return;

    setIsSaving(true);
    setStatusMessage({ state: 'saving', message: 'Saving publication to database...' });

    try {
      const { error } = await supabase
        .from('publications')
        .upsert([previewData], { onConflict: 'doi' });

      if (error) throw error;

      setStatusMessage({ state: 'success', message: `🎉 Successfully saved "${previewData.title}"!` });
      setPreviewData(null);
      setDoiInput('');
      fetchSavedPublications();
    } catch (err) {
      console.error('Save error:', err);
      setStatusMessage({ state: 'error', message: err.message || 'Failed to save to database.' });
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Delete publication
  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSavedPublications();
    } catch (err) {
      console.error('Delete error:', err.message);
      alert('Failed to delete: ' + err.message);
    }
  };

  // 4. Toggle visibility
  const handleTogglePublished = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('publications')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchSavedPublications();
    } catch (err) {
      console.error('Toggle error:', err.message);
    }
  };

  return (
    <Layout
      title="Manage Publications | Admin"
      description="Register and manage scientific publications using persistent DOIs."
    >
      <main className="container py-xl">
        <header className="hero mb-lg">
          <h1 className="hero-title">Scientific Publications Manager</h1>
          <p className="card-body">
            Paste a DOI to auto-fetch title, author roster, journal venue, and year directly from the Crossref index.
          </p>
        </header>

        {/* --- DOI Intake Form --- */}
        <section className="card p-xl mb-lg">
          <h2 className="card-title mb-md">Import Publication via DOI</h2>
          
          <form onSubmit={handleFetchMetadata} className="admin-grid-taxonomy mb-md">
            <div className="form-group">
              <label htmlFor="doi_input" className="admin-form-label">
                Digital Object Identifier (DOI) *
              </label>
              <input
                id="doi_input"
                type="text"
                required
                className="admin-input-text"
                placeholder="e.g. 10.3390/ijms27209188 or https://doi.org/10.3390/ijms27209188"
                value={doiInput}
                onChange={(e) => setDoiInput(e.target.value)}
              />
            </div>

            <div className="admin-action-bar">
              <button
                type="submit"
                disabled={isFetchingMetadata || !doiInput.trim()}
                className="btn-solid"
              >
                {isFetchingMetadata ? 'Fetching Metadata...' : '🔍 Fetch DOI Metadata'}
              </button>
            </div>
          </form>

          {statusMessage.message && (
            <div className={`form-feedback ${statusMessage.state} mb-md`}>
              {statusMessage.message}
            </div>
          )}

          {/* --- Live Auto-Fetched Preview Card --- */}
          {previewData && (
            <div className="card admin-select-card p-xl">
              <span className="badge mb-sm">Official Registry Preview</span>
              <h3 className="card-title mb-sm">{previewData.title}</h3>
              <p className="catalog-sci-name mb-sm"><strong>Authors:</strong> {previewData.authors}</p>
              <p className="catalog-family-meta mb-sm"><strong>Venue:</strong> {previewData.journal_or_venue}</p>
              <p className="timestamp mb-md"><strong>Published / Indexed Date:</strong> {previewData.publication_date}</p>
              
              <div className="admin-action-bar">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSavePublication}
                  className="btn-solid"
                >
                  {isSaving ? 'Saving...' : '💾 Confirm & Save to Catalog'}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewData(null)}
                  className="btn-outline"
                >
                  ✕ Discard Preview
                </button>
              </div>
            </div>
          )}
        </section>

        {/* --- List of Already Saved Publications --- */}
        <section className="card p-xl">
          <div className="catalog-card-header mb-md">
            <h2 className="card-title">Existing Catalog ({publications.length})</h2>
          </div>

          {loadingList ? (
            <div className="catalog-status-msg text-center">Loading publications...</div>
          ) : publications.length === 0 ? (
            <div className="catalog-empty-card text-center">No publications added yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-md">
              {publications.map((pub) => (
                <div key={pub.id} className="card p-md admin-select-card">
                  <div className="catalog-card-header mb-xs">
                    <span className="badge">{pub.journal_or_venue}</span>
                    <span className="timestamp">{pub.publication_date}</span>
                  </div>

                  <h3 className="card-title mb-xs">{pub.title}</h3>
                  <p className="catalog-sci-name mb-sm">{pub.authors}</p>

                  <div className="admin-action-bar">
                    <a
                      href={pub.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline admin-btn-sm"
                    >
                      DOI: {pub.doi} ↗
                    </a>

                    <button
                      type="button"
                      onClick={() => handleTogglePublished(pub.id, pub.is_published)}
                      className="btn-outline admin-btn-sm"
                    >
                      {pub.is_published ? '✓ Public' : 'Hidden'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(pub.id, pub.title)}
                      className="btn-outline admin-btn-sm"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}