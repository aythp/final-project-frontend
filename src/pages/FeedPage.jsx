import { useEffect, useState } from 'react';
import axios from 'axios';
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

        const response = await axios.get("http://localhost:5005/api/feed", {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        setMedia(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError('Error al cargar el feed');
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-600">
      <div className="flex flex-grow">
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Feed Global</h1>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <div key={item._id} className="card bg-base-100 shadow-xl">
                <figure className="px-4 pt-4">
                  <img 
                    src={item.poster} 
                    alt={item.title} 
                    className="rounded-xl h-64 w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-poster.png';
                    }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{item.title}</h2>
                  <p className="text-sm text-gray-600">
                    Compartido por: {item.user?.name || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <div className="text-sm">
                    <p>⭐ {item.rating}</p>
                    {item.runtime ? (
                      <p>⏱️ {item.runtime} minutos</p>
                    ) : (
                      <p>📺 {item.seasons} temporadas</p>
                    )}
                    {item.cast && <p>🎭 {item.cast.join(", ")}</p>}
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