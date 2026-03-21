import { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hi! I'm your EventHub Assistant. Looking for something specific or need a recommendation?" }] }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', parts: [{ text: input.trim() }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Gemini history must start with a 'user' message and alternate.
      // Our initial greeting is 'model', so we filter it out for the API call.
      const history = messages
        .filter((_, index) => index > 0 || messages[0].role === 'user')
        .map(m => ({
          role: m.role,
          parts: m.parts
        }));

      const { data } = await api.post('/ai/chat', { 
        message: userMessage.parts[0].text,
        history: history
      });

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-2xl border border-[var(--color-border)] flex flex-col transition-all duration-300 overflow-hidden mb-4 ${isMinimized ? 'h-14 w-64' : 'h-[500px] w-[350px] md:w-[400px]'}`}>
          
          {/* Header */}
          <div className="bg-[var(--color-primary)] p-4 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold">EventHub AI</h3>
                {!isMinimized && <p className="text-[10px] text-indigo-100 flex items-center gap-1"><Sparkles className="w-2 h-2" /> Powered by Gemini</p>}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-indigo-600' : 'bg-white border border-gray-100'}`}>
                        {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                      }`}>
                        {m.parts[0].text}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        <Bot className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-[var(--color-border)]">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-[var(--color-border)] rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-semibold">Gemini 1.5 Flash</p>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={`p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group ${
          isOpen ? 'bg-[var(--color-danger)] text-white' : 'bg-indigo-600 text-white'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold text-sm">
              Event Assistant
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
