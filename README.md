# Sheep goes BA 🤖💼

**Sheep goes BA** is a sleek, AI-powered digital assistant built to help software teams, founders, and product managers effortlessly scope out applications. 

By simply chatting with the agent in plain English, it dynamically synthesizes your thoughts into a formal, structured **Business Requirements Document (BRD)** and a highly granular list of **Use Cases**—complete with intelligent clarifying questions to ensure your project scope is watertight.

## 🌟 Key Features

*   **FURPS+ Categorization Engine**: Automatically detects and classifies project needs directly against the strict FURPS+ industry framework (Functional, Usability, Reliability, Performance, Security, and Additional Constraints) color-coded seamlessly in the UI.
*   **Granular Use Cases**: Automatically splits overarching business flows into discrete, highly structured scenarios with explicit pre-conditions and post-conditions. Dive deep into any Use Case via the fully responsive waterfall masonry layout!
*   **Smart Document Ingestion**: Seamlessly upload `.pdf`, `.txt`, and `.docx` files securely into the chat. The app relies on locally mounted pure JS parsers (`mammoth`, `pdfjs-dist`) to rapidly extract contextual documentation locally without hitting an external server.
*   **Vector-Perfect PDF Exports**: Forget messy plaintext files. Download your completely mapped BRD as a beautifully paginated, intelligently formatted PDF dynamically generated entirely inside your browser via `pdfmake`.
*   **Requirements Depth Score**: A built-in mathematical progress bar evaluates how well-defined your project scope is in real-time (0% to 100%).
*   **Bring-Your-Own-LLM**: Direct integrations natively bridging **Google Gemini, OpenAI ChatGPT, Anthropic Claude, OpenRouter, and GitHub Copilot Models**. 
*   **Premium UI**: A polished, dark-mode, glassmorphic aesthetic constructed with purely unbloated Vanilla CSS.

## 🛠 Tech Stack

*   **Frontend Framework:** React 19 + Vite
*   **Styling:** Vanilla CSS (CSS Variables, Flexbox, Masonry Layouts, Glassmorphism)
*   **PDF Generation:** `pdfmake`
*   **File Parsing:** `mammoth` (DOCX), `pdfjs-dist` (PDF Worker Pipeline)
*   **Icons:** Lucide-React
*   **AI Routing:** Pure HTTP REST abstractions dynamically standardizing multi-provider payloads.

## 🚀 Getting Started

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
Click on the **Settings Gear** icon in the chat header, securely select your preferred AI provider (e.g., Google or OpenAI), and input your API key. It features a live ping tester and will be natively stored in your browser's local storage for total privacy.

## 📁 Project Structure

- `/src/components/ChatInterface.jsx`: The conversational AI pane tracking chat loops and file uploads.
- `/src/components/DocumentViewer.jsx`: The real-time visual parsing pane generating the masonry layouts.
- `/src/components/SettingsModal.jsx`: The multi-provider LLM Configuration terminal.
- `/src/hooks/useAgentLogic.js`: Manages standard state, history arrays, and deep document syncing.
- `/src/services/llmService.js`: The central REST provider handling unified JSON schemas from all top LLM models.
- `/src/utils/pdfGenerator.js`: The declarative compiler building vector PDFs.
- `/src/utils/fileParser.js`: Worker abstraction for cleanly unpacking documents natively.

