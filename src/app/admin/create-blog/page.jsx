'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';
import '@styles/pages/admin.css';
import 'react-quill-new/dist/quill.snow.css'; // Quill editor styling

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('SSF Editorial Team');
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'banner'
  const [mediaFile, setMediaFile] = useState(null);
  const [tagsInput, setTagsInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Dynamically load ReactQuill to prevent SSR hydration mismatches in Next.js
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

  // Auto-generate URL slug from title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let mediaUrl = '';

      // 1. Upload media to Supabase 'blog-media' bucket if a file was selected
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
      const tagsArray = tagsInput
        ? tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      // 3. Insert record into Supabase 'blogs' table
      const { error: insertError } = await supabase.from('blogs').insert([
        {
          title,
          slug,
          subtitle,
          content,
          author,
          media_type: mediaType,
          media_url: mediaUrl,
          tags: tagsArray,
          is_published: isPublished,
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage('🎉 Blog post successfully published!');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to upload blog post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Create Blog | Admin Portal"
      description="Publish official research articles, announcements, and network updates."
    >
      <div className="dashboard-container">
        
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Create New Blog Post</h1>
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

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="submission-card" style={{ borderColor: '#ef4444', background: '#fee2e2', color: '#b91c1c', marginBottom: '24px' }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="submission-card" style={{ borderColor: '#10b981', background: '#d1fae5', color: '#047857', marginBottom: '24px' }}>
            {successMessage}
          </div>
        )}

        {/* Form Card Container */}
        <div className="controls-card" style={{ display: 'block' }}>
          <form onSubmit={handleSubmit} className="cards-container" style={{ padding: '0' }}>
            
            {/* Title */}
            <div className="control-group">
              <label className="control-label">Blog Title *</label>
              <input
                type="text"
                required
                className="control-input"
                placeholder="e.g., Breakthroughs in Plant Genomic Sequencing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* URL Slug Preview */}
            <div className="control-group">
              <label className="control-label">URL Slug (Auto-generated)</label>
              <input
                type="text"
                disabled
                className="control-input"
                value={slug}
                style={{ background: 'var(--slate-light)', color: 'var(--slate-muted)' }}
              />
            </div>

            {/* Sub-Heading */}
            <div className="control-group">
              <label className="control-label">Sub-Heading (Optional)</label>
              <input
                type="text"
                className="control-input"
                placeholder="A brief summary sentence displayed below the title"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            {/* Author Name */}
            <div className="control-group">
              <label className="control-label">Author / Editorial Team</label>
              <input
                type="text"
                className="control-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            {/* Media Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div className="control-group">
                <label className="control-label">Media Display Format</label>
                <select
                  className="control-select"
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
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
                  style={{ padding: '8px' }}
                />
              </div>
            </div>

            {/* Hashtags */}
            <div className="control-group">
              <label className="control-label">Hashtags / Tags (Comma separated)</label>
              <input
                type="text"
                className="control-input"
                placeholder="Genomics, AI, Research, Foundation"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            {/* WYSIWYG Rich Text Editor */}
            <div className="control-group">
              <label className="control-label" style={{ marginBottom: '8px' }}>
                Description / Body Content *
              </label>
              <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid var(--slate-border)', overflow: 'hidden' }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="Paste or compose your rich formatted article here (supports bolding, bullet points, headers)..."
                  style={{ minHeight: '250px', background: '#ffffff', color: '#0f172a' }}
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar" style={{ justifyContent: 'flex-end', borderTop: '1px solid var(--slate-border)', marginTop: '24px', paddingTop: '20px' }}>
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="action-btn archive"
                style={{ padding: '10px 20px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="action-btn reply"
                style={{ padding: '10px 24px', background: 'var(--brand-primary, #7c3aed)', color: '#ffffff', border: 'none' }}
              >
                {loading ? 'Publishing...' : 'Publish Blog Post 🚀'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </Layout>
  );
}