import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

// PUBLIC_INTERFACE
export default function ChatWidget() {
  /** Collapsible FAB → panel chat widget. Keeps mock-only local state. */
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am the VizAI Assistant. How can I help?' }
  ]);
  const [text, setText] = useState('');
  const loc = useLocation();
  const { state } = useApp();
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
      if (e.key === 'Enter' && open && (e.metaKey || e.ctrlKey)) {
        doSend();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, [open, text]);

  const doSend = () => {
    const content = text.trim();
    if (!content) return;
    // Attach context (route + filters) per ui_flow_and_interactions.md
    const context = {
      route: loc.pathname,
      filters: state.filters,
      datePreset: state.datePreset,
    };
    setMessages((m) => [...m, { role: 'user', text: content }, { role: 'assistant', text: `Got it! (context: ${JSON.stringify(context)})` }]);
    setText('');
    // In real backend we would call API here
  };

  return (
    <>
      {open && (
        <div className="chat-panel" ref={panelRef} role="dialog" aria-label="VizAI Assistant" aria-modal="false">
          <div className="chat-panel-header">
            <span>VizAI Assistant</span>
            <button className="btn ghost" onClick={() => setOpen(false)} aria-label="Close chat">Close</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className="chat-message" aria-live="polite">
                <strong style={{ marginRight: 6 }}>{m.role === 'assistant' ? 'Assistant' : 'You'}:</strong>{m.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <div className="form-row" style={{ gap: 8 }}>
              <button className="btn secondary" onClick={() => setText(t => (t ? t + ' Help me understand the timeline.\n' : 'Help me understand the timeline.'))}>Timeline tips</button>
              <button className="btn secondary" onClick={() => setText(t => (t ? t + ' How do I generate a report?\n' : 'How do I generate a report?'))}>Report help</button>
            </div>
            <div className="chat-input-row">
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message..." aria-label="Chat input" />
              <button className="btn primary" onClick={doSend} aria-label="Send message">Send</button>
            </div>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(o => !o)} aria-haspopup="dialog" aria-expanded={open}>
        <span aria-hidden="true">💬</span>
        <span>Need help?</span>
      </button>
    </>
  );
}
