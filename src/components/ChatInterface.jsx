import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Settings, Paperclip, X } from 'lucide-react';
import './ChatInterface.css';

export default function ChatInterface({ messages, onSendMessage, isTyping, onOpenSettings }) {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() || attachedFile) {
      onSendMessage(input.trim(), attachedFile);
      setInput('');
      setAttachedFile(null);
    }
  };

  return (
    <div className="glass-panel chat-pane fade-in-up">
      <div className="header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bot size={22} color="var(--accent-color)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Sheep goes BA</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a href="https://github.com/javin7/BA-Agent" target="_blank" rel="noopener noreferrer" className="icon-btn" title="View Source">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <button onClick={onOpenSettings} className="icon-btn" title="API Settings">
            <Settings size={18} />
          </button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.role === 'user' ? 'user-wrapper' : 'agent-wrapper'} animate-fade-in`}>
            {msg.role === 'agent' && (
              <div className="avatar agent-avatar">
                <Bot size={16} />
              </div>
            )}
            <div className={`message-bubble ${msg.role}-bubble`}>
              {msg.uiContent || msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="avatar user-avatar">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper agent-wrapper animate-fade-in">
             <div className="avatar agent-avatar">
                <Bot size={16} />
              </div>
            <div className="message-bubble agent-bubble typing-indicator">
              <Loader2 className="spinner" size={16} />
              <span>Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <div className="input-with-file">
          {attachedFile && (
            <div className="file-badge fade-in-up">
              <span className="file-name">{attachedFile.name}</span>
              <button type="button" onClick={() => setAttachedFile(null)} className="remove-file-btn"><X size={12} /></button>
            </div>
          )}
          <div className="input-row">
            <button 
              type="button" 
              className="attach-btn" 
              onClick={() => fileInputRef.current?.click()}
              title="Attach Document (.pdf, .docx, .txt, .csv, .md, .json, .xml)"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".txt,.pdf,.docx,.md,.markdown,.csv,.json,.xml,.html"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setAttachedFile(file);
                e.target.value = null;
              }}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe requirements or attach a doc..."
              className="chat-input"
            />
            <button type="submit" disabled={(!input.trim() && !attachedFile) || isTyping} className="send-btn">
              <Send size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
