import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('google');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedProvider = localStorage.getItem('ba_agent_provider') || 'google';
      const savedKey = localStorage.getItem(`ba_agent_key_${savedProvider}`) || '';
      setProvider(savedProvider);
      setApiKey(savedKey);
    }
  }, [isOpen]);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setProvider(newProvider);
    const savedKey = localStorage.getItem(`ba_agent_key_${newProvider}`) || '';
    setApiKey(savedKey);
  };

  const handleSave = () => {
    localStorage.setItem('ba_agent_provider', provider);
    localStorage.setItem(`ba_agent_key_${provider}`, apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in-up">
        <div className="modal-header">
          <h3>LLM Configuration</h3>
          <button onClick={onClose} className="icon-btn" title="Close"><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="provider">AI Provider</label>
            <select id="provider" value={provider} onChange={handleProviderChange} className="settings-input">
              <option value="google">Google Gemini</option>
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="github">GitHub Copilot Models</option>
              <option value="openrouter">OpenRouter</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <input 
              id="apiKey"
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder={`Enter ${provider} API Key...`}
              className="settings-input"
            />
            <small className="help-text">Your API keys are stored securely in your browser's local storage.</small>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="save-btn">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
