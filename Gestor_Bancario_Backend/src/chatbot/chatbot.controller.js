import { response, request } from 'express';
import Chat from './chat.model.js';
import { generateChatResponse } from './chatbot.service.js';

export const getUserChats = async (req = request, res = response) => {
    try {
        const { userId } = req;
        const chats = await Chat.find({ userId })
            .select('title updatedAt')
            .sort({ updatedAt: -1 });

        return res.status(200).json({ success: true, chats });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener los chats', error: error.message });
    }
};

export const getChatById = async (req = request, res = response) => {
    try {
        const { userId } = req;
        const { id } = req.params;

        const chat = await Chat.findOne({ _id: id, userId });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat no encontrado' });
        }

        return res.status(200).json({ success: true, chat });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al obtener el chat', error: error.message });
    }
};

export const sendMessage = async (req = request, res = response) => {
    try {
        const { userId } = req;
        const { chatId, message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'El mensaje es requerido' });
        }

        let chat;
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, userId });
            if (!chat) {
                return res.status(404).json({ success: false, message: 'Chat no encontrado' });
            }
        } else {
            // Generar título automático basado en el primer mensaje
            const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
            chat = new Chat({ userId, title, messages: [] });
        }

        // Agregar mensaje del usuario
        chat.messages.push({ role: 'user', content: message });
        await chat.save();

        // Enviar historial al servicio AI (incluyendo el nuevo mensaje)
        // Gemini necesita roles estrictos 'user' y 'model'
        const botReply = await generateChatResponse(chat.messages, userId);

        // Agregar respuesta de la AI
        chat.messages.push({ role: 'model', content: botReply });
        await chat.save();

        return res.status(200).json({ 
            success: true, 
            chatId: chat._id, 
            reply: botReply,
            messages: chat.messages
        });

    } catch (error) {
        console.error("Chatbot Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: 'Ocurrió un error al procesar el mensaje con el asistente', 
            error: error.message 
        });
    }
};