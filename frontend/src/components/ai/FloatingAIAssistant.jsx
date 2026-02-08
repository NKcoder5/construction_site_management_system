import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
    MessageSquare,
    X,
    Send,
    Bot,
    Minus,
    Maximize2,
    Copy,
    Volume2,
    HardHat,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import db from '../../utils/localDb';
import aiService from '../../utils/aiService';
import '../ai/FloatingAIAssistant.css'; // Will create this css file next

const FloatingAIAssistant = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage = {
                id: 'welcome',
                content: `Hi! I am the Site Brain. 👷‍♂️\n\nI can help you find authority files, check site briefings, or audit the ledger. How can I assist with site operations today?`,
                sender: 'ai',
                timestamp: new Date(),
                type: 'welcome'
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            content: inputMessage.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            // 1. Check for quick answers (calculations, etc.)
            const quickAnswer = await aiService.getQuickAnswer(userMessage.content);
            if (quickAnswer) {
                const aiMessage = {
                    id: Date.now() + 1,
                    content: quickAnswer,
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);
                setIsTyping(false);
                return;
            }

            // 2. Generate AI Response using specialized site agents
            const responseContent = await aiService.generateResponse(
                userMessage.content,
                messages.slice(-10)
            );

            // 3. Proactive Navigation (Decision Tunnel)
            const text = userMessage.content.toLowerCase();
            if (aiService.currentAgent === 'finance' && !location.pathname.includes('finance')) {
                navigate('/finance');
            } else if (aiService.currentAgent === 'hr' && !location.pathname.includes('employees')) {
                navigate('/employees');
            } else if (text.includes('authority') || text.includes('blueprint')) {
                navigate('/blueprints');
            } else if ((text.includes('briefing') || text.includes('diary')) && !location.pathname.includes('feed')) {
                navigate('/feed');
            }

            const aiMessage = {
                id: Date.now() + 1,
                content: responseContent,
                sender: 'ai',
                timestamp: new Date(),
                agent: aiService.currentAgent
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('AI Assistant Error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                content: "I'm having trouble connecting to my local processing unit. Please ensure Ollama is running.",
                sender: 'ai',
                timestamp: new Date(),
                type: 'error'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group hover:shadow-orange-500/20"
                >
                    <Bot className="w-6 h-6 group-hover:animate-bounce" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900"></span>
                </button>
            )}

            {/* Main Chat Window */}
            {isOpen && (
                <div className={`fixed z-50 transition-all duration-300 ${isMinimized
                    ? 'bottom-6 right-6 w-72 h-16 rounded-[2rem] overflow-hidden'
                    : 'bottom-6 right-6 w-[350px] md:w-[400px] h-[600px] max-h-[80vh] rounded-[2.5rem]'
                    } bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col`}>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 cursor-pointer"
                        onClick={() => isMinimized && setIsMinimized(false)}>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white">
                                <HardHat className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase italic">Yogesh AI</h3>
                                {!isMinimized && <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Online</span>
                                </div>}
                            </div>
                        </div>

                        <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                {isMinimized ? <Maximize2 className="w-4 h-4 text-slate-500" /> : <Minus className="w-4 h-4 text-slate-500" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors text-slate-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    {!isMinimized && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-black/20">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                            <span className="text-[9px] font-bold opacity-50 mt-2 block uppercase tracking-wider">
                                                {(() => {
                                                    try {
                                                        const d = new Date(msg.timestamp);
                                                        return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                    } catch (e) { return ''; }
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex space-x-2">
                                            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full pr-1.5">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask me anything..."
                                        disabled={isLoading}
                                        className="flex-1 bg-transparent px-4 text-sm font-bold text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim() || isLoading}
                                        className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default FloatingAIAssistant;
