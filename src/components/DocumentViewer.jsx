import { useState } from 'react';
import { FileText, LayoutList, Target, HelpCircle, Download, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';
import './DocumentViewer.css';

const UseCaseCard = ({ useCase }) => {
  const [expanded, setExpanded] = useState(false);
  const uc = typeof useCase === 'string' ? { title: useCase } : useCase;
  const isExpandable = uc.description || (uc.scenarios && uc.scenarios.length > 0);
  
  return (
    <div className={`use-case-card ${expanded && isExpandable ? 'use-case-expanded' : ''}`}>
      <div className="use-case-header" onClick={() => isExpandable && setExpanded(!expanded)} style={{ cursor: isExpandable ? 'pointer' : 'default' }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutList size={14} style={{ color: 'var(--accent-color)' }} />
          {uc.title || "Untitled Use Case"}
        </h4>
        {isExpandable && (
          <button className="icon-btn chevron-icon" style={{ padding: 0 }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      {expanded && isExpandable && (
        <div className="use-case-body fade-in-up">
          {uc.description && <p className="uc-desc">{uc.description}</p>}
          
          {uc.preconditions && uc.preconditions.length > 0 && (
            <div className="uc-list-group">
              <strong>Preconditions:</strong>
              <ul>
                {uc.preconditions.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          
          {uc.postconditions && uc.postconditions.length > 0 && (
            <div className="uc-list-group">
              <strong>Postconditions:</strong>
              <ul>
                {uc.postconditions.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
          
          {uc.scenarios && uc.scenarios.length > 0 && (
            <div className="uc-list-group">
              <strong>Scenarios:</strong>
              <ol className="scenario-list">
                {uc.scenarios.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function DocumentViewer({ document }) {
  const handleDownload = () => {
    generatePDFReport(document);
  };

  return (
    <div className="glass-panel document-pane fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileText size={22} color="var(--accent-color)" />
          <h2>Live Business Requirements Document</h2>
        </div>
        <button onClick={handleDownload} className="download-btn" title="Download Markdown Report">
          <Download size={18} />
        </button>
      </div>
      
      <div className="document-content">
        <div className="doc-section title-section">
          <h3>Project: {document.projectTitle}</h3>
          
          {document.actors && document.actors.length > 0 && (
            <div className="actors-container fade-in-up">
              <Users size={14} className="actors-icon" />
              <div className="actor-badges">
                {document.actors.map((actor, idx) => (
                  <span key={idx} className="actor-badge">{actor}</span>
                ))}
              </div>
            </div>
          )}
          <p className="doc-meta">Last updated: Just now • Version 0.1 draft</p>
          
          {/* Detail Score Indicator */}
          <div className="detail-indicator-container fade-in-up">
            <div className="detail-header">
              <span className="detail-label">Requirements Depth:</span>
              <span className="detail-status" style={{ color: document.detailScore >= 80 ? '#22c55e' : '#eab308' }}>
                {document.detailScore >= 80 ? 'Detailed Enough' : 'Requires More Detail'} ({document.detailScore || 0}%)
              </span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${document.detailScore || 0}%`, 
                  background: (document.detailScore || 0) >= 80 ? '#22c55e' : ((document.detailScore || 0) >= 50 ? '#eab308' : '#ef4444') 
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="doc-section">
          <div className="section-header">
            <Target size={18} />
            <h3>Business Requirements</h3>
          </div>
          {document.requirements && document.requirements.length > 0 ? (
          <ul className="req-list fade-in-up" style={{ animationDelay: '0.2s' }}>
            {document.requirements.map((req, index) => {
              const isNFR = req.match(/\[?NFR\]?/i) || req.toLowerCase().includes('non-functional');
              const isFR = req.match(/\[?FR\]?/i) || req.toLowerCase().includes('functional') || !isNFR;
              
              let highlightClass = isNFR ? 'req-nfr' : 'req-fr';
              let displayReq = req.replace(/\[?(NFR|FR)\]?:?\s*/i, '');
              
              return (
                <li key={index} className={highlightClass}>
                  <Target size={14} className="req-icon" />
                  <span className="req-text-content">
                    <strong>{isNFR ? 'NFR' : 'FR'}:</strong> {displayReq}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
            <div className="empty-state">No requirements identified yet. Chat with the agent to start building.</div>
          )}
        </div>

        <div className="doc-section">
          <div className="section-header">
            <LayoutList size={18} />
            <h3>Use Cases</h3>
          </div>
          {document.useCases && document.useCases.length > 0 ? (
            <div className="use-case-list fade-in-up" style={{ animationDelay: '0.3s' }}>
              {document.useCases.map((uc, index) => (
                <UseCaseCard key={index} useCase={uc} />
              ))}
            </div>
          ) : (
            <div className="empty-state">No use cases generated yet.</div>
          )}
        </div>

        {document.clarifyingQuestions && document.clarifyingQuestions.length > 0 && (
          <div className="doc-section compact-questions fade-in-up">
            <div className="section-header">
              <HelpCircle size={16} color="#eab308" />
              <h3 style={{ fontSize: '1rem', color: '#eab308', margin: 0 }}>Clarification Needed</h3>
            </div>
            <ul className="compact-q-list">
              {document.clarifyingQuestions.map((q, i) => (
                <li key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
