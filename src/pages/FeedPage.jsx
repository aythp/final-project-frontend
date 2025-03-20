import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';

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

        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/feed`, {
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
          <SearchForm 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            handleSearch={handleSearch} 
          />

          {error && (
            <div className="alert alert-error max-w-md mx-auto mb-8">
              <span>{error}</span>
            </div>
          )}

          {!error && (
            <SearchResults 
              filteredMedia={filteredMedia}
              loading={loading}
              hasSearched={hasSearched}
              bubbleStyles={bubbleStyles}
            />
          )}
        </div>
      </div>
    </div>
  );
}