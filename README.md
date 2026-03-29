# Business Analyst Agent (BA Agent) 🤖💼

The **BA Agent** is a sleek, AI-powered digital assistant built to help software teams, founders, and product managers effortlessly scope out applications. 

By simply chatting with the agent in plain English, it dynamically synthesizes your thoughts into a formal, structured **Business Requirements Document (BRD)** and a list of **Use Cases**—complete with intelligent clarifying questions to ensure your project scope is watertight.

## Features ✨

*   **Conversational Interface**: Chat naturally with an AI expert.
*   **Live Synthesis Engine**: Watch your vague ideas turn into structured `Requirements`, `Use Cases`, and `Clarification Questions` in real-time.
*   **Requirements Depth Score**: A built-in progress bar that evaluates how well-defined your project is (0% to 100%).
*   **Markdown Report Export**: Download your completed specification directly to a beautifully formatted `.md` file.
*   **Premium UI**: A polished, dark-mode, glassmorphic aesthetic built with purely vanilla CSS. 
*   **Bring-Your-Own-LLM**: Direct integrations natively bridging **Google Gemini, OpenAI ChatGPT, Anthropic Claude, and GitHub Copilot Models**. 

## Tech Stack 🛠

*   **Frontend Framework:** React 19 + Vite
*   **Styling:** Vanilla CSS (CSS Variables, Flexbox, Glassmorphism)
*   **Icons:** Lucide-React
*   **AI Backend:** Pure HTTP REST fetches natively supporting multiple generic LLM endpoints.

## Getting Started 🚀

### 1. Installation

Clone this repository, then install the dependencies using NPM:

```bash
npm install
```

### 2. Run the Development Server

Start the local Vite development environment!

```bash
npm run dev
```

### 3. Configure the LLM

Open the application via your browser at `http://localhost:5173/`. 
Click on the **Settings Gear** icon in the chat header, select your AI provider (e.g., Google or OpenAI), and securely input your API key. It will be natively stored in your browser's local storage for your privacy.

## Project Structure 📁

- `/src/components/ChatInterface.jsx`: The conversational AI pane.
- `/src/components/DocumentViewer.jsx`: The real-time BRD parsing pane and Export module.
- `/src/components/SettingsModal.jsx`: The multi-provider LLM Configuration UI.
- `/src/hooks/useAgentLogic.js`: Manages the state, message history, and UI sync.
- `/src/services/llmService.js`: The dynamic REST provider routing intelligence node to ensure reliable JSON parsing from all top models.
