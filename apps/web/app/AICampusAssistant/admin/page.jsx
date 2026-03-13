'use client';

import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/ai';

export default function KnowledgeAdmin() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [fetching, setFetching] = useState(true);

  const fetchEntries = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API}/knowledge`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setStatus('Failed to load entries. Is the API server running?');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const addEntry = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch(`${API}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Added: "${title}"`);
        setTitle('');
        setContent('');
        await fetchEntries();
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch {
      setStatus('❌ Failed to add entry. Check API connection.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id, entryTitle) => {
    if (!confirm(`Delete "${entryTitle}"?`)) return;
    try {
      await fetch(`${API}/knowledge/${id}`, { method: 'DELETE' });
      setEntries(prev => prev.filter(e => e.id !== id));
      setStatus(`🗑️ Deleted: "${entryTitle}"`);
    } catch {
      setStatus('❌ Failed to delete entry.');
    }
  };

  const uploadPdf = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.pdfFile;
    const prefixInput = e.target.elements.pdfPrefix;
    const file = fileInput.files[0];
    
    if (!file) return;
    setLoading(true);
    setStatus('');
    
    const formData = new FormData();
    formData.append('file', file);
    if (prefixInput.value) formData.append('titlePrefix', prefixInput.value);

    try {
      const res = await fetch(`${API}/knowledge/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ PDF Processed! Added ${data.chunksAdded} text chunks.`);
        fileInput.value = '';
        if (prefixInput) prefixInput.value = '';
        await fetchEntries();
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch {
      setStatus('❌ Failed to upload PDF. Check API connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#1E293B', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <div>
          <h1 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '15px', margin: 0 }}>Knowledge Base Manager</h1>
          <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>Add, view, and delete RAG knowledge entries</p>
        </div>
        <a href="/AICampusAssistant" style={{ marginLeft: 'auto', fontSize: '13px', color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid #4338CA', borderRadius: '8px' }}>
          ← Back to Chat
        </a>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Add Entry Form */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '32px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '20px', marginTop: 0 }}>
            ➕ Add New Knowledge Entry
          </h2>
          <form onSubmit={addEntry}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>
                Title
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Physics Lab Location"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>
                Content
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="e.g. The Physics Lab is located in Block D, 2nd floor, Room 204."
                required
                rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#F8FAFC', fontFamily: 'inherit' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#A5B4FC' : '#6366F1', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Adding...' : 'Add to Knowledge Base'}
            </button>
          </form>
          {status && (
            <p style={{ marginTop: '12px', fontSize: '13px', color: status.startsWith('✅') ? '#059669' : status.startsWith('🗑️') ? '#6366F1' : '#DC2626' }}>{status}</p>
          )}
        </div>

        {/* Upload PDF Form */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '32px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '20px', marginTop: 0 }}>
            📄 Upload PDF (Auto-Chunking)
          </h2>
          <form onSubmit={uploadPdf}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>
                Select PDF File
              </label>
              <input
                type="file"
                name="pdfFile"
                accept=".pdf"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px dashed #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>
                Title Prefix (Optional)
              </label>
              <input
                name="pdfPrefix"
                placeholder="e.g. Student Handbook 2026"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC' }}
              />
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', marginBottom: 0 }}>Chunks save as "Prefix - Part 1", "Prefix - Part 2", etc.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#A5B4FC' : '#4F46E5', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Processing...' : 'Upload PDF'}
            </button>
          </form>
        </div>

        {/* Existing Entries */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
            📚 Knowledge Entries ({entries.length})
          </h2>
          {fetching ? (
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading entries...</p>
          ) : entries.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>No knowledge entries yet. Add the first one above!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {entries.map(entry => (
                <div key={entry.id} style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '14px', color: '#1E293B' }}>{entry.title}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>{entry.content}</p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id, entry.title)}
                    title="Delete entry"
                    style={{ flexShrink: 0, background: 'none', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
