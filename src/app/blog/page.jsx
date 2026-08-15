'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function PublicBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

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
      console.error('Error fetching public blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const term = searchTerm.toLowerCase();
    const matchTitle = blog.title?.toLowerCase().includes(term);
    const matchSubtitle = blog.subtitle?.toLowerCase().includes(term);
    const matchAuthor = blog.author?.toLowerCase().includes(term);
    const matchTags = blog.tags?.some((tag) => tag.toLowerCase().includes(term));
    return matchTitle || matchSubtitle || matchAuthor || matchTags;
  });

  return (
    <Layout
      title="Foundation Blog & Research Updates"
      description="Explore breakthrough articles, scientific highlights, and official announcements across the Sivasakthi Science Foundation ecosystem."
    >
      <div className="blog-page-container">
        
        {/* Public Hero Header */}
        <div className="blog-hero-section">
          <h1 className="blog-hero-title">
            Foundation Blog & Research Updates
          </h1>
          <p className="blog-hero-desc">
            Insights, multi-omics discoveries, and institutional announcements from the Sivasakthi Science Foundation network.
          </p>
        </div>

        {/* Search & Sort Filter Bar */}
        <div className="card blog-controls-card">
          <div className="blog-search-group">
            <label className="blog-control-label">Search Articles</label>
            <input
              type="text"
              className="blog-control-input"
              placeholder="Search by title, author, or #hashtag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="blog-sort-group">
            <label className="blog-control-label">Sort by Date</label>
            <select
              className="blog-control-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Public Blog Feed Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--slate-muted)' }}>Loading articles...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-muted)' }}>
            No articles found matching your search criteria.
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="card blog-card">
                
                {/* Media Thumbnail */}
                {blog.media_url && (
                  <div className="blog-thumbnail-wrapper">
                    <img
                      src={blog.media_url}
                      alt={blog.title}
                      className="blog-thumbnail-img"
                    />
                  </div>
                )}

                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="blog-card-author">
                      {blog.author}
                    </span>
                  </div>

                  <h3 className="blog-card-title">
                    <Link href={`/blog/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h3>

                  {blog.subtitle && (
                    <p className="blog-card-subtitle">
                      {blog.subtitle}
                    </p>
                  )}

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags-container">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="blog-tag-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="blog-card-footer">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="btn-solid blog-read-btn"
                  >
                    Read Article →
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}