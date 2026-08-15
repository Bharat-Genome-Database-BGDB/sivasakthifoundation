'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';
// import '@styles/pages/blog.css';

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogData();
    }
  }, [slug]);

  const sanitizeHtmlContent = (htmlString) => {
    if (!htmlString) return '';
    return htmlString
      .replace(/class="ql-align-justify"/g, '') // Strip Quill's forced justification
      .replace(/&nbsp;/g, ' ');                  // Convert non-breaking spaces to normal spaces
  };

  const fetchBlogData = async () => {
    try {
      setLoading(true);

      const { data: currentBlogData, error: currentError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (currentError) throw currentError;
      setBlog(currentBlogData);

      const { data: allBlogsData, error: allError } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .neq('slug', slug)
        .order('created_at', { ascending: false });

      if (!allError) {
        setOtherBlogs(allBlogsData || []);
      }
    } catch (err) {
      console.error('Error fetching blog article:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Article...">
        <div className="blog-page-container blog-loading-state">
          <p className="blog-hero-desc">Loading publication details...</p>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout title="Article Not Found">
        <div className="blog-page-container blog-notfound-state">
          <h1 className="blog-hero-title">Article Not Found</h1>
          <p className="blog-hero-desc blog-notfound-text">
            The article you are looking for might have been moved or is no longer published.
          </p>
          <button onClick={() => router.push('/blog')} className="btn-solid">
            ← Back to All Articles
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={blog.title} description={blog.subtitle || blog.title}>
      <div className="blog-page-container">
        
        {/* Navigation Breadcrumb */}
        <div className="blog-breadcrumb-row">
          <Link href="/blog" className="blog-back-link">
            ← Return to Blog Directory
          </Link>
        </div>

        {/* Article Header Card */}
        <article className="card blog-article-card">
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags-container">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="blog-tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="blog-article-heading">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="blog-article-subheading">
              {blog.subtitle}
            </p>
          )}

          <div className="blog-article-meta-row">
            <span>
              Published on {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="blog-card-author">
              Author: {blog.author}
            </span>
          </div>

          {blog.media_url && (
            <div className="blog-hero-media">
              <img src={blog.media_url} alt={blog.title} />
            </div>
          )}

          <div
            className="quill-content-body"
            dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(blog.content) }}
          />

        </article>

        {/* Bottom Blog Rotator Carousel */}
        {otherBlogs.length > 0 && (
          <section className="blog-rotator-section">
            <div className="blog-rotator-header-row">
              <h2 className="blog-rotator-title">
                Explore Other Articles
              </h2>
              <Link href="/blogs" className="blog-back-link">
                View All →
              </Link>
            </div>

            <div className="blog-rotator-scroll-container">
              {otherBlogs.map((item) => (
                <div key={item.id} className="card blog-rotator-item-card">
                  {item.media_url && (
                    <div className="blog-rotator-thumb">
                      <img src={item.media_url} alt={item.title} />
                    </div>
                  )}
                  <div className="blog-rotator-item-body">
                    <span className="blog-card-meta">
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h4 className="blog-rotator-item-title">
                      <Link href={`/blogs/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                  </div>
                  <div className="blog-rotator-footer">
                    <Link href={`/blogs/${item.slug}`} className="blog-back-link blog-footer-link-small">
                      Read Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </Layout>
  );
}