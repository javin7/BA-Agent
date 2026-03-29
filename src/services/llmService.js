/**
 * Service to communicate with OpenRouter API
 */

export async function generateDocumentUpdate(messages, currentDocument) {
  const apiKey = "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";

  const systemInstruction = `You are an expert digital Business Analyst helping a user define a software project.
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

  // Format the conversation history for OpenRouter
  // Role mapping: 'agent' -> 'assistant', 'user' -> 'user'
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'agent' ? 'assistant' : 'user',
    content: msg.content
  }));

  // Append a final user message giving the current state to force the context
  formattedMessages.push({
    role: 'user',
    content: `Here is the current document state:\n${JSON.stringify(currentDocument, null, 2)}\n\nPlease provide the updated JSON response.`
  });

  const requestBody = {
    model: "google/gemini-2.5-flash", // Fast, json-friendly, smart model available on OpenRouter
    messages: [
      { role: "system", content: systemInstruction },
      ...formattedMessages
    ],
    response_format: { type: "json_object" },
    temperature: 0.2
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "BA Agent",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  let jsonString = data.choices[0].message.content.trim();

  // Strip potential markdown code block wrappers if the model ignores the instruction
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  return JSON.parse(jsonString);
}
