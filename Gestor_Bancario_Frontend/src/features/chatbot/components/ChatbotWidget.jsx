import { useState, useEffect, useRef } from 'react';
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
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-[var(--theme-surface)] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-[var(--theme-border)] transition-colors duration-300">
            {/* Header */}
            <div className="bg-[var(--theme-accent)] p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    {showSidebar ? (
                        <button onClick={() => setShowSidebar(false)} className="hover:opacity-80 p-1 rounded transition-opacity">
                            <ChevronLeft size={20} />
                        </button>
                    ) : (
                        <button onClick={() => setShowSidebar(true)} className="hover:opacity-80 p-1 rounded transition-opacity" title="Ver historial">
                            <MessageCircle size={20} />
                        </button>
                    )}
                    <h3 className="font-semibold text-lg">
                        {showSidebar ? 'Historial de Chats' : 'Asistente Virtual'}
                    </h3>
                </div>
                <div className="flex gap-2">
                    {!showSidebar && (
                        <button onClick={startNewChat} className="hover:opacity-80 p-1 rounded transition-opacity" title="Nuevo Chat">
                            <Plus size={20} />
                        </button>
                    )}
                    <button onClick={toggleChat} className="hover:opacity-80 p-1 rounded transition-opacity">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {/* Sidebar - Historial de Chats */}
                <div className={`absolute inset-0 bg-[var(--theme-surface-alt)] z-10 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                    <div className="p-3 border-b border-[var(--theme-border)]">
                        <button 
                            onClick={() => {
                                startNewChat();
                                setShowSidebar(false);
                            }}
                            className="w-full py-2 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded text-sm text-[var(--theme-text)] hover:opacity-80 flex items-center justify-center gap-2 transition-all"
                        >
                            <Plus size={16} /> Nueva conversación
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {chats.length === 0 ? (
                            <p className="text-center text-[var(--theme-text-muted)] text-sm mt-4">No tienes conversaciones previas.</p>
                        ) : (
                            chats.map((c) => (
                                <div 
                                    key={c._id} 
                                    onClick={() => {
                                        fetchChatById(c._id);
                                        setShowSidebar(false);
                                    }}
                                    className={`p-3 rounded mb-1 cursor-pointer truncate text-sm transition-colors ${currentChatId === c._id ? 'bg-[var(--theme-accent)] text-white' : 'hover:bg-[var(--theme-surface)] text-[var(--theme-text)]'}`}
                                >
                                    {c.title}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="h-full flex flex-col bg-[var(--theme-surface)]">
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-[var(--theme-text-muted)] space-y-2">
                                <MessageSquare size={48} className="opacity-20" />
                                <p className="text-sm">¡Hola! ¿En qué puedo ayudarte hoy?</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-[var(--theme-accent)] text-white self-end rounded-br-none' : 'bg-[var(--theme-surface-alt)] text-[var(--theme-text)] self-start rounded-bl-none'}`}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="bg-[var(--theme-surface-alt)] text-[var(--theme-text)] self-start p-3 rounded-xl rounded-bl-none text-sm max-w-[80%] flex gap-1 items-center">
                                <span className="w-2 h-2 bg-[var(--theme-text-muted)] rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-[var(--theme-text-muted)] rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-[var(--theme-text-muted)] rounded-full animate-bounce delay-150"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-[var(--theme-border)] bg-[var(--theme-surface-alt)]">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu mensaje..." 
                                className="flex-1 border border-[var(--theme-border)] bg-[var(--theme-surface)] rounded-full px-4 py-2 text-sm text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-accent)]"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-[var(--theme-accent)] text-white rounded-full hover:opacity-80 disabled:opacity-50 transition-all"
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