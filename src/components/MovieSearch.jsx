import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MovieSearch(props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "4c2b98d248efaa8035b951b8303b65e7";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchMovies(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: API_KEY,
          query: searchQuery,
          language: "es-ES",
        }
      });
      setSuggestions(response.data.results.slice(0, 4));
    } catch (err) {
      console.error("Error buscando películas:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSaveMovie = async (movie) => {
    try {
      const authToken = localStorage.getItem("authToken");
      
      const response = await axios.post(
        "http://localhost:5005/api/movies/search",
        { 
          query: movie.title,
          tmdbId: movie.id 
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data && props.onMovieAdded) {
        props.onMovieAdded(response.data);
      }

      setSuggestions([]);
      setQuery('');
    } catch (err) {
      console.error("Error al guardar la película:", err);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto p-4">
      <div className="form-control">
        <input
          type="text"
          placeholder="Buscar película..."
          className="input input-bordered w-full"
          value={query}
          onChange={handleSearch}
        />
      </div>

      {loading && (
        <div className="mt-4 flex justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {suggestions.map((movie) => (
            <div
              key={movie.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out overflow-hidden h-[350px]"
              onClick={() => handleSaveMovie(movie)}
            >
              <figure className="relative aspect-[2/3] w-full">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                    No hay poster
                  </div>
                )}
              </figure>
              <div className="card-body p-3 bg-gradient-to-t from-black to-transparent absolute bottom-0 w-full text-white">
                <h2 className="card-title text-lg font-bold truncate">{movie.title}</h2>
                <p className="text-sm">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Año desconocido'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}