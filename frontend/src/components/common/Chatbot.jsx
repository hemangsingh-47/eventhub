import { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, X, Send, Bot, User, Brain, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { call: chatCall, loading } = useAI('chat');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem('eventhub_chat');
    if (saved) setChatHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // Save chat history
    localStorage.setItem('eventhub_chat', JSON.stringify(chatHistory));
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user', content: message, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');

    const result = await chatCall({ 
      message, 
      conversationHistory: chatHistory 
    });

    if (result?.response) {
      const botMsg = { role: 'bot', content: result.response, timestamp: new Date() };
      setChatHistory(prev => [...prev, botMsg]);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-700 transition-all hover:scale-105 active:scale-95 group relative"
        >
          <div className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-20"></div>
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="w-[360px] max-h-[500px] h-[80vh] bg-white rounded-3xl shadow-2xl border border-violet-100 flex flex-col overflow-hidden animate-premium-in">
          {/* Header */}
          <div className="p-4 bg-violet-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">EventBot</h3>
                <p className="text-[10px] text-violet-200 mt-0.5 leading-none">Powered by Claude</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setChatHistory([]); localStorage.removeItem('eventhub_chat'); }}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[var(--color-background)]">
            {chatHistory.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-violet-50">
                  <Sparkles className="w-6 h-6 text-violet-600" />
                </div>
                <h4 className="text-sm font-bold text-violet-900">How can I help today?</h4>
                <p className="text-[11px] text-violet-400 max-w-[200px] mx-auto mt-1">Ask me about upcoming events, your RSVPs, or event details!</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-violet-600 text-white rounded-tr-none' 
                    : 'bg-white text-violet-900 border border-violet-50 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-violet-50 flex gap-1 animate-premium-in shadow-sm">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-violet-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask something..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[var(--color-surface-tertiary)] text-xs font-semibold text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/10 transition-all border border-transparent focus:border-violet-200"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-violet-600 hover:text-violet-700 disabled:opacity-30 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const RefreshCw = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

export default Chatbot;
