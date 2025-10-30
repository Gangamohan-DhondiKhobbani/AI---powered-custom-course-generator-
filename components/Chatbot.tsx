
import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { XIcon } from './icons/XIcon';
import { ChatMessage } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatbotProps {
    onSendMessage: (message: string) => Promise<void>;
    messages: ChatMessage[];
    isBotTyping: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onSendMessage, messages, isBotTyping }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isBotTyping]);

    const handleSend = async () => {
        if (userInput.trim() === '') return;
        setUserInput('');
        await onSendMessage(userInput);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-110"
                aria-label="Open chat"
            >
                {isOpen ? <XIcon className="w-6 h-6" /> : <ChatBubbleIcon className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out">
                    <header className="bg-indigo-600 text-white p-4 rounded-t-2xl flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        <h3 className="font-semibold">AI Learning Assistant</h3>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-3/4 px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isBotTyping && (
                             <div className="flex justify-start">
                                <div className="bg-slate-200 text-slate-800 px-3 py-2 rounded-lg">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t border-slate-200">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                            disabled={isBotTyping}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
