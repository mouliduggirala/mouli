import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Loader2, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const LogoIcon = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  const isSm = size === "sm";
  return (
    <div className="flex items-center -space-x-2">
      <div className={`${isSm ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'} bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-sm`}>
        D
      </div>
      <div className={`${isSm ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'} bg-accent rounded-lg flex items-center justify-center text-white font-bold shadow-sm`}>
        M
      </div>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeadCaptured, setIsLeadCaptured] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm Mouli's AI assistant. How can I help you with information about his profile, skills, or projects?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const captureLead = async (email: string) => {
    try {
      await fetch('https://formspree.io/f/xaqpvdyk', {
        method: 'POST',
        body: JSON.stringify({ email, message: "New Chatbot Lead" }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error("Lead capture error:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const raw = await response.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorText = data?.error || `Request failed with status ${response.status}`;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${errorText}` },
        ]);
        return;
      }

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
      // If data.message is empty, it means the bot decided not to answer based on the prompt logic
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having some trouble right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 w-[320px] md:w-[340px] h-[450px] flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary via-primary to-slate-800 p-4 flex items-center justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="flex items-center gap-3 relative z-10">
                <LogoIcon size="md" />
                <div>
                  <h3 className="font-bold text-xs">Mouli's Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-[9px] text-white/70">Online & Ready to Help</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors relative z-10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === "user"
                        ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                      }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-700 border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2 items-center bg-slate-50 rounded-2xl px-3 py-1.5 border border-slate-100 focus-within:border-accent/30 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-grow bg-transparent border-none text-xs focus:ring-0 outline-none py-1"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-primary text-white p-1.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-black/10 border border-slate-100 hover:bg-slate-50 transition-all relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <LogoIcon />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-xl text-[10px] font-bold text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with AI Assistant
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-white" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;
