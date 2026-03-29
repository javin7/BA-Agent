import { useState } from 'react';
import { generateDocumentUpdate } from '../services/llmService';

export function useAgentLogic() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'agent', content: 'Hello! I am your digital Business Analyst. What kind of application or project are we working on today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [document, setDocument] = useState({
    projectTitle: "Untitled Project",
    requirements: [],
    useCases: [],
    clarifyingQuestions: [],
    detailScore: 0
  });

  const sendMessage = async (text) => {
    const newUserMsg = { id: Date.now().toString(), role: 'user', content: text };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const llmResponse = await generateDocumentUpdate(updatedMessages, document);
      
      const newAgentMsg = { id: (Date.now() + 1).toString(), role: 'agent', content: llmResponse.replyContent };
      setMessages(prev => [...prev, newAgentMsg]);
      
      setDocument({
        projectTitle: llmResponse.projectTitle || document.projectTitle,
        requirements: llmResponse.requirements || document.requirements,
        useCases: llmResponse.useCases || document.useCases,
        clarifyingQuestions: llmResponse.clarifyingQuestions || [],
        detailScore: llmResponse.detailScore || document.detailScore
      });
    } catch (error) {
      console.error("Agent Error:", error);
      const errorMsg = { id: (Date.now() + 1).toString(), role: 'agent', content: "Failed to reach the intelligence node. Please check the network and API key." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, document, sendMessage, isTyping };
}
