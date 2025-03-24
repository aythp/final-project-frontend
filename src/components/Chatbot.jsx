import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const ApiN8N = process.env.REACT_APP_API_N8N_URL
export default function Chatbot() {
    useEffect(() => {
       console.log(ApiN8N);
}, []);
    useEffect(() => {
        /* console.log(process.env.REACT_APP_API_N8N_URL); */
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
            metadata: {},
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
                'Hi there! 👋',
                'My name is Nathan. How can I assist you today?'
            ],
            i18n: {
                en: {
                    title: 'Hi there! 👋',
                    subtitle: "Start a chat. We're here to help you 24/7.",
                    footer: '',
                    getStarted: 'New Conversation',
                    inputPlaceholder: 'Type your question..',
                },
            },
        });
    }, []);

    return (<div></div>);
}