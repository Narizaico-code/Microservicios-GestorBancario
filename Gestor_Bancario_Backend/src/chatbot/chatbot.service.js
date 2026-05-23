import { GoogleGenerativeAI } from '@google/generative-ai';
import { chatbotSystemPrompt } from './system-prompt.js';
import Account from '../accounts/account.model.js';
import Transaction from '../transactions/transaction.model.js';
// Importamos los demás si los necesitamos

// Asegúrate de tener esta variable en el .env de backend: GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

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
    }
};

export const generateChatResponse = async (messagesHistory, userId) => {
    // Si no hay key, tirar error claro
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY no configurada en el servidor');
    }

    const model = genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
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
    while (result.response.functionCalls && result.response.functionCalls().length > 0) {
        const calls = result.response.functionCalls();
        const call = calls[0]; // Ejecutamos la primera que pida
        
        console.log(`[Chatbot] AI invocó la herramienta: ${call.name}`);
        
        let toolResponseData;
        if (toolFunctions[call.name]) {
            toolResponseData = await toolFunctions[call.name](userId); // Aquí forzamos el userId del token
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
    }

    // Ya no hay más function calls, retornar el texto final
    responseText = result.response.text();
    return responseText;
};