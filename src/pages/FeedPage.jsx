import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function FeedPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");
        
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get("http://localhost:5005/api/users/feed", {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        setMedia(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError('Error al cargar el feed');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-600">
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Feed Social</h1>

          {loading && (
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-primary"></span>
              <p className="ml-2 text-white">Cargando...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {!loading && media.length === 0 && (
            <div className="text-center text-white">
              <p>No hay actividad reciente. ¡Sigue a más usuarios para ver su contenido!</p>
              <Link to="/users/search" className="btn btn-primary mt-4">
                Buscar Usuarios
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {media.map((item) => (
              <div key={item._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <Link
                      to={`/users/${item.user._id}`}
                      className="font-bold text-blue-600 hover:text-blue-800"
                    >
                      {item.user.name}
                    </Link>
                    <span className="mx-2">•</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-6">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-32 h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-poster.png';
                      }}
                    />
                    <div>
                      <h2 className="card-title">{item.title}</h2>
                      <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>⭐ {item.rating}</span>
                        {item.runtime ? (
                          <span>⏱️ {item.runtime} minutos</span>
                        ) : (
                          <span>📺 {item.seasons} temporadas</span>
                        )}
                      </div>
                      <div className="mt-4">
                        {item.status === 'favorite' && (
                          <span className="badge badge-primary">❤️ Marcado como favorito</span>
                        )}
                        {item.status === 'viewed' && (
                          <span className="badge badge-secondary">👁️ Marcado como visto</span>
                        )}
                      </div>
                      {item.comment && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm italic">"{item.comment}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}