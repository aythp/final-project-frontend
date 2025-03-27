import { useEffect, useState } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const ApiN8N = process.env.REACT_APP_API_N8N_URL;

export default function Chatbot() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        setIsAuthenticated(!!authToken);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return; 

        createChat({
            webhookUrl: ApiN8N,
            webhookConfig: {
                method: 'POST',
                headers: {}
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            metadata: {

                userAuthenticated: true
            },
            showWelcomeScreen: false,
            defaultLanguage: 'es', 
            initialMessages: [
                '¡Hola! 👋',
                'Soy tu asistente de películas y series. ¿En qué puedo ayudarte hoy?',
                'Puedo ayudarte a encontrar información sobre películas, series, o responder preguntas sobre tu colección.'
            ],
            i18n: {
                es: {
                    title: '¡Hola! 👋',
                    subtitle: "Inicia una conversación. Estoy aquí para ayudarte con tus películas y series.",
                    footer: '',
                    getStarted: 'Nueva Conversación',
                    inputPlaceholder: 'Escribe tu pregunta sobre películas o series...',
                },
            },
        });
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return (
        <div id="n8n-chat" className="fixed bottom-4 right-4 z-50"></div>
    );
}