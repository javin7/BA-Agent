import { useState } from 'react'
import './index.css'
import './App.css'
import { useAgentLogic } from './hooks/useAgentLogic'
import ChatInterface from './components/ChatInterface'
import DocumentViewer from './components/DocumentViewer'

function App() {
  const { messages, document, sendMessage, isTyping } = useAgentLogic();

  return (
    <div className="app-container">
      <ChatInterface 
        messages={messages} 
        onSendMessage={sendMessage} 
        isTyping={isTyping} 
      />
      <DocumentViewer 
        document={document} 
      />
    </div>
  )
}

export default App
