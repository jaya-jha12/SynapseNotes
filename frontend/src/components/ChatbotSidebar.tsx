import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

import {
    X,
    Send,
    Bot,
    User,
} from 'lucide-react';

interface Message {
    id: string;
    content: string;
    isBot: boolean;
    timestamp: Date;
}

interface ChatbotSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}


export const ChatbotSidebar: FC<ChatbotSidebarProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', content: "Hi! I'm Synapse AI. I can help you summarize content and answer questions about your notes. How can I assist?", isBot: true, timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getBotResponse = async (userMessage: string) => {
        // 1. Point to your Backend Route
        const apiUrl = 'http://localhost:5000/api/ai/chat';

        // 2. Get the Auth Token (Required by verifyToken middleware)
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send the token!
                },
                body: JSON.stringify({
                    // Your backend expects "message" and optional "context"
                    message: userMessage,
                    context: "User is asking a question via the sidebar chat."
                })
            });
            if (!response.ok) {
                throw new Error(`Server Error: ${response.statusText}`);
            }

            const result = await response.json();

            // 3. Return the clean reply from your backend
            return result.reply || "No response received.";

        } catch (error) {
            console.error("Chat API failed:", error);
            return "I'm having trouble connecting to the Synapse server right now.";
        }
    };
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = { id: Date.now().toString(), content: inputValue.trim(), isBot: false, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        const botResponseContent = await getBotResponse(userMessage.content);

        const botMessage: Message = { id: (Date.now() + 1).toString(), content: botResponseContent, isBot: true, timestamp: new Date() };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-[65px] h-[calc(100vh-65px)] w-90 bg-[#10101b] border-l border-slate-800 shadow-lg z-50 animate-slide-in">
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                            <img src='./logo.png' alt="logo" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-slate-100">Synapse AI</h3>
                            <p className="text-xs text-slate-400">Your Study Assistant</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-slate-800 flex items-center justify-center"><X className="h-4 w-4 text-purple-400" /></button>
                </div>

                <div ref={scrollAreaRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex items-start space-x-2 ${!message.isBot && 'flex-row-reverse space-x-reverse'}`}>
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.isBot ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                {message.isBot ? <Bot className="h-3 w-3 text-purple-400" /> : <User className="h-3 w-3" />}
                            </div>
                            <div className={`max-w-[80%]`}>
                                <div className={`p-3 rounded-lg ${message.isBot ? 'bg-slate-800 text-slate-200' : 'bg-purple-600 text-white'}`}>
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                <p className={`text-xs text-slate-500 mt-1 ${!message.isBot && 'text-right'}`}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-start space-x-2">
                            <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0"><Bot className="h-3 w-3" /></div>
                            <div className="p-3 rounded-lg bg-slate-800">
                                <div className="flex space-x-1">
                                    <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce" />
                                    <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                                    <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex space-x-2">
                        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me anything..." disabled={isTyping} className="flex-1 bg-slate-800 border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                        <button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center"><Send className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};