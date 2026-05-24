import { create } from 'zustand';
import axiosChatbot from '../../../shared/api/chatbot';

const useChatStore = create((set, get) => ({
    isOpen: false,
    chats: [],
    currentChatId: null,
    messages: [],
    isLoading: false,

    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
    
    // Abrir un chat nuevo
    startNewChat: () => set({ currentChatId: null, messages: [], isOpen: true }),

    // Obtener historial de todos los chats del usuario
    fetchChats: async () => {
        try {
            const { data } = await axiosChatbot.get('/');
            if (data.success) {
                const currentChats = data.chats;
                set({ chats: currentChats });
                
                // Si hay chats y no estamos en uno actualmente, cargar el más reciente
                const { currentChatId } = get();
                if (currentChats.length > 0 && !currentChatId) {
                    get().fetchChatById(currentChats[0]._id);
                }
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    },

    // Obtener un chat por ID
    fetchChatById: async (id) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosChatbot.get(`/${id}`);
            if (data.success) {
                set({ 
                    currentChatId: data.chat._id, 
                    messages: data.chat.messages || [],
                    isOpen: true
                });
            }
        } catch (error) {
            console.error('Error fetching chat by ID:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Enviar mensaje
    sendMessage: async (message) => {
        const { currentChatId, messages } = get();
        
        // Agregar el mensaje de forma optimista
        const tempMsg = { role: 'user', content: message };
        set({ messages: [...messages, tempMsg], isLoading: true });

        try {
            const payload = { message };
            if (currentChatId) payload.chatId = currentChatId;

            const { data } = await axiosChatbot.post('/', payload);
            
            if (data.success) {
                set({ 
                    messages: data.messages, 
                    currentChatId: data.chatId 
                });
                
                // Refrescar la lista lateral de chats para que aparezca el nuevo si fue creado
                if (!currentChatId) {
                    get().fetchChats();
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Revertir optimista si falla, o mostrar mensaje de error
            set({ 
                messages: [...messages, tempMsg, { role: 'model', content: 'Lo siento, ocurrió un error al intentar conectarme. Revisa tu conexión o intenta más tarde.' }] 
            });
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useChatStore;