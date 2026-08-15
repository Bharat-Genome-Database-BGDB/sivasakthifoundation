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
  const [isDropdownOpen, setIsDropdownOpen] = useState('');
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

      // Auto-generate slug from title only if it's a new post or user wants auto-sync
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

      // 1. Upload new media to Supabase 'blog-media' bucket if a file was selected
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

      // 2. Format hashtags/tags string into PostgreSQL text[] array
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
        // UPDATE existing blog
        const { error: updateError } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', formData.id);

        if (updateError) throw updateError;
        setGlobalStatus({ state: 'success', message: `🎉 Successfully updated "${formData.title}"!` });
      } else {
        // INSERT new blog
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
      <main className="container py-xl">
        
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              {formData.id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="dashboard-subtitle">
              Draft and distribute articles across the Sivasakthi Science Foundation ecosystem.
            </p>
          </div>
          <div className="user-badge-container">
            <span className="user-badge">Admin Access Verified</span>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="action-btn archive"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Searchable Custom Combobox Selector for Editing Existing Blogs */}
        <div className="card p-xl">
          <label htmlFor="blog_combobox_input" className="admin-select-label">
            Search or Select Existing Blog Post to Edit:
          </label>
          
          <div className="admin-combobox-wrap" ref={dropdownRef}>
            <div className="admin-combobox-input-group">
              <input
                id="blog_combobox_input"
                type="text"
                className="admin-combobox-input"
                placeholder="🔍 Click arrow on right or type to search existing posts..."
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

        {/* Global Feedback Banner */}
        {globalStatus.message && (
          <div className={`admin-status-box ${globalStatus.state}`}>
            {globalStatus.message}
          </div>
        )}

        {/* Form Card Container */}
        <div className="controls-card">
          <form onSubmit={handleSubmit} className="cards-container">
            
            {/* Title */}
            <div className="control-group">
              <label htmlFor="title" className="control-label">Blog Title *</label>
              <input
                id="title"
                type="text"
                required
                className="control-input"
                placeholder="e.g., Breakthroughs in Plant Genomic Sequencing"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* URL Slug Preview */}
            <div className="control-group">
              <label htmlFor="slug" className="control-label">URL Slug</label>
              <input
                id="slug"
                type="text"
                required
                className="control-input"
                value={formData.slug}
                onChange={handleChange}
              />
            </div>

            {/* Sub-Heading */}
            <div className="control-group">
              <label htmlFor="subtitle" className="control-label">Sub-Heading (Optional)</label>
              <input
                id="subtitle"
                type="text"
                className="control-input"
                placeholder="A brief summary sentence displayed below the title"
                value={formData.subtitle}
                onChange={handleChange}
              />
            </div>

            {/* Author Name */}
            <div className="control-group">
              <label htmlFor="author" className="control-label">Author / Editorial Team</label>
              <input
                id="author"
                type="text"
                className="control-input"
                value={formData.author}
                onChange={handleChange}
              />
            </div>

            {/* Media Options */}
            <div className="admin-grid-taxonomy">
              <div className="control-group">
                <label htmlFor="media_type" className="control-label">Media Display Format</label>
                <select
                  id="media_type"
                  className="control-select"
                  value={formData.media_type}
                  onChange={handleChange}
                >
                  <option value="image">Standard Image Card</option>
                  <option value="banner">Wide Header Banner</option>
                </select>
              </div>

              <div className="control-group">
                <label className="control-label">Upload Image / Banner (Supabase Bucket)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMediaFile(e.target.files[0])}
                  className="control-input"
                />
                {formData.media_url && !mediaFile && (
                  <span className="admin-preview-info-url" style={{ marginTop: '6px', display: 'block' }}>
                    Current Media: {formData.media_url}
                  </span>
                )}
              </div>
            </div>

            {/* Hashtags */}
            <div className="control-group">
              <label htmlFor="tagsInput" className="control-label">Hashtags / Tags (Comma separated)</label>
              <input
                id="tagsInput"
                type="text"
                className="control-input"
                placeholder="Genomics, AI, Research, Foundation"
                value={formData.tagsInput}
                onChange={handleChange}
              />
            </div>

            {/* WYSIWYG Rich Text Editor */}
            <div className="control-group">
              <label className="control-label" style={{ marginBottom: '8px' }}>
                Description / Body Content *
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

            {/* Publication Toggle */}
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

            {/* Action Bar */}
            <div className="action-bar" style={{ justifyContent: 'flex-end', borderTop: '1px solid var(--slate-border)', marginTop: '24px', paddingTop: '20px' }}>
              <button
                type="button"
                onClick={handleResetForm}
                className="action-btn archive"
              >
                Clear / New Post
              </button>
              <button
                type="submit"
                disabled={loading}
                className="action-btn reply"
              >
                {loading ? 'Saving...' : formData.id ? 'Update Blog Post 🚀' : 'Publish Blog Post 🚀'}
              </button>
            </div>

          </form>
        </div>

      </main>
    </Layout>
  );
}