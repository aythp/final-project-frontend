import { useState, useEffect } from "react";


export default function ChatbotPage() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUserName(userData.name || "");
            } catch (e) {
                console.error("Error parsing user data:", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-600 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-white mb-4">Tu Asistente de Películas y Series</h1>
                        <p className="text-xl text-gray-300">
                            {userName ? `¡Hola ${userName}! ` : "¡Hola! "}
                            Estoy aquí para ayudarte con tu colección.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-slate-700 rounded-lg p-6 shadow-lg transform transition-all hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-primary p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Recomendaciones</h2>
                            </div>
                            <p className="text-gray-300">
                                Pregúntame sobre recomendaciones de películas o series basadas en tus gustos. 
                                Puedo sugerirte contenido similar a lo que ya has visto y disfrutado.
                            </p>
                        </div>

                        <div className="bg-slate-700 rounded-lg p-6 shadow-lg transform transition-all hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-primary p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Tu Colección</h2>
                            </div>
                            <p className="text-gray-300">
                                Consulta información sobre tu colección actual. Puedo decirte cuántas películas o series 
                                tienes pendientes, cuáles has visto o cuáles te han gustado más.
                            </p>
                        </div>

                        <div className="bg-slate-700 rounded-lg p-6 shadow-lg transform transition-all hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-primary p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Información</h2>
                            </div>
                            <p className="text-gray-300">
                                Pregúntame sobre detalles de películas o series específicas. Puedo proporcionarte 
                                información sobre el reparto, directores, año de lanzamiento y más.
                            </p>
                        </div>

                        <div className="bg-slate-700 rounded-lg p-6 shadow-lg transform transition-all hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-primary p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Descubrimiento</h2>
                            </div>
                            <p className="text-gray-300">
                                Descubre nuevas películas y series basadas en géneros, actores o directores que te gustan.
                                Puedo ayudarte a encontrar joyas ocultas que podrían interesarte.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-6 shadow-lg mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">¿Cómo puedo ayudarte hoy?</h2>
                        <p className="text-gray-300 mb-4">
                            Puedes preguntarme cosas como:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                            <li>"¿Qué películas de acción me recomiendas?"</li>
                            <li>"¿Cuántas series tengo pendientes por ver?"</li>
                            <li>"Dime más sobre la película El Padrino"</li>
                            <li>"¿Cuáles son las películas mejor valoradas en mi colección?"</li>
                            <li>"Recomiéndame series similares a Breaking Bad"</li>
                        </ul>
                        <p className="text-gray-300">
                            Estoy aquí para hacer que tu experiencia con películas y series sea más fácil y divertida.
                            ¡Solo pregunta!
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            Recuerda que también puedes acceder al chatbot desde cualquier página de la aplicación
                            haciendo clic en el icono de chat en la esquina inferior derecha.
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    );
}