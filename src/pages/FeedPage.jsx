import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FeedPage() {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Estilos de burbujas para los comentarios
  const bubbleStyles = [
    'chat-bubble-primary',
    'chat-bubble-secondary',
    'chat-bubble-accent',
    'chat-bubble-neutral',
    'chat-bubble-info',
    'chat-bubble-success',
    'chat-bubble-warning',
    'chat-bubble-error'
  ];

  useEffect(() => {
    const fetchAllMedia = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get("http://localhost:5005/api/feed", {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        setMedia(response.data);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError('Error al cargar el feed');
      }
    };

    fetchAllMedia();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (searchTerm.trim() === '') {
      setFilteredMedia([]);
      setHasSearched(false);
    } else {
      const filtered = media.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedia(filtered);
      setHasSearched(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-600">
      <div className="flex flex-grow">
        <div className="flex-1 p-6">
          <div className="mb-8 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex justify-center">
              <div className="join">
                <input 
                  type="text" 
                  className="input input-bordered join-item w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn join-item bg-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner text-primary"></span>
              <p className="ml-2 text-white">Cargando...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error max-w-md mx-auto mb-8">
              <span>{error}</span>
            </div>
          )}

          {!loading && hasSearched && filteredMedia.length === 0 && (
            <div className="alert alert-info max-w-md mx-auto">
              <span>No se encontraron películas o series con ese título.</span>
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="text-center text-white text-xl mt-10">
              <p>Busca una película o serie para ver sus comentarios</p>
            </div>
          )}

          {hasSearched && filteredMedia.length > 0 && (
            <div className="max-w-3xl mx-auto bg-base-100 rounded-box p-6 shadow-xl">
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={filteredMedia[0].poster} 
                  alt={filteredMedia[0].title} 
                  className="rounded-lg h-48 w-32 object-cover mb-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-poster.png';
                  }}
                />
                <h2 className="text-2xl font-bold text-center">{filteredMedia[0].title}</h2>
              </div>
              
              <div className="space-y-2">
                {filteredMedia.map((item, index) => (
                  <div key={item._id} className={`chat ${index % 2 === 0 ? 'chat-start' : 'chat-end'}`}>
                    <div className="chat-header mb-1">
                      {item.user?.name || 'Usuario'}
                    </div>
                    <div className={`chat-bubble ${bubbleStyles[index % bubbleStyles.length]}`}>
                      {item.comment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}