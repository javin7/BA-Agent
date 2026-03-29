import { useState } from 'react';
import { generateDocumentUpdate } from '../services/llmService';
import { parseFileText } from '../utils/fileParser';

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

  const sendMessage = async (text, attachedFile) => {
    let messageContent = text || '';
    let uiContent = text || '';

    if (attachedFile) {
      if (!text) {
          messageContent = `Please extract any software business requirements or use cases from the attached document: ${attachedFile.name}.`;
          uiContent = `[Attached File: ${attachedFile.name}]`;
      } else {
          uiContent = `${text}\n\n[Attached File: ${attachedFile.name}]`;
      }
      setIsTyping(true);
      try {
        const fileText = await parseFileText(attachedFile);
        messageContent += `\n\n[ATTACHED DOCUMENT: ${attachedFile.name}]\n${fileText}`;
      } catch (err) {
        console.error("Parse error:", err);
        const errorMsg = { id: (Date.now() + 1).toString(), role: 'agent', content: `Sorry, I couldn't read the attached file: ${err.message}` };
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: messageContent, uiContent: uiContent }, errorMsg]);
        setIsTyping(false);
        return;
      }
    }

    const newUserMsg = { id: Date.now().toString(), role: 'user', content: messageContent, uiContent: uiContent };
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
