import React, { useState, useEffect, useRef } from 'react';
import { Upload, Mic, Square, BotMessageSquare, Send, Loader2, ArrowLeft, BookText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- WORKER CODE ---
const WORKER_CODE = `
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/';

class PipelineSingleton {
    static task = 'automatic-speech-recognition';
    static model = 'Xenova/whisper-tiny';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const { audio } = event.data;
    try {
        const transcriber = await PipelineSingleton.getInstance((data) => {
            self.postMessage({ status: 'progress', ...data });
        });

        const output = await transcriber(audio, {
            chunk_length_s: 30,
            stride_length_s: 5,
        });

        self.postMessage({ status: 'complete', output });
    } catch (error) {
        self.postMessage({ status: 'error', error: error.message });
    }
});
`;

type ChatMessage = { sender: 'user' | 'ai'; text: string; };
type ViewState = 'initial' | 'processing' | 'results';
type TabState = 'summary' | 'minutes';

export const TranscribePage: React.FC = () => {
  const [view, setView] = useState<ViewState>('initial');
  const [fileName, setFileName] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabState>('summary');
  const [summary, setSummary] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [statusText, setStatusText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  
  const worker = useRef<Worker | null>(null);
  const navigate = useNavigate();

  // 1. INITIALIZE WORKER
  useEffect(() => {
    if (!worker.current) {
      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      worker.current = new Worker(workerUrl, { type: 'module' });
    }

    const onMessageReceived = (e: MessageEvent) => {
      const { status, output, progress, error } = e.data;
      
      if (status === 'progress') {
        setStatusText(`AI Model working... ${Math.round(progress || 0)}%`);
      } 
      else if (status === 'complete') {
        // --- SAFEGUARD: Handle output format ---
        const text = typeof output === 'string' ? output : output.text;
        
        console.log("Transcribed Text:", text); // DEBUG LOG

        if (!text || text.trim().length === 0) {
            setMinutes("(No speech detected in audio file)");
            setSummary("Could not generate summary because the audio file appeared to be silent.");
            setView('results');
            return;
        }

        setMinutes(text);
        setStatusText("Generating Summary...");
        generateSummary(text);
      } 
      else if (status === 'error') {
        console.error("Worker Error:", error);
        setStatusText("Transcription Failed: " + error);
      }
    };

    worker.current.addEventListener('message', onMessageReceived);
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  }, []);

  // 2. BACKEND SUMMARY CALL (With Better Error Handling)
  const generateSummary = async (text: string) => {
    try {
      const token = localStorage.getItem("token");
      
      console.log("Sending to backend:", { text }); // DEBUG LOG

      const response = await fetch('http://localhost:5000/api/ai/transcribe', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ text: text }) // Ensure key matches backend expectation
      });

      const data = await response.json();
      
      if (response.ok) {
        setSummary(data.summary);
        setView('results');
      } else {
         console.error("Backend Error Response:", data);
         setStatusText(`Server Error: ${data.error || "Unknown error"}`);
         // Still show results so user can see the transcript at least
         setSummary("Failed to generate summary. Please check backend logs.");
         setView('results');
      }
    } catch (error) {
      console.error("Network Error:", error);
      setStatusText("Could not connect to server.");
    }
  };

  // 3. HANDLERS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setView('processing');
    setStatusText("Decoding Audio...");

    try {
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const audioData = audioBuffer.getChannelData(0);
        
        worker.current?.postMessage({ audio: audioData });
    } catch (err) {
        console.error("Audio Decoding Error:", err);
        setStatusText("Failed to decode audio file.");
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages: ChatMessage[] = [...chatMessages, { sender: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsAiTyping(true);
    try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ context: minutes, message: userInput })
        });
        const data = await response.json();
        setIsAiTyping(false);
        setChatMessages(prev => [...prev, { sender: 'ai', text: response.ok ? data.reply : "Error: " + data.error }]);
    } catch (error) {
        setIsAiTyping(false);
        setChatMessages(prev => [...prev, { sender: 'ai', text: "Connection failed." }]);
    }
  };

  const handleReset = () => {
    setView('initial');
    setFileName('');
    setSummary('');
    setMinutes('');
    setChatMessages([]);
  };

  const handleRecordToggle = () => setIsRecording(!isRecording);

  // 4. RENDER
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1e1b4b] to-[#0c0a09] items-center justify-center p-4 sm:p-6 text-white font-sans relative">
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-purple-300 transition z-10">
        <ArrowLeft className="w-8 h-8" />
        <span className="text-xl">Back</span>
      </button>

      {view === 'initial' && (
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">AI Transcriber</h1>
          <p className="text-purple-200 mb-8">Upload audio to transcribe (in-browser) & summarize.</p>
          <div className="flex flex-col md:flex-row gap-6">
            <label className="flex-1 border-2 border-dashed border-purple-400 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-950/30 transition">
              <Upload className="w-12 h-12 mb-3 text-purple-300" />
              <p className="mb-2 font-semibold">Click to Upload</p>
              <p className="text-sm text-purple-400">MP3, WAV</p>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <div className="flex-1 border-2 border-dashed border-purple-400 rounded-2xl p-10 flex flex-col items-center justify-center">
              <button onClick={handleRecordToggle} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'}`}>
                {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
              </button>
              <p className="mt-4 font-semibold">{isRecording ? 'Recording...' : 'Record Live Audio'}</p>
            </div>
          </div>
        </div>
      )}

      {view === 'processing' && (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing...</h2>
          <p className="text-purple-300 font-mono animate-pulse">{statusText}</p>
        </div>
      )}

      {view === 'results' && (
        <div className="w-full h-full flex flex-col max-w-7xl mx-auto pt-16 lg:pt-0">
          <div className="flex items-center mb-6">
            <button onClick={handleReset} className="flex items-center gap-2 text-white hover:text-purple-300 transition mr-6">
              <ArrowLeft className="w-5 h-5" />
              <span>New Transcription</span>
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 flex-grow">
            <div className="w-full lg:w-3/5 flex flex-col bg-slate-900/50 border border-purple-600/30 rounded-2xl shadow-lg">
              <div className="flex border-b border-purple-600/30">
                <button onClick={() => setActiveTab('summary')} className={`flex-1 p-4 font-semibold ${activeTab === 'summary' ? 'bg-purple-600/30' : ''}`}>
                   <div className="flex items-center justify-center gap-2"><BookText className="w-4 h-4"/> AI Summary</div>
                </button>
                <button onClick={() => setActiveTab('minutes')} className={`flex-1 p-4 font-semibold ${activeTab === 'minutes' ? 'bg-purple-600/30' : ''}`}>
                   <div className="flex items-center justify-center gap-2"><Clock className="w-4 h-4"/> Transcript</div>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <p className="text-purple-100 whitespace-pre-wrap leading-relaxed">
                    {activeTab === 'summary' ? summary : minutes}
                </p>
              </div>
            </div>
            <div className="w-full lg:w-2/5 flex flex-col bg-slate-900/50 border border-purple-600/30 rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BotMessageSquare className="w-5 h-5 text-purple-400"/> Chat with Context
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950/40 rounded-lg min-h-[300px] max-h-[50vh]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg max-w-[85%] ${msg.sender === 'user' ? 'bg-purple-600 ml-auto' : 'bg-gray-700 mr-auto'}`}>{msg.text}</div>
                ))}
                {isAiTyping && <div className="text-gray-400 text-sm ml-2 animate-pulse">AI is typing...</div>}
              </div>
              <div className="mt-4 flex gap-3">
                <input value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-purple-700" placeholder="Ask anything..." />
                <button onClick={handleSendMessage} className="bg-purple-600 p-3 rounded-lg"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};