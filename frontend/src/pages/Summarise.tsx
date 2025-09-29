import { useState } from "react";
import { Upload, FileText, Loader2, Send ,ArrowLeft} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Summarise() {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const navigate = useNavigate();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      setSummary(
        "This is a dummy AI-generated summary. Once backend is connected, the uploaded PDF/DOCX/TXT will be processed and summarized here."
      );
      setLoading(false);
    }, 2000);
  };

  const handleChatToggle = () => {
    setChatOpen((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "This is a dummy response to your question about the PDF." },
      ]);
    }, 1000);

    setUserInput("");
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-[#020617] bg-[radial-gradient(ellipse_at_top,_#2d0d4a,_transparent_70%),radial-gradient(ellipse_at_bottom,_#1a0b2e,_transparent_80%)]  items-center text-white">
        <div className="flex items-center">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 pt-15 flex items-center gap-2 text-white hover:text-purple-300 text-xl">
                <ArrowLeft className="w-6 h-6" />
                <span>Back</span>
            </button>
            {/* Title */}
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

      {/* Chat with PDF Button */}
      <button
        onClick={handleChatToggle}
        disabled={!fileName}
        className="mt-6 bg-purple-600 hover:bg-purple-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20  duration-300 disabled:opacity-50 px-5 py-2 rounded-xl shadow-md transition text-white"
      >
        {chatOpen ? "Close Chat" : "Chat with PDF"}
      </button>

      {/* Generated Summary */}
      <div className="w-full max-w-xl mt-8 bg-purple-950/40 border border-purple-500 rounded-2xl p-6 shadow-lg">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
          <FileText className="w-5 h-5 text-purple-300" />
          AI Generated Summary
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-purple-300">
            <Loader2 className="animate-spin w-5 h-5" />
            Summarizing...
          </div>
        ) : (
          <p className="text-purple-100 leading-relaxed">
            {summary || "Upload a PDF, DOCX, or TXT file to get started."}
          </p>
        )}
      </div>

      {/* Chatbox */}
      {chatOpen && (
        <div className="w-full max-w-xl mt-6 bg-purple-950/50 border border-purple-500 rounded-2xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">💬 Chat with PDF</h2>
          <div className="flex-1 max-h-60 overflow-y-auto space-y-2 p-2 bg-purple-950/40 rounded-lg">
            {chatMessages.length === 0 && (
              <p className="text-sm text-purple-400">Ask anything about your PDF...</p>
            )}
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-purple-600 ml-auto text-right"
                    : "bg-purple-800 mr-auto text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 rounded-lg bg-purple-900 border border-purple-600 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
