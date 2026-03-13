'use client';

import { useState, useRef, useEffect } from 'react';

const suggestedQuestions = [
  "When is my next class?",
  "Where is the AI Lab?",
  "What is the DBMS assignment deadline?",
  "Where is the library?",
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', gap: '12px', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', marginBottom: '16px' }}>
      <div style={{
        flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 'bold',
        background: isUser ? '#6366F1' : '#1E293B',
        color: isUser ? '#fff' : '#818CF8'
      }}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div style={{
        maxWidth: '72%', padding: '12px 16px', borderRadius: '18px', fontSize: '14px',
        lineHeight: '1.6', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        background: isUser ? '#6366F1' : '#1E293B',
        color: isUser ? '#fff' : '#CBD5E1',
        borderBottomRightRadius: isUser ? '4px' : '18px',
        borderBottomLeftRadius: isUser ? '18px' : '4px',
        border: isUser ? 'none' : '1px solid #334155',
      }}>
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1E293B', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>AI</div>
      <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '12px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        {[0, 150, 300].map((delay, i) => (
          <span key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%', background: '#818CF8',
            animation: 'bounce 1s infinite', animationDelay: `${delay}ms`, display: 'block'
          }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI Campus Assistant powered by Groq. Ask me anything about your timetable, assignments, campus locations, or attendance." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const query = text || input.trim();
    if (!query || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      const answer = data.answer || (data.error ? `❌ API Error: ${data.error}` : 'I could not process your request.');
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Make sure the API server is running on port 5000.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      {/* Bounce animation */}
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', background: '#1E293B', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
          </svg>
        </div>
        <div>
          <h1 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '15px', margin: 0 }}>AI Campus Assistant</h1>
          <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>Powered by RAG + Groq Llama</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/AICampusAssistant/admin" style={{ fontSize: '12px', color: '#818CF8', textDecoration: 'none', padding: '5px 12px', border: '1px solid #4338CA', borderRadius: '8px' }}>
            ⚙ Manage Knowledge
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#64748B', fontSize: '12px' }}>Online</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
        {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {suggestedQuestions.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)} style={{
              fontSize: '12px', padding: '6px 14px', borderRadius: '20px',
              border: '1px solid #A5B4FC', color: '#6366F1', background: 'transparent',
              cursor: 'pointer', transition: 'backgroundColor 0.2s'
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: '12px 16px 20px', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', background: '#fff', borderRadius: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '12px 16px', border: '1px solid #E2E8F0' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask anything about campus..."
            rows={1}
            style={{ flex: 1, resize: 'none', outline: 'none', border: 'none', fontSize: '14px', color: '#0F172A', background: 'transparent', maxHeight: '128px', fontFamily: 'inherit' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
              background: (!input.trim() || loading) ? '#C7D2FE' : '#6366F1',
              border: 'none', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
            }}
          >
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>Answers generated from campus database · Groq Llama 3.1</p>
      </div>
    </div>
  );
}
