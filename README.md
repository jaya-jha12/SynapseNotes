# 🧠 Synapse Notes

**Synapse Notes** is an intelligent, AI-powered note-taking application designed to streamline your study and workflow. It combines traditional organizational tools with cutting-edge generative AI to help you summarize, analyze, and interact with your content effortlessly.

---

## 🚀 Key Features

### 📂 Smart Organization
* **Folder Structure:** Create and manage folders to keep your work organized.
* **Note Management:** Create, edit, and store notes within specific folders for a clutter-free workspace.

### 🤖 AI-Powered Tools
Synapse Notes integrates powerful AI models to automate your note-taking:
* **📝 Summarizer:** Instantly generate structured bullet-point summaries from long text or PDF documents.
* **🖼️ Image to Notes:** Upload diagrams, slides, or handwritten notes, and the AI will analyze the visual content to generate structured study notes.
* **🎙️ Audio/Text Transcribe:** Efficiently processes and summarizes transcribed text into concise versions.

### ✍️ Advanced Editor & Chatbot
* **Rich Text Editor:** A robust editor allowing for detailed styling and formatting of your notes.
* **Sidekick Chatbot:** An integrated AI assistant living right beside your editor. Ask questions about your current note context or get clarifications without leaving the page.

### 🔐 Secure & Fast Access
* **Google Authentication:** Seamless and quick sign-in via Google for immediate access to your workspace.

### 📬 Contact Support
* **Integrated Contact Form:** Built with **Nodemailer** to ensure user feedback and queries are delivered directly to the administration.

---

## 🛠️ Tech Stack

### Frontend
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### AI & Cloud Services
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## 🧠 AI Models Used

This project utilizes specific state-of-the-art models for different tasks to ensure speed and accuracy:

| Feature | Model / Service | Purpose |
| :--- | :--- | :--- |
| **Summarizer** | `Qwen/Qwen2.5-72B-Instruct` | Generates deep, structured summaries of complex texts and PDFs. |
| **Chatbot Assistant** | `Qwen/Qwen2.5-72B-Instruct` | Powers the side-chat for answering user queries with high intelligence. |
| **Chatbot (Backup)** | `microsoft/Phi-3-mini-4k-instruct` | Lightweight fallback model to ensure the chat never goes offline. |
| **Image to Notes** | `meta-llama/llama-4-scout-17b-16e-instruct` | Vision model (via Groq) used to analyze images and diagrams. |
| **Quick Transcribe** | `sshleifer/distilbart-cnn-12-6` | Used for fast, concise summarization of shorter text blocks. |

---

## 📦 Getting Started

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/synapse-notes.git](https://github.com/yourusername/synapse-notes.git)
    cd synapse-notes
    ```

2.  **Install dependencies**
    *Frontend:*
    ```bash
    cd frontend
    npm install
    ```
    *Backend:*
    ```bash
    cd backend
    npm install
    ```
3.  **Set up Environment Variables**

    **Backend (.env)**
    Create a `.env` file in the `backend` folder:
    ```env
    PORT=5000
    DATABASE_URL="your_database_url"
    JWT_SECRET="your_secret_key"
    HF_ACCESS_TOKEN="your_hugging_face_token"
    GROQ_API_KEY="your_groq_api_key"
    EMAIL_USER="your_email@gmail.com"
    EMAIL_PASS="your_app_password"
    ```

    **Frontend (.env)**
    Create a `.env` file in the `frontend` folder:
    ```env
    VITE_API_URL="http://localhost:5000"
    VITE_SUPABASE_URL="your_supabase_url"
    VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
    ```
4.  **Run the application**
    *Start Backend:*
    ```bash
    cd backend
    npm start
    ```
    *Start Frontend:*
    ```bash
    cd frontend
    npm run dev
    ```
