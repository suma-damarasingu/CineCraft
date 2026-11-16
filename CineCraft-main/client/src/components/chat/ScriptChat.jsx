import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import ReactMarkdown from 'react-markdown';

const ScriptChat = ({ scriptId }) => {
    const [messages, setMessages] = useState([
        { role: 'model', content: "Hello! I've read your script. Ask me anything about the plot, characters, or scenes." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3004/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scriptId,
                    message: userMsg,
                    history: messages.slice(1) // Send previous context (skip initial greeting)
                })
            });

            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
            } else {
                throw new Error("No reply");
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I had trouble analyzing the script. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900/50">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-none
                            ${msg.role === 'model' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}
                        `}>
                            {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
                        </div>

                        <div className={`
                            max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                            ${msg.role === 'model'
                                ? 'bg-surface border border-white/5 text-gray-200'
                                : 'bg-primary text-background font-medium'}
                        `}>
                            {msg.role === 'model' ? (
                                <ReactMarkdown
                                    components={{
                                        strong: ({ node, ...props }) => <span className="font-bold text-primary" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                            <Bot size={18} />
                        </div>
                        <div className="bg-surface border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-2 text-muted text-sm">
                            <Sparkles size={14} className="animate-spin" />
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-zinc-950/50">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about scenes, characters, or plot..."
                        className="w-full bg-surface border border-white/10 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-primary/50 text-sm"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-background rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScriptChat;
