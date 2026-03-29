import { useState } from 'react'
import './index.css'
import './App.css'
import { useAgentLogic } from './hooks/useAgentLogic'
import ChatInterface from './components/ChatInterface'
import DocumentViewer from './components/DocumentViewer'
import SettingsModal from './components/SettingsModal'

function App() {
  const { messages, document, sendMessage, isTyping } = useAgentLogic();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="app-container">
      <DocumentViewer 
        document={document} 
      />
      <ChatInterface 
        messages={messages} 
        onSendMessage={sendMessage} 
        isTyping={isTyping} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  )
}

export default App
