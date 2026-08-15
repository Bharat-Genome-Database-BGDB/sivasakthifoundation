'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';
import '@styles/pages/admin.css';
import 'react-quill-new/dist/quill.snow.css';

const INITIAL_BLOG_STATE = {
  id: null,
  title: '',
  slug: '',
  subtitle: '',
  content: '',
  author: 'SSF Editorial Team',
  media_type: 'image',
  media_url: '',
  tagsInput: '',
  is_published: true,
};

export default function ManageBlogPage() {
  const router = useRouter();
  
  // Combobox & Existing Blogs State
  const [blogList, setBlogList] = useState([]);
  const [comboboxSearchText, setComboboxSearchText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Form & Status State
  const [formData, setFormData] = useState(INITIAL_BLOG_STATE);
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalStatus, setGlobalStatus] = useState({ state: 'idle', message: '' });

  // Dynamically load ReactQuill to prevent SSR hydration mismatches
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill-new'), { ssr: false }),
    []
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  useEffect(() => {
    fetchBlogDropdown();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBlogDropdown = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogList(data || []);
    } catch (err) {
      console.error('Error fetching blog list:', err.message);
    }
  };

  // Filter blog list dynamically as user types
  const filteredBlogs = blogList.filter((item) =>
    item.title.toLowerCase().includes(comboboxSearchText.toLowerCase())
  );

  const handleSelectBlogFromMenu = (blog) => {
    setComboboxSearchText(blog.title);
    setIsDropdownOpen(false);
    loadBlogData(blog.id);
  };

  const loadBlogData = async (id) => {
    setGlobalStatus({ state: 'idle', message: '' });

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          id: data.id,
          title: data.title || '',
          slug: data.slug || '',
          subtitle: data.subtitle || '',
          content: data.content || '',
          author: data.author || 'SSF Editorial Team',
          media_type: data.media_type || 'image',
          media_url: data.media_url || '',
          tagsInput: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          is_published: data.is_published ?? true,
        });
      }
    } catch (err) {
      console.error('Error fetching blog details:', err.message);
      setGlobalStatus({ state: 'error', message: 'Failed to load blog post details.' });
    }
  };

  const handleResetForm = () => {
    setComboboxSearchText('');
    setFormData(INITIAL_BLOG_STATE);
    setMediaFile(null);
    setGlobalStatus({ state: 'idle', message: 'Form cleared. Ready to draft new post.' });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [id]: type === 'checkbox' ? checked : value };

      if (id === 'title' && !prev.id) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalStatus({ state: 'saving', message: 'Saving blog post...' });

    try {
      let mediaUrl = formData.media_url;

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-media')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('blog-media')
          .getPublicUrl(fileName);

        mediaUrl = publicData.publicUrl;
      }

      const tagsArray = formData.tagsInput
        ? formData.tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title,
        slug: formData.slug,
        subtitle: formData.subtitle,
        content: formData.content,
        author: formData.author,
        media_type: formData.media_type,
        media_url: mediaUrl,
        tags: tagsArray,
        is_published: formData.is_published,
        updated_at: new Date().toISOString(),
      };

      if (formData.id) {
        const { error: updateError } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', formData.id);

        if (updateError) throw updateError;
        setGlobalStatus({ state: 'success', message: `🎉 Successfully updated "${formData.title}"!` });
      } else {
        const { data, error: insertError } = await supabase
          .from('blogs')
          .insert([payload])
          .select();

        if (insertError) throw insertError;
        setGlobalStatus({ state: 'success', message: '🎉 Blog post successfully published!' });

        if (data && data[0]) {
          setFormData((prev) => ({ ...prev, id: data[0].id }));
          setComboboxSearchText(data[0].title);
        }
      }

      fetchBlogDropdown();
      setTimeout(() => {
        setGlobalStatus({ state: 'idle', message: '' });
      }, 3000);

    } catch (err) {
      console.error(err);
      setGlobalStatus({ state: 'error', message: err.message || 'Failed to save blog post.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={formData.id ? 'Edit Blog | Admin Portal' : 'Create Blog | Admin Portal'}
      description="Publish and manage official research articles, announcements, and network updates."
    >
      <div className="container section-stack">
        
        {/* Page Header Section (Catalog Model Style) */}
        <div className="hero-section text-center">
          <div className="admin-header-actions" style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="btn-outline admin-btn-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
          <h1 className="hero-title">
            {formData.id ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="card-body margin-auto max-w-700">
            Draft and distribute official research articles, multi-omics discoveries, and institutional announcements across the Sivasakthi Science Foundation ecosystem.
          </p>
        </div>

        {/* Search & Sort Filter Card (Catalog Model Style) */}
        <div className="card catalog-search-wrap">
          <div className="form-group admin-combobox-wrap" ref={dropdownRef}>
            <label htmlFor="blog_combobox_input">
              Search or Select Existing Blog Post to Edit:
            </label>
            
            <div className="admin-combobox-input-group">
              <input
                id="blog_combobox_input"
                type="text"
                className="form-group input admin-combobox-input"
                placeholder="🔍 Type title or click arrow to choose existing post..."
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
                  title="Clear selection to create a new post"
                >
                  ✕ Clear / New
                </button>
              )}
            </div>

            {/* Floating Options Menu */}
            {isDropdownOpen && (
              <ul className="admin-combobox-dropdown">
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((item) => (
                    <li
                      key={item.id}
                      className="admin-combobox-item"
                      onClick={() => handleSelectBlogFromMenu(item)}
                    >
                      <span className="admin-combobox-item-name">{item.title}</span>
                      <span className="admin-combobox-item-sci">/{item.slug}</span>
                    </li>
                  ))
                ) : (
                  <li className="admin-combobox-no-results">
                    No matching blog posts found. (Creating a new entry below)
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Global Feedback Box */}
        {globalStatus.message && (
          <div className={`admin-status-box ${globalStatus.state}`}>
            {globalStatus.message}
          </div>
        )}

        {/* Main Curation Form */}
        <form onSubmit={handleSubmit} className="card admin-form-card">
          
          {/* SECTION 1: BASIC INFORMATION */}
          <div>
            <h3 className="admin-section-title">
              1. Article Identification & Metadata
            </h3>
            
            <div className="admin-grid-3">
              <div className="form-group">
                <label htmlFor="title" className="admin-form-label">Blog Title *</label>
                <input
                  id="title"
                  type="text"
                  required
                  className="admin-input-text"
                  placeholder="e.g., Breakthroughs in Plant Genomic Sequencing"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="slug" className="admin-form-label">URL Slug</label>
                <input
                  id="slug"
                  type="text"
                  required
                  className="admin-input-text"
                  value={formData.slug}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="author" className="admin-form-label">Author / Editorial Team</label>
                <input
                  id="author"
                  type="text"
                  className="admin-input-text"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subtitle" className="admin-form-label">Sub-Heading (Optional)</label>
              <input
                id="subtitle"
                type="text"
                className="admin-input-text"
                placeholder="A brief summary sentence displayed below the title"
                value={formData.subtitle}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 2: MEDIA FORMAT & UPLOAD */}
          <div>
            <h3 className="admin-section-title">
              2. Media Display & Upload
            </h3>
            
            <div className="admin-grid-taxonomy">
              <div className="form-group">
                <label htmlFor="media_type" className="admin-form-label">Media Display Format</label>
                <select
                  id="media_type"
                  className="admin-input-text"
                  value={formData.media_type}
                  onChange={handleChange}
                >
                  <option value="image">Standard Image Card</option>
                  <option value="banner">Wide Header Banner</option>
                </select>
              </div>

              <div className="form-group">
                <label className="admin-form-label">Upload Image / Banner (Supabase Bucket)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMediaFile(e.target.files[0])}
                  className="admin-input-text"
                />
                {formData.media_url && !mediaFile && (
                  <span className="admin-preview-info-url">
                    Active Media: {formData.media_url}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: TAGS */}
          <div>
            <h3 className="admin-section-title">
              3. Hashtags & Categories
            </h3>
            <div className="form-group">
              <label htmlFor="tagsInput" className="admin-form-label">Hashtags / Tags (Comma separated)</label>
              <input
                id="tagsInput"
                type="text"
                className="admin-input-text"
                placeholder="Genomics, AI, Research, Foundation"
                value={formData.tagsInput}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 4: WYSIWYG EDITOR */}
          <div>
            <h3 className="admin-section-title">
              4. Description & Body Content
            </h3>
            <div className="form-group">
              <label className="admin-form-label">
                Article Body Content *
              </label>
              <div className="admin-quill-wrapper">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                  modules={modules}
                  placeholder="Paste or compose your rich formatted article here..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: PUBLICATION TOGGLE */}
          <div className="admin-checkbox-group">
            <label className="admin-checkbox-label">
              <input
                id="is_published"
                type="checkbox"
                checked={formData.is_published}
                onChange={handleChange}
              />
              <span>Publish Immediately to Public Blog Feed</span>
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="admin-action-bar">
            <button
              type="submit"
              disabled={loading}
              className="btn-solid admin-btn-lg"
            >
              {loading ? 'Saving...' : formData.id ? 'Update Blog Post 🚀' : 'Publish Blog Post 🚀'}
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="btn-outline admin-btn-lg"
            >
              Clear / New Post
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}