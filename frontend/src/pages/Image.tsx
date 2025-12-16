import React, { useState } from 'react';
import { Upload, BotMessageSquare, Send, Loader2, ArrowLeft, BookText, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

// Define a type for our chat messages
type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
};

// Define types for the different views
type ViewState = 'initial' | 'processing' | 'results';

export const ImageToNotesPage: React.FC = () => {
  const [view, setView] = useState<ViewState>('initial');
  const [fileName, setFileName] = useState<string>('');
  const [formattedNotes, setFormattedNotes] = useState<string>('');
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  
  // New State for Copy Feedback
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setView('processing');
    setFormattedNotes('');

    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      const API_BASE=import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_BASE}/api/ai/image-to-notes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process image");
      
      setFormattedNotes(data.formatted_notes);
      // We ignore data.raw_text now since we removed that tab
      
      setView('results');
      toast.success("Notes generated successfully!");

    } catch (error: any) {
      console.error("Processing Error:", error);
      toast.error(error.message || "Something went wrong");
      setTimeout(() => setView('initial'), 2000);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput(''); 

    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsAiTyping(true);

    try {
      const token = localStorage.getItem("token");
      const API_BASE=import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          context: formattedNotes || "No notes available."
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't connect to the AI." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleReset = () => {
    setView('initial');
    setFileName('');
    setFormattedNotes('');
    setChatMessages([]);
  };

  // --- Copy Handler ---
  const handleCopy = () => {
    if (!formattedNotes) return;
    
    navigator.clipboard.writeText(formattedNotes);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#311b4b] to-[#0c0a09] items-center justify-center p-4 sm:p-6 text-white font-sans relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute pt-15 top-6 left-6 flex items-center gap-2 text-white hover:text-purple-300 transition z-10"
      >
        <ArrowLeft className="w-8 h-8" />
        <span className="text-xl">Back</span>
      </button>

      {view === 'initial' && (
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            AI Image-to-Notes Converter
          </h1>
          <p className="text-purple-200 mb-8">Upload a picture of a whiteboard or notes, and let AI do the rest.</p>

          <label className="w-full max-w-lg mx-auto border-2 border-dashed border-purple-400 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-950/30 transition">
            <Upload className="w-12 h-12 mb-3 text-purple-300" />
            <p className="mb-2 font-semibold">Click or Drag to Upload</p>
            <p className="text-sm text-purple-400">JPG, PNG, WEBP</p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {view === 'processing' && (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">AI is working its magic...</h2>
          <p className="text-purple-300">Analyzing, converting, and formatting your image <span className="font-semibold text-purple-100">{fileName}</span>.</p>
        </div>
      )}

      {view === 'results' && (
        <div className="w-full h-full flex flex-col max-w-7xl mx-auto pt-16 lg:pt-0">
          <div className="flex items-center mb-6">
            <button onClick={handleReset} className="flex items-center gap-2 text-white hover:text-purple-300 transition mr-6">
              <ArrowLeft className="w-5 h-5" />
              <span>New Image</span>
            </button>
            <h2 className="text-xl font-semibold text-white truncate">Results for: <span className="text-purple-300">{fileName}</span></h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0">
            
            {/* Left Panel: Formatted Notes Only */}
            <div className="w-full lg:w-3/5 flex flex-col bg-slate-900/50 border border-purple-600/30 rounded-2xl shadow-lg">
              
              {/* Header with Title and Copy Button */}
              <div className="flex justify-between items-center border-b border-purple-600/30 p-4">
                  <div className="flex items-center gap-2 text-purple-200 font-semibold">
                      <BookText className="w-5 h-5 text-purple-400" />
                      Formatted Notes
                  </div>

                  {/* Copy Button */}
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-900/50 hover:bg-purple-800 border border-purple-500/50 rounded-lg text-purple-200 transition-all"
                    title="Copy Content"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow">
                  <div className="prose prose-invert max-w-none text-purple-100 text-sm">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-pink-400 mt-4 mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-purple-300 mt-3 mb-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                        li: ({ node, ...props }) => <li className="text-purple-100/90" {...props} />,
                      }}
                    >
                      {formattedNotes}
                    </ReactMarkdown>
                  </div>
              </div>
            </div>

            {/* Right Panel: Chat */}
            <div className="w-full lg:w-2/5 flex flex-col bg-slate-900/50 border border-purple-600/30 rounded-2xl shadow-lg p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 p-2">
                <BotMessageSquare className="w-6 h-6 text-purple-300" />
                Chat with your Notes
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950/40 rounded-lg min-h-[200px] lg:min-h-0">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.sender === 'user' ? 'bg-purple-600 ml-auto' : 'bg-gray-700 mr-auto'}`}>
                    {/* Render Chat Markdown */}
                    <ReactMarkdown
                        components={{
                            p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                            code: ({node, ...props}) => <code className="bg-black/30 px-1 rounded text-xs font-mono" {...props} />
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                  </div>
                ))}
                {isAiTyping && <div className="p-3 rounded-lg max-w-[85%] bg-gray-700 mr-auto text-sm animate-pulse">Thinking...</div>}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};