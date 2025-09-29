import React, { useState } from 'react';
import { Upload, Mic, Square, BotMessageSquare, Send, Loader2, ArrowLeft, BookText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define a type for our chat messages
type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
};

// Define types for the different views
type ViewState = 'initial' | 'processing' | 'results';
type TabState = 'summary' | 'minutes';

export const TranscribePage: React.FC = () => {
  const [view, setView] = useState<ViewState>('initial');
  const [fileName, setFileName] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabState>('summary');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    processAudio();
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setFileName("Live Recording.wav");
      processAudio();
    } else {
      // Start recording
      setIsRecording(true);
      // In a real app, you would use the MediaRecorder API here.
    }
  };

  const processAudio = () => {
    setView('processing');
    
    // Simulate AI processing delay
    setTimeout(() => {
      setSummary(
        "This is a dummy AI-generated summary of the lecture. Key topics included the future of renewable energy, advancements in battery storage, and the economic impact of transitioning away from fossil fuels. The speaker emphasized the need for policy changes to accelerate the adoption of green technologies."
      );
      setMinutes(
        "• Introduction (0:00-2:15): Speaker introduced the topic.\n• Renewable Energy Trends (2:15-15:30): Discussion on solar and wind power growth.\n• Battery Technology (15:30-25:00): Deep dive into lithium-ion alternatives.\n• Economic Impact (25:00-35:45): Analysis of job creation and market shifts.\n• Q&A (35:45-45:00): Audience questions on policy and implementation."
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
      setChatMessages(prev => [...prev, { sender: 'ai', text: "This is a dummy AI response regarding your recording." }]);
    }, 1500);
  };

  const handleReset = () => {
    setView('initial');
    setFileName('');
    setSummary('');
    setMinutes('');
    setChatMessages([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1e1b4b] to-[#0c0a09] items-center justify-center p-4 sm:p-6 text-white font-sans relative">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 left-6 flex  pt-15 items-center gap-2 text-white hover:text-purple-300 transition z-10"
      >
        <ArrowLeft className="w-8 h-8" />
        <span className="text-xl">Back</span>
      </button>

      {view === 'initial' && (
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            AI Transcriber & Summarizer
          </h1>
          <p className="text-purple-200 mb-8">Upload a recording or record live to get instant summaries, meeting minutes, and insights.</p>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Upload Box */}
            <label className="flex-1 border-2 border-dashed border-purple-400 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-950/30 transition">
              <Upload className="w-12 h-12 mb-3 text-purple-300" />
              <p className="mb-2 font-semibold">Click or Drag to Upload</p>
              <p className="text-sm text-purple-400">MP3, WAV, MP4, M4A</p>
              <input type="file" accept="audio/*,video/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Record Button */}
            <div className="flex-1 border-2 border-dashed border-purple-400 rounded-2xl p-10 flex flex-col items-center justify-center">
              <button onClick={handleRecordToggle} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-700 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20'}`}>
                {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
              </button>
              <p className="mt-4 font-semibold">{isRecording ? 'Recording...' : 'Record Live Audio'}</p>
              <p className="text-sm text-purple-400">{isRecording ? 'Click to Stop' : 'Start a new recording'}</p>
            </div>
          </div>
        </div>
      )}

      {view === 'processing' && (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">AI is working its magic...</h2>
          <p className="text-purple-300">Transcribing, summarizing, and generating insights for <span className="font-semibold text-purple-100">{fileName}</span>.</p>
        </div>
      )}

      {view === 'results' && (
        <div className="w-full h-full flex flex-col max-w-7xl mx-auto pt-16 lg:pt-0">
          <div className="flex items-center mb-6">
            <button onClick={handleReset} className="flex items-center gap-2 text-white hover:text-purple-300 transition mr-6">
              <ArrowLeft className="w-5 h-5" />
              <span>New Transcription</span>
            </button>
            <h2 className="text-xl font-semibold text-white truncate">Results for: <span className="text-purple-300">{fileName}</span></h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0">
            {/* Left Panel: Summary & Minutes */}
            <div className="w-full lg:w-3/5 flex flex-col bg-slate-900/50 border border-purple-600/30 rounded-2xl shadow-lg">
              <div className="flex border-b border-purple-600/30">
                <button onClick={() => setActiveTab('summary')} className={`flex-1 p-4 font-semibold transition flex items-center justify-center gap-2 ${activeTab === 'summary' ? 'bg-purple-600/30 text-white' : 'text-purple-300 hover:bg-purple-900/40'}`}>
                  <BookText className="w-5 h-5" /> AI Summary
                </button>
                <button onClick={() => setActiveTab('minutes')} className={`flex-1 p-4 font-semibold transition flex items-center justify-center gap-2 ${activeTab === 'minutes' ? 'bg-purple-600/30 text-white' : 'text-purple-300 hover:bg-purple-900/40'}`}>
                  <Clock className="w-5 h-5" /> Recording Minutes
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow">
                {activeTab === 'summary' ? (
                  <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">{summary}</p>
                ) : (
                  <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">{minutes}</p>
                )}
              </div>
            </div>

            {/* Right Panel: Chat */}
            <div className="w-full lg:w-2/5 flex flex-col bg-slate-900/50 border border-purple-600/30 rounded-2xl shadow-lg p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 p-2">
                <BotMessageSquare className="w-6 h-6 text-purple-300" />
                Chat with your Recording
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

