import { useState } from "react";
import { Upload, FileText, Loader2, Send, ArrowLeft, Copy, Check } from "lucide-react"; // Import Copy & Check
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown"; 

export function Summarise() {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const API_BASE=import.meta.env.VITE_API_URL;
  
  // New State for Copy Feedback
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();

  // ... (handleUpload logic remains the same) ...
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);
    try{
      const token=localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/ai/summarize`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData, 
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to summarize");
      setSummary(data.summary);
      toast.success("Summary generated!");
    }catch(err:any){
      console.error(err);
      toast.error("Error generating summary.");
      setSummary("Could not generate summary. Please try again.");
    }finally{
      setLoading(false);
    }
  };

  const handleChatToggle = () => {
    setChatOpen((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput(""); 
    
    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsChatLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          context: summary || "No document context provided.", 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setChatMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);

    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: "ai", text: "Sorry, I couldn't connect to the AI." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- NEW: Handle Copy to Clipboard ---
  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Copied to clipboard!");
    
    // Reset icon after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-[#020617] bg-[radial-gradient(ellipse_at_top,_#2d0d4a,_transparent_70%),radial-gradient(ellipse_at_bottom,_#1a0b2e,_transparent_80%)] items-center text-white pb-20">
        <div className="flex items-center">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 pt-15 flex items-center gap-2 text-white hover:text-purple-300 text-xl">
                <ArrowLeft className="w-6 h-6" />
                <span>Back</span>
            </button>
            <h1 className="text-3xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold mb-6">
                ✨ AI Summarizer
            </h1>
        </div>

      {/* Upload Box */}
      <label className="w-full max-w-xl border-2 border-dashed border-purple-400 rounded-2xl p-10 flex flex-col items-center cursor-pointer hover:bg-purple-950/30 transition relative">
        {!fileName ? (
          <>
            <Upload className="w-12 h-12 mb-3 text-purple-300" />
            <p className="mb-2">Drag & drop file here or click to upload</p>
            <p className="text-sm text-purple-400">Supported formats: PDF · DOCX · TXT</p>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <FileText className="w-12 h-12 mb-2 text-cyan-400" />
            <p className="font-medium">{fileName}</p>
          </div>
        )}
        <input type="file" accept=".pdf,.docx,.txt" onChange={handleUpload} className="hidden" />
      </label>

      {/* Chat Button */}
      <button
        onClick={handleChatToggle}
        disabled={!fileName}
        className="mt-6 bg-purple-600 hover:bg-purple-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 duration-300 disabled:opacity-50 px-5 py-2 rounded-xl shadow-md transition text-white"
      >
        {chatOpen ? "Close Chat" : "Chat with PDF"}
      </button>

      {/* --- MARKDOWN SUMMARY SECTION (WIDER & TALLER) --- */}
      {/* Changed max-w-xl to max-w-4xl for more width */}
      <div className="w-full max-w-4xl mt-8 bg-purple-950/40 border border-purple-500 rounded-2xl p-8 shadow-lg min-h-[300px]">
        
        {/* Header with Title and Copy Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/30">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
                <FileText className="w-5 h-5 text-purple-300" />
                AI Generated Summary
            </h2>

            {/* Copy Button */}
            {summary && !loading && (
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-900/50 hover:bg-purple-800 border border-purple-500/50 rounded-lg text-purple-200 transition-all"
                    title="Copy to Clipboard"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                </button>
            )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-purple-300">
            <Loader2 className="animate-spin w-8 h-8" />
            <p className="animate-pulse">Analyzing document...</p>
          </div>
        ) : (
          <div className="text-purple-100 leading-relaxed text-sm">
            {summary ? (
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-pink-400 mt-6 mb-3 border-b border-pink-500/30 pb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-purple-300 mt-5 mb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-purple-200 mt-4 mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 my-3" {...props} />,
                  li: ({node, ...props}) => <li className="text-purple-100/90 pl-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-7 text-base" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 py-1 my-4 bg-purple-900/20 italic text-purple-200" {...props} />,
                }}
              >
                {summary}
              </ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 italic">
                  <p>Upload a PDF, DOCX, or TXT file to generate a summary.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chatbox */}
      {chatOpen && (
        <div className="w-full max-w-4xl mt-6 bg-purple-950/50 border border-purple-500 rounded-2xl p-4 flex flex-col shadow-2xl">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span>💬</span> Chat with Document
          </h2>
          
          <div className="flex-1 h-96 overflow-y-auto space-y-3 p-4 bg-black/20 rounded-xl mb-4 custom-scrollbar">
            {chatMessages.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  Ask anything about the summary above...
              </div>
            )}
            
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-purple-600 ml-auto text-white rounded-br-none"
                    : "bg-slate-800 mr-auto text-slate-200 rounded-bl-none border border-slate-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
            
            {isChatLoading && (
              <div className="bg-slate-800 mr-auto p-3 rounded-2xl rounded-bl-none w-fit border border-slate-700">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-purple-500/30">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question about the document..."
              className="flex-1 px-4 py-2.5 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isChatLoading}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 p-2.5 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
}