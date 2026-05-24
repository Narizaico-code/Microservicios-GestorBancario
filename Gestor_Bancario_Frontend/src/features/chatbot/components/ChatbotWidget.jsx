import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Plus, MessageCircle, ChevronLeft } from 'lucide-react';
import useChatStore from '../store/useChatStore';

const ChatbotWidget = () => {
    const { 
        isOpen, toggleChat, chats, currentChatId, 
        messages, isLoading, fetchChats, fetchChatById, 
        startNewChat, sendMessage 
    } = useChatStore();

    const [input, setInput] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const messagesEndRef = useRef(null);

    // Cargar la lista de chats cuando abrimos
    useEffect(() => {
        if (isOpen) {
            fetchChats();
        }
    }, [isOpen]);

    // Autoscroll
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    const formatMessage = (text) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negritas
            .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Cursivas
            .replace(/\n/g, '<br/>');                          // Saltos de línea
    };

    if (!isOpen) {
        return (
            <button 
                onClick={toggleChat}
                className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center justify-center"
            >
                <MessageSquare size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    {showSidebar ? (
                        <button onClick={() => setShowSidebar(false)} className="hover:bg-blue-700 p-1 rounded">
                            <ChevronLeft size={20} />
                        </button>
                    ) : (
                        <button onClick={() => setShowSidebar(true)} className="hover:bg-blue-700 p-1 rounded" title="Ver historial">
                            <MessageCircle size={20} />
                        </button>
                    )}
                    <h3 className="font-semibold text-lg">
                        {showSidebar ? 'Historial de Chats' : 'Asistente Virtual'}
                    </h3>
                </div>
                <div className="flex gap-2">
                    {!showSidebar && (
                        <button onClick={startNewChat} className="hover:bg-blue-700 p-1 rounded" title="Nuevo Chat">
                            <Plus size={20} />
                        </button>
                    )}
                    <button onClick={toggleChat} className="hover:bg-blue-700 p-1 rounded">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {/* Sidebar - Historial de Chats */}
                <div className={`absolute inset-0 bg-gray-50 z-10 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                    <div className="p-3 border-b border-gray-200">
                        <button 
                            onClick={() => {
                                startNewChat();
                                setShowSidebar(false);
                            }}
                            className="w-full py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Nueva conversación
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {chats.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm mt-4">No tienes conversaciones previas.</p>
                        ) : (
                            chats.map((c) => (
                                <div 
                                    key={c._id} 
                                    onClick={() => {
                                        fetchChatById(c._id);
                                        setShowSidebar(false);
                                    }}
                                    className={`p-3 rounded mb-1 cursor-pointer truncate text-sm transition-colors ${currentChatId === c._id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200 text-gray-700'}`}
                                >
                                    {c.title}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="h-full flex flex-col bg-white">
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                                <MessageSquare size={48} className="opacity-20" />
                                <p className="text-sm">¡Hola! ¿En qué puedo ayudarte hoy?</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white self-end rounded-br-none' : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'}`}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="bg-gray-100 text-gray-800 self-start p-3 rounded-xl rounded-bl-none text-sm max-w-[80%] flex gap-1 items-center">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu mensaje..." 
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotWidget;