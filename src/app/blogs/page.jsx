'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [sortOrder]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true);

      if (sortOrder === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err.message);
      setErrorMessage('Failed to load foundation articles from database.');
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs based on search keyword (title, subtitle, author, or hashtags)
  const filteredBlogs = blogs.filter((blog) => {
    const query = searchTerm.toLowerCase();
    const title = blog.title?.toLowerCase() || '';
    const subtitle = blog.subtitle?.toLowerCase() || '';
    const author = blog.author?.toLowerCase() || '';
    const tags = blog.tags?.some((tag) => tag.toLowerCase().includes(query)) || false;

    return title.includes(query) || subtitle.includes(query) || author.includes(query) || tags;
  });

  return (
    <Layout
      title="Foundation Blog & Research Updates"
      description="Explore breakthrough articles, scientific highlights, and official announcements across the Sivasakthi Science Foundation ecosystem."
    >
      <div className="container section-stack">

        {/* Page Header Section (Catalog Model Style) */}
        <div className="hero-section text-center">
          <h1 className="hero-title">
            SSF Network Blog & Research Updates
          </h1>
          <p className="card-body margin-auto max-w-700">
            Insights, multi-omics discoveries, and institutional announcements from the Sivasakthi Science Foundation ecosystem.
          </p>
        </div>

        {/* Search & Sort Filter Card */}
        <div className="card catalog-search-wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <div className="form-group" style={{ flex: '1 1 300px', margin: 0 }}>
              <label htmlFor="blog_search">
                Search Articles:
              </label>
              <input
                id="blog_search"
                type="text"
                className="form-group input"
                placeholder="🔍 Search by title, author, or #hashtag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: '0 1 220px', margin: 0 }}>
              <label htmlFor="blog_sort">
                Sort by Date:
              </label>
              <select
                id="blog_sort"
                className="form-group input"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center" style={{ padding: '4rem 0', color: 'var(--ink-muted)', fontSize: '1.1rem' }}>
            ⏳ Loading articles from database...
          </div>
        )}

        {errorMessage && (
          <div className="text-center" style={{ padding: '2rem', color: '#dc2626', background: '#ffeeec', borderRadius: '8px' }}>
            {errorMessage}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <h3 className="card-title">No articles found matching your search criteria.</h3>
            <p style={{ color: 'var(--ink-muted)' }}>Try clearing your search filter to view all available publications.</p>
          </div>
        )}

        {/* Blog Feed Grid (Catalog 3-Column Grid Layout) */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-3">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="card catalog-card-shell" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>

                {/* Media Thumbnail */}
                {blog.media_url ? (
                  <div className="catalog-thumb-box" style={{ height: '200px', width: '100%', overflow: 'hidden', background: 'var(--brand-surface-subtle)' }}>
                    <img
                      src={blog.media_url}
                      alt={blog.title}
                      className="catalog-thumb-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className="catalog-placeholder-box" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-surface-subtle)', color: 'var(--ink-muted)' }}>
                    📰 SSF Publication
                  </div>
                )}

                <div className="catalog-card-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  
                  <div>
                    {/* Meta Info Row */}
                    <div className="catalog-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="timestamp" style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="badge" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {blog.author}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                      <Link href={`/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {blog.title}
                      </Link>
                    </h3>

                    {/* Subtitle / Excerpt */}
                    {blog.subtitle && (
                      <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
                        {blog.subtitle}
                      </p>
                    )}

                    {/* Hashtags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="blog-tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                        {blog.tags.map((tag, idx) => (
                          <span key={idx} style={{ fontSize: '0.75rem', background: 'var(--brand-surface-subtle)', color: 'var(--brand-primary)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="btn-solid btn-full"
                      style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}
                    >
                      Read Article →
                    </Link>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}