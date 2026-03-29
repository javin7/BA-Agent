import { useState, useEffect } from 'react';
import { X, Save, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { testApiKey } from '../services/llmService';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('google');
  const [apiKey, setApiKey] = useState('');
  const [testStatus, setTestStatus] = useState('idle'); // 'idle' | 'testing' | 'success' | 'error'

  useEffect(() => {
    if (isOpen) {
      const savedProvider = localStorage.getItem('ba_agent_provider') || 'google';
      const savedKey = localStorage.getItem(`ba_agent_key_${savedProvider}`) || '';
      setProvider(savedProvider);
      setApiKey(savedKey);
      setTestStatus('idle');
    }
  }, [isOpen]);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setProvider(newProvider);
    const savedKey = localStorage.getItem(`ba_agent_key_${newProvider}`) || '';
    setApiKey(savedKey);
    setTestStatus('idle');
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    setTestStatus('idle');
  }

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTestStatus('testing');
    const isValid = await testApiKey(provider, apiKey.trim());
    setTestStatus(isValid ? 'success' : 'error');
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
              onChange={handleApiKeyChange} 
              placeholder={`Enter ${provider} API Key...`}
              className="settings-input"
            />
            
            <div className="test-block">
              <button 
                onClick={handleTest} 
                className="test-btn" 
                disabled={testStatus === 'testing' || !apiKey.trim()}
              >
                <Activity size={14} className={testStatus === 'testing' ? 'spin' : ''} /> 
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              
              {testStatus === 'success' && (
                <span className="status-text success-text">
                  <CheckCircle size={14} /> Valid Key
                </span>
              )}
              {testStatus === 'error' && (
                <span className="status-text error-text">
                  <AlertCircle size={14} /> Invalid Key
                </span>
              )}
            </div>
            
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
