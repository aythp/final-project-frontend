import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SeriesSearch(props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    if (!API_KEY) {
      console.error('TMDB API Key no está configurada');
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      searchSeries(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, API_KEY]);

  const searchSeries = async (searchQuery) => {
    if (!searchQuery.trim() || !API_KEY) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
        params: {
          api_key: API_KEY,
          query: searchQuery,
          language: "es-ES",
        }
      });
      setSuggestions(response.data.results.slice(0, 8));
    } catch (err) {
      console.error("Error buscando series:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSaveSeries = async (series) => {
    try {
      const authToken = localStorage.getItem("authToken");
      console.log('Series data being sent:', { 
        title: series.name, 
        id: series.id 
      });
      
      if (!authToken) {
        console.error("No authentication token found");
        return;
      }

      console.log('Server URL:', process.env.REACT_APP_SERVER_URL);
      
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/series/search`,
        { 
          query: series.name,
          tmdbId: series.id 
        },
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
  
      if (response.data && props.onSeriesAdded) {
        props.onSeriesAdded(response.data);
        setSuggestions([]);
        setQuery('');
      }
    } catch (err) {
      console.error("Error al guardar la serie:", err);
      if (err.response) {
        console.error("Server error:", err.response.data);
      } else if (err.request) {
        console.error("No response from server");
      } else {
        console.error("Request setup error:", err.message);
      }
    }
  };

  return (
    <div className="w-full max-w-full mx-auto p-4">
      <div className="form-control">
        <input
          type="text"
          placeholder="Buscar serie..."
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
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestions.map((series) => (
              <div
                key={series.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out overflow-hidden"
                onClick={() => handleSaveSeries(series)}
              >
                <div className="flex flex-col h-full">
                  <div className="w-full h-40">
                    {series.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${series.poster_path}`}
                        alt={series.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-800 text-white text-xs">
                        No hay poster
                      </div>
                    )}
                  </div>
                  <div className="p-2 flex flex-col justify-between flex-grow">
                    <h2 className="font-bold text-sm line-clamp-2">{series.name}</h2>
                    <div className="flex justify-end items-center mt-1">
                      <p className="text-xs text-gray-500">
                        {series.first_air_date ? new Date(series.first_air_date).getFullYear() : 'Año desconocido'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
