import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MovieSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
      setSuggestions(response.data.results.slice(0, 5));
      setError(null);
    } catch (err) {
      setError('Error al buscar películas');
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
      await axios.post(
        "http://localhost:5005/api/movies/search",
        { query: movie.title },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setSuggestions([]);
      setQuery('');
      setSuccessMessage('Película añadida correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Error al guardar la película');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="form-control">
        <input
          type="text"
          placeholder="Buscar película..."
          className="input input-bordered w-full"
          value={query}
          onChange={handleSearch}
        />
      </div>

      {loading && <div className="mt-4 text-center">Cargando...</div>}
      
      {error && (
        <div className="alert alert-error mt-4">
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mt-4">
          <span>{successMessage}</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-4">
          {suggestions.map((movie) => (
            <div
              key={movie.id}
              className="card card-side bg-base-100 shadow-xl hover:bg-base-200 cursor-pointer transition duration-300 ease-in-out"
              onClick={() => handleSaveMovie(movie)}
            >
              <figure className="w-24">
                {movie.poster_path && (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full object-cover"
                  />
                )}
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-sm">{movie.title}</h2>
                <p className="text-xs text-gray-500">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}