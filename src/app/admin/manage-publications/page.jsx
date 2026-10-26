'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

const INITIAL_PUB_STATE = {
  id: null,
  title: '',
  authors: '',
  journal_or_venue: '',
  publication_date: new Date().toISOString().split('T')[0],
  doi: '',
  external_url: '',
  abstract: '',
  category: 'Journal Article',
  is_peer_reviewed: true,
  is_published: true,
  tagsInput: '',
};

export default function ManagePublicationsPage() {
  const router = useRouter();

  // Combobox & Existing Publications State
  const [pubList, setPubList] = useState([]);
  const [comboboxSearchText, setComboboxSearchText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Form & Status State
  const [formData, setFormData] = useState(INITIAL_PUB_STATE);
  const [loading, setLoading] = useState(false);
  const [globalStatus, setGlobalStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    fetchPublicationsDropdown();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPublicationsDropdown = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('id, title, doi')
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setPubList(data || []);
    } catch (err) {
      console.error('Error fetching publication list:', err.message);
    }
  };

  const filteredPublications = pubList.filter((item) => {
    const query = comboboxSearchText.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const doiMatch = item.doi?.toLowerCase().includes(query);
    return titleMatch || doiMatch;
  });

  const handleSelectPubFromMenu = (pub) => {
    setComboboxSearchText(pub.title);
    setIsDropdownOpen(false);
    loadPublicationData(pub.id);
  };

  const loadPublicationData = async (id) => {
    setGlobalStatus({ state: 'idle', message: '' });

    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          id: data.id,
          title: data.title || '',
          authors: data.authors || '',
          journal_or_venue: data.journal_or_venue || '',
          publication_date: data.publication_date || '',
          doi: data.doi || '',
          external_url: data.external_url || '',
          abstract: data.abstract || '',
          category: data.category || 'Journal Article',
          is_peer_reviewed: data.is_peer_reviewed ?? true,
          is_published: data.is_published ?? true,
          tagsInput: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        });
      }
    } catch (err) {
      console.error('Error fetching publication details:', err.message);
      setGlobalStatus({ state: 'error', message: 'Failed to load publication details.' });
    }
  };

  const handleResetForm = () => {
    setComboboxSearchText('');
    setFormData(INITIAL_PUB_STATE);
    setGlobalStatus({ state: 'idle', message: 'Form cleared. Ready to add a new publication.' });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [id]: type === 'checkbox' ? checked : value };

      // Auto-populate direct URL when raw DOI is pasted
      if (id === 'doi' && value.trim()) {
        const cleanDoi = value.trim().replace(/^https?:\/\/doi\.org\//i, '');
        if (!prev.external_url || prev.external_url.includes('doi.org')) {
          updated.external_url = `https://doi.org/${cleanDoi}`;
        }
      }

      // Automatically uncheck peer review when preprint is chosen
      if (id === 'category') {
        if (value === 'Preprint') {
          updated.is_peer_reviewed = false;
        } else if (value === 'Journal Article') {
          updated.is_peer_reviewed = true;
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalStatus({ state: 'saving', message: 'Saving publication record...' });

    try {
      const tagsArray = formData.tagsInput
        ? formData.tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      const cleanDoi = formData.doi.trim().replace(/^https?:\/\/doi\.org\//i, '');
      const externalUrl = formData.external_url.trim() || `https://doi.org/${cleanDoi}`;

      const payload = {
        title: formData.title,
        authors: formData.authors,
        journal_or_venue: formData.journal_or_venue,
        publication_date: formData.publication_date,
        doi: cleanDoi,
        external_url: externalUrl,
        abstract: formData.abstract,
        category: formData.category,
        is_peer_reviewed: formData.is_peer_reviewed,
        is_published: formData.is_published,
        tags: tagsArray,
      };

      if (formData.id) {
        const { error: updateError } = await supabase
          .from('publications')
          .update(payload)
          .eq('id', formData.id);

        if (updateError) throw updateError;
        setGlobalStatus({ state: 'success', message: `🎉 Successfully updated "${formData.title}"!` });
      } else {
        const { data, error: insertError } = await supabase
          .from('publications')
          .insert([payload])
          .select();

        if (insertError) throw insertError;
        setGlobalStatus({ state: 'success', message: '🎉 Publication record saved successfully!' });

        if (data && data[0]) {
          setFormData((prev) => ({ ...prev, id: data[0].id }));
          setComboboxSearchText(data[0].title);
        }
      }

      fetchPublicationsDropdown();
    } catch (err) {
      console.error('Publication save error:', err);
      setGlobalStatus({ state: 'error', message: err.message || 'Failed to save publication.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={formData.id ? 'Edit Publication | Admin Portal' : 'Add Publication | Admin Portal'}
      description="Register, catalog, and manage official scientific papers and preprints."
    >
      <main className="container py-xl">
        <header className="hero mb-lg">
          <h4 className="card-title">Manage Scientific Publications</h4>
        </header>

        {/* Searchable Combobox Selector */}
        <div className="card admin-select-card">
          <label htmlFor="pub_combobox_input" className="admin-select-label">
            Search or Select Existing Publication to Edit:
          </label>

          <div className="admin-combobox-wrap" ref={dropdownRef}>
            <div className="admin-combobox-input-group">
              <input
                id="pub_combobox_input"
                type="text"
                className="admin-combobox-input"
                placeholder="🔍 Click arrow on right or type to search papers by title or DOI..."
                value={comboboxSearchText}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setComboboxSearchText(e.target.value);
                  setIsDropdownOpen(true);
                }}
              />
              <span
                className="admin-combobox-arrow"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                ▼
              </span>

              {comboboxSearchText && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="admin-combobox-clear"
                  title="Clear selection to create a new publication entry"
                >
                  ✕ Clear / New
                </button>
              )}
            </div>

            {isDropdownOpen && (
              <ul className="admin-combobox-dropdown">
                {filteredPublications.length > 0 ? (
                  filteredPublications.map((item) => (
                    <li
                      key={item.id}
                      className="admin-combobox-item"
                      onClick={() => handleSelectPubFromMenu(item)}
                    >
                      <span className="admin-combobox-item-name">{item.title}</span>
                      <span className="admin-combobox-item-sci">{item.doi}</span>
                    </li>
                  ))
                ) : (
                  <li className="admin-combobox-no-results">
                    No matching publications found. (Drafting a new entry below)
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="card admin-form-card">
          {/* SECTION 1: CITATION IDENTIFICATION */}
          <div>
            <h3 className="admin-section-title">
              1. Title & Authorship
            </h3>

            <div className="form-group">
              <label htmlFor="title" className="admin-form-label">Full Publication Title *</label>
              <input
                id="title"
                type="text"
                required
                className="admin-input-text"
                placeholder="e.g., Comparative analysis of whole genomes reveals..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="authors" className="admin-form-label">Authors List * (Full Names, comma separated)</label>
              <input
                id="authors"
                type="text"
                required
                className="admin-input-text"
                placeholder="e.g., A. Sharma, R. Kumar, J. Doe"
                value={formData.authors}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 2: VENUE & IDENTIFIERS */}
          <div>
            <h3 className="admin-section-title">
              2. Journal / Venue & Persistent Identifiers
            </h3>

            <div className="admin-grid-3">
              <div className="form-group">
                <label htmlFor="journal_or_venue" className="admin-form-label">Journal / Archive *</label>
                <input
                  id="journal_or_venue"
                  type="text"
                  required
                  className="admin-input-text"
                  placeholder="e.g., International Journal of Molecular Sciences, bioRxiv"
                  value={formData.journal_or_venue}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="admin-form-label">Publication Classification</label>
                <select
                  id="category"
                  className="admin-input-text"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Journal Article">Peer-Reviewed Journal Article</option>
                  <option value="Preprint">Preprint (bioRxiv / OSF / arXiv)</option>
                  <option value="Conference">Conference Proceeding</option>
                  <option value="Book Chapter">Book Chapter</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="publication_date" className="admin-form-label">Publication Date *</label>
                <input
                  id="publication_date"
                  type="date"
                  required
                  className="admin-input-text"
                  value={formData.publication_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-grid-taxonomy">
              <div className="form-group">
                <label htmlFor="doi" className="admin-form-label">Digital Object Identifier (DOI) *</label>
                <input
                  id="doi"
                  type="text"
                  required
                  className="admin-input-text"
                  placeholder="e.g., 10.3390/ijms27209188"
                  value={formData.doi}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="external_url" className="admin-form-label">Direct Link (Auto-derived from DOI or custom URL)</label>
                <input
                  id="external_url"
                  type="url"
                  className="admin-input-text"
                  placeholder="https://doi.org/10.3390/ijms27209188"
                  value={formData.external_url}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ABSTRACT & TOPICS */}
          <div>
            <h3 className="admin-section-title">
              3. Abstract & Topics
            </h3>

            <div className="form-group">
              <label htmlFor="tagsInput" className="admin-form-label">Keywords / Tags (Comma separated)</label>
              <input
                id="tagsInput"
                type="text"
                className="admin-input-text"
                placeholder="Genomics, Metagenomics, Computational Biology, Oncology"
                value={formData.tagsInput}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="abstract" className="admin-form-label">Abstract / Summary</label>
              <textarea
                id="abstract"
                rows="6"
                className="admin-input-text"
                placeholder="Paste the official abstract here..."
                value={formData.abstract}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 4: TOGGLES */}
          <div className="admin-checkbox-group">
            <label className="admin-checkbox-label">
              <input
                id="is_peer_reviewed"
                type="checkbox"
                checked={formData.is_peer_reviewed}
                onChange={handleChange}
              />
              <span>Mark as Peer-Reviewed Research</span>
            </label>
          </div>

          <div className="admin-checkbox-group">
            <label className="admin-checkbox-label">
              <input
                id="is_published"
                type="checkbox"
                checked={formData.is_published}
                onChange={handleChange}
              />
              <span>Display on Public Publications Directory</span>
            </label>
          </div>

          {/* ACTION BUTTONS & FEEDBACK */}
          <div className="admin-action-bar">
            <button
              type="submit"
              disabled={loading}
              className="btn-solid admin-btn-lg"
            >
              {loading ? 'Saving...' : formData.id ? 'Update Publication 🚀' : 'Add Publication 🚀'}
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="btn-outline admin-btn-cancel"
            >
              Clear / New Publication
            </button>
          </div>

          {globalStatus.message && (
            <div className={`form-feedback ${globalStatus.state}`}>
              {globalStatus.message}
            </div>
          )}
        </form>
      </main>
    </Layout>
  );
}