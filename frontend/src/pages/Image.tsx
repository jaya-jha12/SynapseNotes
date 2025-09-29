import React, { useState } from 'react';
import { Upload, BotMessageSquare, Send, Loader2, ArrowLeft, BookText, Pilcrow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define a type for our chat messages
type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
};

// Define types for the different views
type ViewState = 'initial' | 'processing' | 'results';
type TabState = 'notes' | 'text';

export const ImageToNotesPage: React.FC = () => {
  const [view, setView] = useState<ViewState>('initial');
  const [fileName, setFileName] = useState<string>('');
  const [formattedNotes, setFormattedNotes] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabState>('notes');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    processImage();
  };

  const processImage = () => {
    setView('processing');
    
    // Simulate AI processing delay
    setTimeout(() => {
      setFormattedNotes(
        `### Key Concepts from Whiteboard ###
* **Neural Networks:**
    * Consist of layers: Input, Hidden, and Output.
    * Activation functions (like ReLU, Sigmoid) introduce non-linearity.
* **Gradient Descent:**
    * An optimization algorithm used to minimize the loss function.
    * Calculates the gradient of the loss function with respect to the model's parameters.
* **Backpropagation:**
    * The method for efficiently computing gradients in a neural network.`
      );
      setExtractedText(
        "neural networks -> input/hidden/output layers\n- activation funcs (ReLU, Sigmoid)\n\nGRADIENT DESCENT\n- minimize loss\n- find gradient\n\nBACKPROPAGATION\n<- efficient gradient calc"
      );
      setView('results');
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessages: ChatMessage[] = [...chatMessages, { sender: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsAiTyping(false);
      setChatMessages(prev => [...prev, { sender: 'ai', text: "This is a dummy AI response about your uploaded notes." }]);
    }, 1500);
  };

  const handleReset = () => {
    setView('initial');
    setFileName('');
    setFormattedNotes('');
    setExtractedText('');
    setChatMessages([]);
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
          
          {/* Upload Box */}
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
            {/* Left Panel: Formatted Notes & Extracted Text */}
            <div className="w-full lg:w-3/5 flex flex-col bg-slate-900/50 border border-purple-600/30 rounded-2xl shadow-lg">
              <div className="flex border-b border-purple-600/30">
                <button onClick={() => setActiveTab('notes')} className={`flex-1 p-4 font-semibold transition flex items-center justify-center gap-2 ${activeTab === 'notes' ? 'bg-purple-600/30 text-white' : 'text-purple-300 hover:bg-purple-900/40'}`}>
                  <BookText className="w-5 h-5" /> Formatted Notes
                </button>
                <button onClick={() => setActiveTab('text')} className={`flex-1 p-4 font-semibold transition flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-purple-600/30 text-white' : 'text-purple-300 hover:bg-purple-900/40'}`}>
                  <Pilcrow className="w-5 h-5" /> Extracted Text
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow">
                {activeTab === 'notes' ? (
                  <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">{formattedNotes}</p>
                ) : (
                  <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">{extractedText}</p>
                )}
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
                  <div key={i} className={`p-3 rounded-lg max-w-[85%] ${msg.sender === 'user' ? 'bg-purple-600 ml-auto' : 'bg-gray-700 mr-auto'}`}>
                    {msg.text}
                  </div>
                ))}
                {isAiTyping && <div className="p-3 rounded-lg max-w-[85%] bg-gray-700 mr-auto">...</div>}
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

