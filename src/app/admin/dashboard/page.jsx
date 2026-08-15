'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient'; // Adjust path if needed
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

// Organization Theme Map
const ORG_THEMES = {
  sivasakthifoundation: {
    label: 'Sivasakthi Foundation',
    headerBg: '#3b167f',
    accentColor: '#7c3aed',
    cardBorder: '#2e1065'
  },
  genairesearch: {
    label: 'GenAI Research Labs',
    headerBg: '#c7620f',
    accentColor: '#e36a55',
    cardBorder: '#c7620f'
  },
  bharatgenomedatabase: {
    label: 'Bharat Genome Database',
    headerBg: '#064e3b',
    accentColor: '#064e3b',
    cardBorder: '#064e3b'
  },
  aarogyasakthi: {
    label: 'AarogyaSakthi',
    headerBg: '#2b9ad2',
    accentColor: '#2b9ad2',
    cardBorder: '#0c4a6a'
  }
};

const DEFAULT_THEME = {
  label: 'General / Unassigned',
  headerBg: '#334155',
  accentColor: '#64748b',
  cardBorder: '#e2e8f0'
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guide Toggle State with localStorage Persistence
  const [showGuide, setShowGuide] = useState(true);

  // Filter & Sort States
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'archived' | 'all'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Active Admin Note State
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Restore Guide preference & Auth Check
  useEffect(() => {
    // Load guide visibility setting
    const storedGuidePref = localStorage.getItem('ssf_admin_show_guide');
    if (storedGuidePref !== null) {
      setShowGuide(storedGuidePref === 'true');
    }

    const checkAuthAndFetch = async () => {
      setLoading(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.push('/admin/login');
        return;
      }

      try {
        const { data: subsData, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setSubmissions(subsData || []);
      } catch (err) {
        console.error('Error fetching dashboard submissions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const toggleGuideVisibility = () => {
    const nextState = !showGuide;
    setShowGuide(nextState);
    localStorage.setItem('ssf_admin_show_guide', String(nextState));
  };

  // --- Admin Actions ---

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status: newStatus, last_updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    }
  };

  const handleSaveNotes = async (id, currentStatus) => {
    const shouldUpdateStatus = currentStatus === 'pending' || currentStatus === 'read';
    const newStatus = shouldUpdateStatus ? 'noted' : currentStatus;

    const { error } = await supabase
      .from('contact_submissions')
      .update({ 
        admin_notes: noteText, 
        status: newStatus,
        last_updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((item) => 
          item.id === id ? { ...item, admin_notes: noteText, status: newStatus } : item
        )
      );
      setEditingNoteId(null);
      setNoteText('');
    }
  };

  // --- Filtering & Sorting Logic ---

  const processedSubmissions = useMemo(() => {
    return submissions
      .filter((item) => {
        if (selectedOrg !== 'all' && item.org_slug !== selectedOrg) return false;

        if (statusFilter === 'active' && item.status === 'archived') return false;
        if (statusFilter === 'archived' && item.status !== 'archived') return false;

        if (searchKeyword.trim() !== '') {
          const query = searchKeyword.toLowerCase();
          const matchName = item.name?.toLowerCase().includes(query);
          const matchMessage = item.message?.toLowerCase().includes(query);
          if (!matchName && !matchMessage) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const isAPending = !a.status || a.status === 'pending';
        const isBPending = !b.status || b.status === 'pending';

        if (isAPending !== isBPending) {
          return isAPending ? -1 : 1;
        }

        if (sortBy === 'date-desc') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'date-asc') return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [submissions, selectedOrg, statusFilter, searchKeyword, sortBy]);

  const groupedSubmissions = useMemo(() => {
    const groups = {};
    const knownSlugs = ['sivasakthifoundation', 'genairesearch', 'bharatgenomedatabase', 'aarogyasakthi'];
    knownSlugs.forEach((slug) => { groups[slug] = []; });

    processedSubmissions.forEach((sub) => {
      const slug = sub.org_slug || 'unassigned';
      if (!groups[slug]) groups[slug] = [];
      groups[slug].push(sub);
    });

    return groups;
  }, [processedSubmissions]);

  return (
    <Layout title="Ecosystem Unified Dashboard" description="Centralized Contact & Inquiry Management across all SSF Digital Properties.">
      <div className="dashboard-container">
        
        {/* --- Dashboard Header --- */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Ecosystem Unified Dashboard</h1>
            <p className="dashboard-subtitle">
              Centralized Contact & Inquiry Management across all SSF Digital Properties.
            </p>
          </div>
        </header>

        {/* --- Collapsible CSS/SVG Workflow Guide --- */}
        <div className="workflow-guide-banner">
          <div className="workflow-guide-header">
            <span className="workflow-guide-title">
              💡 Workflow Lifecycle Guide
            </span>
            <button onClick={toggleGuideVisibility} className="btn-toggle-guide">
              {showGuide ? '▲ Hide Guide' : '▼ Show Guide'}
            </button>
          </div>

          {showGuide && (
            <div className="workflow-guide-body">
              
              {/* Step 1 */}
              <div className="workflow-step-card">
                <div className="workflow-step-header">
                  <span className="step-number">Step 01</span>
                  <span className="status-badge status-pending">pending</span>
                </div>
                <p className="step-title">Intake & Arrival</p>
                <p className="step-desc">
                  New form submissions arrive as <strong>Pending</strong> and remain pinned at the top of the feed.
                </p>
                
                <svg className="step-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>

              {/* Step 2 */}
              <div className="workflow-step-card">
                <div className="workflow-step-header">
                  <span className="step-number">Step 02</span>
                  <span className="status-badge status-read">read</span>
                </div>
                <p className="step-title">Review Message</p>
                <p className="step-desc">
                  Click <strong>✓ Mark Read</strong> after reading. The card sinks below active pending items.
                </p>

                <svg className="step-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>

              {/* Step 3 */}
              <div className="workflow-step-card">
                <div className="workflow-step-header">
                  <span className="step-number">Step 03</span>
                  <span className="status-badge status-noted">noted</span>
                </div>
                <p className="step-title">Team Collaboration</p>
                <p className="step-desc">
                  Click <strong>📝 Add Note</strong> to record staff feedback. Saving a note updates badge to <strong>Noted</strong>.
                </p>

                <svg className="step-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>

              {/* Step 4 */}
              <div className="workflow-step-card">
                <div className="workflow-step-header">
                  <span className="step-number">Step 04</span>
                  <span className="status-badge status-replied">replied</span>
                </div>
                <p className="step-title">Resolution & Archive</p>
                <p className="step-desc">
                  Click <strong>✉️ Mark Replied</strong> or <strong>📁 Archive</strong> to clear completed entries from active view.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* --- Controls Bar --- */}
        <div className="controls-card">
          
          {/* Search Field */}
          <div className="control-group search">
            <label className="control-label">Search Keywords</label>
            <input
              type="text"
              className="control-input"
              placeholder="Search by Name or Message contents..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          {/* Org Filter Dropdown */}
          <div className="control-group select">
            <label className="control-label">Organization</label>
            <select
              className="control-select"
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
            >
              <option value="all">All Organizations</option>
              <option value="sivasakthifoundation">Sivasakthi Foundation</option>
              <option value="genairesearch">GenAI Research Labs</option>
              <option value="bharatgenomedatabase">Bharat Genome Database</option>
              <option value="aarogyasakthi">AarogyaSakthi</option>
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="control-group select">
            <label className="control-label">Message View</label>
            <select
              className="control-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="active">Active Inbox</option>
              <option value="archived">Archived Submissions</option>
              <option value="all">All Messages</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="control-group select">
            <label className="control-label">Sort By</label>
            <select
              className="control-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Date: Newest First</option>
              <option value="date-asc">Date: Oldest First</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* --- Submissions Feed --- */}
        {loading ? (
          <div className="empty-state">Verifying authorization & loading submissions...</div>
        ) : (
          Object.entries(groupedSubmissions).map(([orgSlug, items]) => {
            if (selectedOrg !== 'all' && selectedOrg !== orgSlug) return null;
            if (items.length === 0 && searchKeyword !== '') return null;

            const theme = ORG_THEMES[orgSlug] || DEFAULT_THEME;

            return (
              <section
                key={orgSlug}
                className="org-section"
                style={{ border: `2px solid ${theme.cardBorder}` }}
              >
                {/* Organization Header */}
                <div className="org-header" style={{ backgroundColor: theme.headerBg }}>
                  <div className="org-title-group">
                    <h2 className="org-title">{theme.label}</h2>
                    <span className="org-slug-badge">{orgSlug}</span>
                  </div>
                  <span className="org-count-badge">
                    {items.length} {items.length === 1 ? 'Message' : 'Messages'}
                  </span>
                </div>

                {/* Submission Cards List */}
                <div className="cards-container">
                  {items.length === 0 ? (
                    <div className="empty-state">No messages found for this organization.</div>
                  ) : (
                    items.map((sub) => {
                      const currentStatus = sub.status || 'pending';

                      return (
                        <div
                          key={sub.id}
                          className={`submission-card status-${currentStatus}`}
                        >
                          {/* Top Row */}
                          <div className="card-top-row">
                            <div>
                              <span className="user-name">{sub.name}</span>
                              <span className="user-email">&lt;{sub.email}&gt;</span>
                              {sub.company && <span className="user-company">[{sub.company}]</span>}
                            </div>

                            {/* Status Badge & Timestamp */}
                            <div className="meta-group">
                              <span className={`status-badge status-${currentStatus}`}>
                                {currentStatus}
                              </span>
                              <span className="timestamp">
                                {new Date(sub.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Subject & Message */}
                          <div>
                            {sub.subject && <div className="subject-line">Subject: {sub.subject}</div>}
                            <p className="message-body">{sub.message}</p>
                          </div>

                          {/* Admin Notes */}
                          {sub.admin_notes && editingNoteId !== sub.id && (
                            <div className="admin-note-box">
                              <strong>Admin Note:</strong> {sub.admin_notes}
                            </div>
                          )}

                          {editingNoteId === sub.id && (
                            <div className="note-edit-group">
                              <input
                                type="text"
                                className="note-input"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add internal staff note..."
                              />
                              <button
                                onClick={() => handleSaveNotes(sub.id, currentStatus)}
                                className="btn-note-save"
                                style={{ background: theme.accentColor }}
                              >
                                Save Note
                              </button>
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="btn-note-cancel"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {/* Lifecycle Action Bar */}
                          <div className="action-bar">
                            {currentStatus === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(sub.id, 'read')}
                                className="action-btn read"
                              >
                                ✓ Mark Read
                              </button>
                            )}

                            {currentStatus === 'read' && (
                              <button
                                onClick={() => handleUpdateStatus(sub.id, 'replied')}
                                className="action-btn reply"
                              >
                                ✉️ Mark Replied
                              </button>
                            )}

                            {(currentStatus === 'replied' || currentStatus === 'noted') && (
                              <button
                                onClick={() => handleUpdateStatus(sub.id, 'pending')}
                                className="action-btn unread"
                              >
                                ↩ Reset to Pending
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setEditingNoteId(sub.id);
                                setNoteText(sub.admin_notes || '');
                              }}
                              className="action-btn note"
                            >
                              📝 {sub.admin_notes ? 'Edit Note' : 'Add Note'}
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(sub.id, currentStatus === 'archived' ? 'pending' : 'archived')}
                              className="action-btn archive"
                            >
                              {currentStatus === 'archived' ? '📥 Restore to Inbox' : '📁 Archive'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })
        )}
      </div>
    </Layout>
  );
}