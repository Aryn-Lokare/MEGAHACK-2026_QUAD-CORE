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
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isUser ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-indigo-400'}`}>
        {isUser ? 'U' : 'AI'}
      </div>
      {/* Bubble */}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${
        isUser
          ? 'bg-indigo-500 text-white rounded-br-sm'
          : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
      }`}>
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 text-indigo-400 flex items-center justify-center text-sm font-bold">AI</div>
      <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI Campus Assistant. Ask me anything about your timetable, assignments, campus locations, or attendance." }
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'I could not process your request.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please make sure the API server is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: '#F8FAFC' }}>

      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 shadow-sm" style={{ background: '#1E293B' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#6366F1' }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-semibold text-base leading-tight">AI Campus Assistant</h1>
          <p className="text-slate-400 text-xs">Powered by RAG + Gemini</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400 text-xs">Online</span>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-5 pt-2" style={{ borderTop: '1px solid #E2E8F0' }}>
        <div className="flex gap-3 items-end bg-white rounded-2xl shadow-md px-4 py-3 border border-slate-200">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about campus..."
            rows={1}
            className="flex-1 resize-none outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent max-h-32"
            style={{ color: '#0F172A' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: '#6366F1' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">Answers are generated from campus database context</p>
      </div>
    </div>
  );
}
