import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import MediaTabs from '../components/MediaTabs';

export default function PendingPage() {
    const { user } = useContext(AuthContext);
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusLoading, setStatusLoading] = useState({});

    const handleStatusChange = async (itemId, itemType, newStatus) => {
        try {
            setStatusLoading(prev => ({ ...prev, [itemId]: true }));
            const authToken = localStorage.getItem("authToken");
            const endpoint = itemType === 'series' ? 'series' : `${itemType}s`;
            
            await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/api/${endpoint}/${itemId}/status`,
                { status: newStatus },
                {
                  headers: { Authorization: `Bearer ${authToken}` }
                }
              );

            fetchData();
        } catch (error) {
            console.log(`Error al cambiar el estado de ${itemType}:`, error);
        } finally {
            setStatusLoading(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const fetchData = async () => {
            try {
                setLoading(true);
                const authToken = localStorage.getItem("authToken");
                
                if (!authToken) {
                throw new Error("No se encontró el token de autenticación");
                }

                const [moviesResponse, seriesResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/movies`, {
                      headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/series`, {
                      headers: { Authorization: `Bearer ${authToken}` }
                    })
                  ]);

            setMovies(moviesResponse.data.filter(movie => movie.status === 'pending'));
            setSeries(seriesResponse.data.filter(series => series.status === 'pending'));
            } catch (err) {
            console.error("Error al cargar los datos:", err);
            setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (itemId, itemType) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
            try {
                const authToken = localStorage.getItem("authToken");
                const endpoint = itemType === 'series' ? 'series' : `${itemType}s`;
                
                await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/${endpoint}/${itemId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                  });

                if (itemType === 'movie') {
                    setMovies(prevMovies => prevMovies.filter(movie => movie._id !== itemId));
                } else {
                    setSeries(prevSeries => prevSeries.filter(series => series._id !== itemId));
                }

            } catch (error) {
                console.log(`Error al eliminar el contenido:`, error);
            }
        }
    };

    return (
        <>
        <div className="flex flex-col min-h-screen bg-slate-600">
            <div className="flex flex-grow">
                <div className="flex flex-col w-full p-6">
                    <div className="flex flex-col items-center mb-8">
                        <h1 className="text-4xl font-bold text-white text-center mb-4">
                            Pendiente
                        </h1>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center h-32">
                            <span className="loading loading-spinner text-primary"></span>
                            <p className="ml-2 text-white">Cargando...</p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {!loading && !error && (
                        <MediaTabs 
                            movies={movies}
                            series={series}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            statusLoading={statusLoading}
                            moviesEmptyMessage="No tienes películas pendientes."
                            seriesEmptyMessage="No tienes series pendientes."
                        />
                    )}
                </div>
            </div>
        </div>
        </>
    );
}