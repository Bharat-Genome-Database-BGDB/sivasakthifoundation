'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

// Keyword rules for automatic tag inference
const TAG_RULES = [
  { test: /genom|assembly|sequenc|synten/i, tag: 'Genomics' },
  { test: /microbio|gut|metagenom|16s/i, tag: 'Metagenomics' },
  { test: /antimicrobial|amr|resist/i, tag: 'AMR' },
  { test: /deep learning|machine learning|transformer|neural|ai/i, tag: 'AI & Computational Biology' },
  { test: /plant|ficus|flora|botan/i, tag: 'Plant Biology' },
  { test: /pathogen|infect|host/i, tag: 'Infectious Disease' },
  { test: /fair|repository|database|data standard|open access/i, tag: 'Open Science' },
  { test: /splice|annotation|pipeline/i, tag: 'Bioinformatics' },
];

export default function ManagePublicationsPage() {
  const [doiInput, setDoiInput] = useState('');
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [tagsInput, setTagsInput] = useState('');
  const [statusMessage, setStatusMessage] = useState({ state: 'idle', message: '' });

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

  const cleanDoiString = (raw) => {
    return raw.trim().replace(/^https?:\/\/doi\.org\//i, '').replace(/^doi:\s*/i, '');
  };

  const extractTags = (title, venue, crossrefSubjects = []) => {
    const combinedText = `${title} ${venue} ${crossrefSubjects.join(' ')}`;
    const matchedTags = new Set();

    TAG_RULES.forEach((rule) => {
      if (rule.test.test(combinedText)) {
        matchedTags.add(rule.tag);
      }
    });

    // Ensure at least two standard tags exist
    if (matchedTags.size === 0) {
      matchedTags.add('Research');
      matchedTags.add('Open Science');
    }

    return Array.from(matchedTags);
  };

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
        throw new Error(`DOI not found on Crossref (${response.status}).`);
      }

      const json = await response.json();
      const item = json.message;

      const title = Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled Publication');

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

      let journal = 'Academic Repository';
      if (Array.isArray(item['container-title']) && item['container-title'].length > 0) {
        journal = item['container-title'][0];
      } else if (item.institution && item.institution[0]?.name) {
        journal = item.institution[0].name;
      } else if (item.publisher) {
        journal = item.publisher;
      }

      let pubDate = 'Recent';
      if (item.published?.['date-parts']?.[0]) {
        pubDate = item.published['date-parts'][0].join('-');
      } else if (item.created?.['date-parts']?.[0]) {
        pubDate = item.created['date-parts'][0].join('-');
      }

      // Automatically infer tags
      const autoTags = extractTags(title, journal, item.subject || []);

      const extracted = {
        doi,
        title,
        authors,
        journal_or_venue: journal,
        publication_date: pubDate,
        external_url: `https://doi.org/${doi}`,
        tags: autoTags,
        is_published: true,
      };

      setPreviewData(extracted);
      setTagsInput(autoTags.join(', '));
      setStatusMessage({ state: 'success', message: '✓ Metadata and suggested tags retrieved!' });
    } catch (err) {
      console.error('Crossref lookup error:', err);
      setStatusMessage({ state: 'error', message: err.message || 'Failed to fetch DOI metadata.' });
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleSavePublication = async () => {
    if (!previewData) return;

    setIsSaving(true);
    setStatusMessage({ state: 'saving', message: 'Saving publication to database...' });

    try {
      const finalTags = tagsInput
        ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
        : previewData.tags;

      const payload = {
        ...previewData,
        tags: finalTags,
      };

      const { error } = await supabase
        .from('publications')
        .upsert([payload], { onConflict: 'doi' });

      if (error) throw error;

      setStatusMessage({ state: 'success', message: `🎉 Successfully saved "${previewData.title}"!` });
      setPreviewData(null);
      setDoiInput('');
      setTagsInput('');
      fetchSavedPublications();
    } catch (err) {
      console.error('Save error:', err);
      setStatusMessage({ state: 'error', message: err.message || 'Failed to save to database.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;

    try {
      const { error } = await supabase.from('publications').delete().eq('id', id);
      if (error) throw error;
      fetchSavedPublications();
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

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
      description="Register and manage scientific publications with automated tag inference."
    >
      <main className="container py-xl">
        <header className="hero mb-lg">
          <h1 className="hero-title">Scientific Publications Manager</h1>
          <p className="card-body">
            Paste a DOI to auto-fetch official metadata and generate subject tags.
          </p>
        </header>

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
                placeholder="e.g. 10.3390/ijms27209188"
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
                {isFetchingMetadata ? 'Fetching Metadata...' : '🔍 Fetch Metadata & Tags'}
              </button>
            </div>
          </form>

          {statusMessage.message && (
            <div className={`form-feedback ${statusMessage.state} mb-md`}>
              {statusMessage.message}
            </div>
          )}

          {previewData && (
            <div className="card admin-select-card p-xl">
              <span className="badge mb-sm">Official Registry Preview</span>
              <h3 className="card-title mb-sm">{previewData.title}</h3>
              <p className="catalog-sci-name mb-sm"><strong>Authors:</strong> {previewData.authors}</p>
              <p className="catalog-family-meta mb-sm"><strong>Venue:</strong> {previewData.journal_or_venue}</p>
              <p className="timestamp mb-md"><strong>Published Date:</strong> {previewData.publication_date}</p>

              {/* Editable Tags Field */}
              <div className="form-group mb-md">
                <label htmlFor="tags_editor" className="admin-form-label">
                  Publication Tags (Auto-generated, comma separated):
                </label>
                <input
                  id="tags_editor"
                  type="text"
                  className="admin-input-text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Genomics, Metagenomics, Plant Biology"
                />
              </div>

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

                  {pub.tags && pub.tags.length > 0 && (
                    <div className="blog-tags-container mb-sm">
                      {pub.tags.map((t, idx) => (
                        <span key={idx} className="badge">#{t}</span>
                      ))}
                    </div>
                  )}

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