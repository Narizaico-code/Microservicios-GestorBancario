import { GoogleGenerativeAI } from '@google/generative-ai';
import { chatbotSystemPrompt } from './system-prompt.js';
import Account from '../accounts/account.model.js';
import Transaction from '../transactions/transaction.model.js';
import Promotion from '../promotions/promotion.model.js';
import Service from '../services/service.model.js';
import Favorite from '../favorites/favorite.model.js';
import { getAllRates } from '../../helpers/currency-logic.js';

// Asegúrate de tener esta variable en el .env de backend: GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Declaración de las tools (Function Calling)
const tools = [
    {
        functionDeclarations: [
            {
                name: 'get_user_accounts',
                description: 'Obtiene la lista de cuentas bancarias del usuario, incluyendo el saldo, tipo de cuenta y moneda.',
                parameters: {
                    type: 'OBJECT',
                    properties: {}, // No pedimos argumentos a la IA, el userId lo inyectamos internamente
                },
            },
            {
                name: 'get_user_transactions',
                description: 'Obtiene el historial de las últimas 5 transacciones del usuario, ya sean depósitos, transferencias o retiros.',
                parameters: {
                    type: 'OBJECT',
                    properties: {},
                },
            },
            {
                name: 'get_active_promotions',
                description: 'Obtiene la lista de promociones bancarias que actualmente están activas para los usuarios.',
                parameters: {
                    type: 'OBJECT',
                    properties: {},
                },
            },
            {
                name: 'get_active_services',
                description: 'Obtiene la lista de servicios o productos bancarios que actualmente están activos.',
                parameters: {
                    type: 'OBJECT',
                    properties: {},
                },
            },
            {
                name: 'get_user_favorites',
                description: 'Obtiene la lista de cuentas favoritas (contactos guardados para transferencias) del usuario.',
                parameters: {
                    type: 'OBJECT',
                    properties: {},
                },
            },
            {
                name: 'get_exchange_rates',
                description: 'Obtiene el tipo de cambio actual de las divisas (GTQ, USD, EUR, etc) con respecto a una moneda base (por defecto USD).',
                parameters: {
                    type: 'OBJECT',
                    properties: {
                        base: {
                            type: 'STRING',
                            description: 'Moneda base para calcular el tipo de cambio, ej. USD o GTQ. Si no se provee, usa USD.'
                        }
                    },
                },
            }
        ],
    },
];

// Resolutores de las tools (Lógica real de Mongoose)
const toolFunctions = {
    get_user_accounts: async (userId) => {
        try {
            const accounts = await Account.find({ userId, estado: true })
                .select('numeroCuenta tipoCuenta saldo moneda -_id')
                .lean();
            if (accounts.length === 0) return { response: "El usuario no tiene cuentas activas." };
            return { response: accounts };
        } catch (error) {
            return { error: "Ocurrió un error al buscar las cuentas." };
        }
    },
    get_user_transactions: async (userId) => {
        try {
            // Buscamos las cuentas del usuario primero para saber qué transferencias le pertenecen
            const accounts = await Account.find({ userId }).select('numeroCuenta').lean();
            const accountNumbers = accounts.map(a => a.numeroCuenta);

            const transactions = await Transaction.find({
                $or: [
                    { cuentaOrigen: { $in: accountNumbers } },
                    { cuentaDestino: { $in: accountNumbers } }
                ]
            })
            .sort({ fechaTransaccion: -1, createdAt: -1 })
            .limit(5)
            .select('tipoTransaccion monto moneda cuentaOrigen cuentaDestino estado createdAt -_id')
            .lean();

            if (transactions.length === 0) return { response: "El usuario no tiene transacciones recientes." };
            return { response: transactions };
        } catch (error) {
            return { error: "Ocurrió un error al buscar las transacciones." };
        }
    },
    get_active_promotions: async () => {
        try {
            const promotions = await Promotion.find({ active: true, status: 'ACTIVE' })
                .select('name description terms type targetSegment -_id')
                .lean();
            if (promotions.length === 0) return { response: "No hay promociones activas en este momento." };
            return { response: promotions };
        } catch (error) {
            return { error: "Ocurrió un error al buscar las promociones." };
        }
    },
    get_active_services: async () => {
        try {
            const services = await Service.find({ active: true, status: 'ACTIVE' })
                .select('name description category type price discount -_id')
                .lean();
            if (services.length === 0) return { response: "No hay servicios activos en este momento." };
            return { response: services };
        } catch (error) {
            return { error: "Ocurrió un error al buscar los servicios." };
        }
    },
    get_user_favorites: async (userId) => {
        try {
            const favorites = await Favorite.find({ userId })
                .select('alias cuenta tipo -_id')
                .lean();
            if (favorites.length === 0) return { response: "El usuario no tiene cuentas favoritas agregadas." };
            return { response: favorites };
        } catch (error) {
            return { error: "Ocurrió un error al buscar los favoritos." };
        }
    },
    get_exchange_rates: async (userId, args) => {
        try {
            // El modelo pasa los argumentos en "args" cuando hay parámetros.
            const base = args?.base || 'USD';
            const rates = await getAllRates(base);
            return { base, rates };
        } catch (error) {
            return { error: "Ocurrió un error al obtener los tipos de cambio." };
        }
    }
};

export const generateChatResponse = async (messagesHistory, userId) => {
    // Si no hay key, tirar error claro
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY no configurada en el servidor');
    }

    const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        systemInstruction: chatbotSystemPrompt,
        tools: tools,
    });

    // Mapeamos el historial al formato de Gemini
    const contents = messagesHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));

    const chatSession = model.startChat({
        history: contents.slice(0, -1), // Todo menos el último que es la nueva pregunta
    });

    const userMessage = contents[contents.length - 1].parts[0].text;
    
    // Enviar el mensaje
    let result = await chatSession.sendMessage(userMessage);

    // Bucle para procesar llamadas a funciones si Gemini las pide
    let responseText = "";
    let calls = result.response.functionCalls ? result.response.functionCalls() : null;
    
    while (calls && calls.length > 0) {
        const call = calls[0]; // Ejecutamos la primera que pida
        
        console.log(`[Chatbot] AI invocó la herramienta: ${call.name}`);
        
        let toolResponseData;
        if (toolFunctions[call.name]) {
            // Pasamos el userId y también los argumentos que Gemini decidió enviarnos
            const args = call.args || {};
            toolResponseData = await toolFunctions[call.name](userId, args); 
        } else {
            toolResponseData = { error: "Función no encontrada." };
        }

        // Devolvemos el resultado a Gemini para que termine su análisis
        result = await chatSession.sendMessage([{
            functionResponse: {
                name: call.name,
                response: toolResponseData
            }
        }]);
        
        calls = result.response.functionCalls ? result.response.functionCalls() : null;
    }

    // Ya no hay más function calls, retornar el texto final
    responseText = result.response.text();
    return responseText;
};