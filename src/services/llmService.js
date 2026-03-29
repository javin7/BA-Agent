/**
 * Service to communicate with multiple LLM APIs based on user settings
 */

const SYSTEM_INSTRUCTION = `You are an expert digital Business Analyst helping a user define a software project.
You will be provided with the current document state and the conversation history.
Your job is to analyze the user's latest input, respond conversationally, and update the formal document state.

CRITICAL: You MUST respond EXCLUSIVELY with a raw, valid JSON object matching the exact structure below. Do NOT use markdown code blocks (e.g., \`\`\`json). Just the raw JSON.

{
  "replyContent": "Your conversational reply acknowledging their input and asking clarifying questions.",
  "projectTitle": "A clear, concise title for the project",
  "requirements": ["REQ: ...", "REQ: ..."],
  "useCases": ["UC: ...", "UC: ..."],
  "clarifyingQuestions": ["Maximum 3 short questions if details are vague?"],
  "detailScore": <integer 0-100 indicating how detailed the requirements are>
}

Rules:
- Keep the replyContent conversational and encouraging.
- If detailScore is >= 90, set clarifyingQuestions to [].
- Append to the existing requirements/use cases rather than replacing them, unless the user explicitly wants to pivot.`;

const JSON_SCHEMA = {
  type: "object",
  properties: {
    replyContent: { type: "string" },
    projectTitle: { type: "string" },
    requirements: { type: "array", items: { type: "string" } },
    useCases: { type: "array", items: { type: "string" } },
    clarifyingQuestions: { type: "array", items: { type: "string" } },
    detailScore: { type: "integer" }
  },
  required: ["replyContent", "projectTitle", "requirements", "useCases", "clarifyingQuestions", "detailScore"]
};

export async function generateDocumentUpdate(messages, currentDocument) {
  const provider = localStorage.getItem('ba_agent_provider') || 'google';
  const apiKey = localStorage.getItem(`ba_agent_key_${provider}`);

  if (!apiKey) {
    throw new Error(`Missing API Key for ${provider}. Please configure it in Settings.`);
  }

  // Common formatted messages for OpenAI-like endpoints
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'agent' ? 'assistant' : 'user',
    content: msg.content
  }));

  const contextMessage = {
    role: 'user',
    content: `Here is the current document state:\n${JSON.stringify(currentDocument, null, 2)}\n\nPlease provide the updated JSON response.`
  };

  let jsonString = '';

  if (provider === 'google') {
    // Google Gemini API directly
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // Gemini has a specific content format
    const geminiContents = [...formattedMessages, contextMessage].map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: geminiContents,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: JSON_SCHEMA
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Google Gemini Error: ${response.statusText}`);
    const data = await response.json();
    jsonString = data.candidates[0].content.parts[0].text;

  } else if (provider === 'openai' || provider === 'github' || provider === 'openrouter') {
    // OpenAI, GitHub Models, and OpenRouter use the same chat-completions schema
    const endpoint = provider === 'openai' 
      ? 'https://api.openai.com/v1/chat/completions'
      : provider === 'github'
        ? 'https://models.inference.ai.azure.com/chat/completions'
        : 'https://openrouter.ai/api/v1/chat/completions';
    
    let model = 'gpt-4o-mini';
    if (provider === 'github') model = 'gpt-4o';
    if (provider === 'openrouter') model = 'google/gemini-2.5-flash';

    const payload = {
      model: model,
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...formattedMessages,
        contextMessage
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    };

    const fetchHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    if (provider === 'openrouter') {
      fetchHeaders["HTTP-Referer"] = "http://localhost:5173";
      fetchHeaders["X-Title"] = "BA Agent";
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`${provider} API Error: ${response.statusText}`);
    const data = await response.json();
    jsonString = data.choices[0].message.content;

  } else if (provider === 'anthropic') {
    // Anthropic API
    const endpoint = 'https://api.anthropic.com/v1/messages';
    
    // Convert history
    const anthropicMessages = [...formattedMessages, contextMessage];
    
    // Anthropic schema enforcement isn't baked into fetch natively via response_format 
    // without using tool use, but appending a strict prompt usually works for Claude 3.
    const payload = {
      model: "claude-3-haiku-20240307",
      system: SYSTEM_INSTRUCTION + "\n\nReturn EXACTLY and ONLY valid JSON.",
      messages: anthropicMessages,
      max_tokens: 1500,
      temperature: 0.2
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerously-allow-browser": "true"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const respData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic Error: ${respData.error?.message || response.statusText}`);
    }
    const data = await response.json();
    jsonString = data.content[0].text;
  }

  // Cleanup potential markdown fences
  jsonString = jsonString.trim();
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  return JSON.parse(jsonString);
}
