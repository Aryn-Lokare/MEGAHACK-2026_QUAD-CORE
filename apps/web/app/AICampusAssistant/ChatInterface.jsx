'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, supabase } from '../../src/context/AuthContext';

const suggestedQuestions = [
  "When is my next class?",
  "Where is the AI Lab?",
  "What is the DBMS assignment deadline?",
  "Where is the library?",
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', gap: '16px', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div style={{
        flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 'bold',
        background: isUser ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.05)',
        color: isUser ? '#6366F1' : '#475569',
        border: isUser ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(30, 41, 59, 0.1)'
      }}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div style={{
        maxWidth: '80%', padding: '16px 20px', borderRadius: '24px', fontSize: '15px',
        lineHeight: '1.6',
        background: isUser ? '#1E293B' : 'rgba(255, 255, 255, 0.7)',
        color: isUser ? '#F1F5F9' : '#1E293B',
        borderTopRightRadius: isUser ? '4px' : '24px',
        borderTopLeftRadius: isUser ? '24px' : '4px',
        boxShadow: isUser ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        backdropFilter: isUser ? 'none' : 'blur(8px)',
        border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.05)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>AI</div>
      <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.5)', padding: '16px 20px', borderRadius: '24px', borderTopLeftRadius: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        {[0, 150, 300].map((delay, i) => (
          <span key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1',
            animation: 'bounce 1.4s infinite ease-in-out', animationDelay: `${delay}ms`, display: 'block'
          }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hey ${user?.name || 'there'}! How can I help you today? Ask me about your timetable, assignments, or campus details.` }
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
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('http://localhost:5000/api/ai/query', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
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

  const showAdminLink = user && (user.role === 'ADMIN' || user.role === 'FACULTY');

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FACULTY') return '/faculty';
    if (user.role === 'STUDENT') return '/student';
    return '/';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FDFDFF', fontFamily: '"Inter", system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>
      
      {/* Aurora Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '0', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0) 60%)', filter: 'blur(50px)', zIndex: 0 }} />

      <style>{`
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hero-animation { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', padding: '20px 40px', zIndex: 10, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
             </svg>
           </div>
           <span style={{ fontWeight: 700, fontSize: '18px', tracking: '-0.02em', color: '#1E293B' }}>CampusAI</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href={getDashboardLink()} style={{ fontSize: '13px', color: '#475569', textDecoration: 'none', fontWeight: 600, padding: '8px 16px', borderRadius: '12px', transition: 'all 0.2s', border: '1px solid transparent' }} onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
            Dashboard
          </a>
          {showAdminLink && (
            <a href="/AICampusAssistant/admin" style={{ fontSize: '13px', color: '#6366F1', textDecoration: 'none', fontWeight: 600, padding: '8px 16px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', background: 'rgba(99,102,241,0.05)' }}>
              Knowledge
            </a>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          
          {messages.length <= 1 && (
            <div className="hero-animation" style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)', margin: '0 auto 24px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -10px rgba(99,102,241,0.3)' }}>
                 <svg width="40" height="40" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                   <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1E293B', marginBottom: '12px', letterSpacing: '-0.03em' }}>Hey {user?.name?.split(' ')[0] || 'there'}</h2>
              <h3 style={{ fontSize: '48px', fontWeight: 800, color: '#1E293B', marginBottom: '40px', letterSpacing: '-0.04em' }}>How can CampusAI help you today?</h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {suggestedQuestions.map((q, i) => (
                   <button key={i} onClick={() => sendMessage(q)} style={{
                     padding: '10px 20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)', background: '#fff', color: '#475569', fontSize: '14px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.2s'
                   }} onMouseOver={(e) => {e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 12px rgba(0,0,0,0.04)';}} onMouseOut={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';}}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 1 && messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area - The Aurora Bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 20px 40px', zIndex: 10 }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '850px', 
          background: '#111827', 
          borderRadius: '24px', 
          padding: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask CampusAI anything..."
            rows={1}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: '#F9FAFB', 
              padding: '12px 20px', 
              fontSize: '16px', 
              resize: 'none',
              fontFamily: 'inherit',
              maxHeight: '200px'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', paddingRight: '8px' }}>
             <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: '48px', height: '48px', borderRadius: '18px',
                background: (!input.trim() || loading) ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                border: 'none', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                color: '#111827'
              }}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 3l4 4M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div style={{ width: '56px', height: '56px', background: '#F9FAFB', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827' }}>
               <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 4L11.5 5.5L10 6L11.5 6.5L12 8L12.5 6.5L14 6L12.5 5.5L12 4ZM19 10L18.5 11.5L17 12L18.5 12.5L19 14L19.5 12.5L21 12L19.5 11.5L19 10ZM12 10L10.5 14.5L6 16L10.5 17.5L12 22L13.5 17.5L18 16L13.5 14.5L12 10Z" />
               </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
