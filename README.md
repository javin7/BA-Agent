# Business Analyst Agent (BA Agent) 🤖💼

The **BA Agent** is a sleek, AI-powered digital assistant built to help software teams, founders, and product managers effortlessly scope out applications. 

By simply chatting with the agent in plain English, it dynamically synthesizes your thoughts into a formal, structured **Business Requirements Document (BRD)** and a list of **Use Cases**—complete with intelligent clarifying questions to ensure your project scope is watertight.

## Features ✨

*   **Conversational Interface**: Chat naturally with an AI expert.
*   **Live Synthesis Engine**: Watch your vague ideas turn into structured `Requirements`, `Use Cases`, and `Clarification Questions` in real-time.
*   **Requirements Depth Score**: A built-in progress bar that evaluates how well-defined your project is (0% to 100%).
*   **Markdown Report Export**: Download your completed specification directly to a beautifully formatted `.md` file.
*   **Premium UI**: A polished, dark-mode, glassmorphic aesthetic built with purely vanilla CSS. 
*   **OpenRouter API Integration**: Fully wired up to query any top-tier LLM (currently configured for `google/gemini-2.5-flash`) via the robust OpenRouter gateway.

## Tech Stack 🛠

*   **Frontend Framework:** React 19 + Vite
*   **Styling:** Vanilla CSS (CSS Variables, Flexbox, Glassmorphism)
*   **Icons:** Lucide-React
*   **AI Backend:** OpenRouter API (Prompt engineered to enforce strict JSON structure outputs)

## Getting Started 🚀

### 1. Installation

Clone this repository, then install the dependencies using NPM:

```bash
npm install
```

### 2. Configure the LLM

This application connects to an LLM using the **OpenRouter API**. 
Ensure the API key is configured either in an environment variable or set directly in `src/services/llmService.js` (Note: In production builds, this should be moved to a secured backend layer).

If using `.env.local` (Recommended for local dev):
```env
VITE_OPENROUTER_API_KEY="your-openrouter-api-key"
```

### 3. Run the Development Server

Start the local Vite development environment!

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`. 

## Project Structure 📁

- `/src/components/ChatInterface.jsx`: The conversational AI pane.
- `/src/components/DocumentViewer.jsx`: The real-time BRD parsing pane and Export module.
- `/src/hooks/useAgentLogic.js`: Manages the state, message history, and UI sync.
- `/src/services/llmService.js`: The prompt engineering and OpenRouter API `fetch` connector ensuring structured JSON returns.



