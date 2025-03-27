import { useEffect, useState, useRef } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import './ChatbotStyles.css'; 

const ApiN8N = process.env.REACT_APP_API_N8N_URL;

export default function Chatbot() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        setIsAuthenticated(!!authToken);
    }, []);

    const applyStyles = () => {
        setTimeout(() => {
            const chatElements = document.querySelectorAll('#n8n-chat .n8n-chat-window-container *');
            chatElements.forEach(element => {
                if (element.tagName !== 'BUTTON') {
                    element.style.color = 'black';
                }
            });

            const userBubbles = document.querySelectorAll('#n8n-chat .n8n-chat-message-bubble-user');
            userBubbles.forEach(bubble => {
                bubble.style.backgroundColor = '#e1f5fe';
                bubble.style.border = '1px solid #b3e5fc';
                bubble.style.color = 'black';
            });

            const botBubbles = document.querySelectorAll('#n8n-chat .n8n-chat-message-bubble-bot');
            botBubbles.forEach(bubble => {
                bubble.style.backgroundColor = '#f5f5f5';
                bubble.style.border = '1px solid #e0e0e0';
                bubble.style.color = 'black';
            });

            const textareas = document.querySelectorAll('#n8n-chat textarea');
            textareas.forEach(textarea => {
                textarea.style.color = 'black';
            });
        }, 1000);
    };

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

        applyStyles();

        const observer = new MutationObserver(applyStyles);
        
        if (chatContainerRef.current) {
            observer.observe(chatContainerRef.current, { 
                childList: true, 
                subtree: true 
            });
        }

        return () => {
            observer.disconnect();
        };
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return (
        <div 
            id="n8n-chat" 
            ref={chatContainerRef}
            className="fixed bottom-4 right-4 z-50"
            style={{ 
                '--n8n-chat-text-color': 'black',
                '--n8n-chat-background-color': 'white'
            }}
        ></div>
    );
}