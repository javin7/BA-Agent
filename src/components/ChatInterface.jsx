import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import './ChatInterface.css'; // We'll create a basic css for chat

export default function ChatInterface({ messages, onSendMessage, isTyping }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="glass-panel left-pane fade-in-up">
      <div className="header">
        <Bot size={22} color="var(--accent-color)" />
        <h2>BA Agent</h2>
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
              {msg.content}
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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your requirements..."
          className="chat-input"
        />
        <button type="submit" disabled={!input.trim()} className="send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
