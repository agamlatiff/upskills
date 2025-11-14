import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Link } from 'react-router-dom';
import { allCourses } from '../data/courses';
import { SparklesIcon, XIcon, PaperAirplaneIcon, ChevronUpIcon } from './Icons';
import { parseContent } from '../utils/markdownParser';
import { getSystemInstruction } from './chatbot/getSystemInstruction';

type Course = typeof allCourses[0];

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string; suggestions?: Course[] }[]>([
        { role: 'model', content: 'Hello! How can I help you today? Ask me anything about web development, career paths, or this platform!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        const newMessages = [...messages, { role: 'user' as const, content: trimmedInput }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const systemInstruction = getSystemInstruction();

            const historyForAPI = newMessages.map(({ role, content }) => ({
                role: role,
                parts: [{ text: content }],
            }));

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: historyForAPI,
                config: {
                    systemInstruction: systemInstruction,
                },
            });

            let modelResponse = response.text;
            
            const suggestionRegex = /\[COURSE_SUGGESTION\](.*?)\[\/COURSE_SUGGESTION\]/g;
            const suggestions: Course[] = [];
            let match;

            while ((match = suggestionRegex.exec(modelResponse)) !== null) {
                const courseSlug = match[1].trim();
                const course = allCourses.find(c => c.slug === courseSlug);
                if (course) {
                    suggestions.push(course);
                }
            }

            modelResponse = modelResponse.replace(suggestionRegex, '').trim();

            setMessages(prev => [...prev, { role: 'model' as const, content: modelResponse, suggestions }]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages(prev => [...prev, { role: 'model' as const, content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Scroll-to-top logic
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-8 z-50 w-[calc(100vw-4rem)] max-w-md h-[70vh] max-h-[600px] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-blue-500/20 transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}>
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Close chat">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="flex-shrink-0 h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center">
                                    <SparklesIcon className="h-5 w-5 text-blue-400" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-slate-800 text-slate-200 rounded-bl-lg'}`}>
                                <div className="text-sm leading-relaxed prose prose-invert prose-p:my-0 prose-strong:text-white" dangerouslySetInnerHTML={{ __html: parseContent(msg.content) }}></div>
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-slate-700/50">
                                        <p className="text-sm font-semibold text-slate-300 mb-2">Based on your question, you might like:</p>
                                        <ul className="space-y-1">
                                            {msg.suggestions.slice(0, 2).map(course => (
                                                <li key={course.id}>
                                                    <Link 
                                                        to={`/courses/${course.slug}`} 
                                                        onClick={() => setIsOpen(false)} 
                                                        className="text-blue-400 hover:text-blue-300 font-medium text-sm underline"
                                                    >
                                                        {course.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3 justify-start">
                            <div className="flex-shrink-0 h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center">
                                <SparklesIcon className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-200 rounded-bl-lg">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-slate-500 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="flex-shrink-0 p-4 border-t border-slate-700">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-slate-800 border border-slate-600 rounded-full pl-4 pr-12 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-slate-400 hover:text-blue-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors" aria-label="Send message">
                            <PaperAirplaneIcon className="h-6 w-6" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className={`fixed bottom-8 right-8 z-40 flex flex-col items-center gap-3 transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
            }`}>
                 <button
                    onClick={scrollToTop}
                    className={`p-3 rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-blue-500 ${
                        isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                    aria-label="Scroll to top"
                >
                    <ChevronUpIcon className="h-6 w-6" />
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-blue-500"
                    aria-label="Open AI chat"
                >
                    <SparklesIcon className="h-7 w-7" />
                </button>
            </div>
        </>
    );
};

export default Chatbot;