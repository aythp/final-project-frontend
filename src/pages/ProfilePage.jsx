import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import MovieSearch from '../components/MovieSearch';
import SeriesSearch from '../components/SeriesSearch';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('movies');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("No se encontró el token de autenticación");
      }

      const moviesResponse = await axios.get("http://localhost:5005/api/movies", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log("Películas obtenidas del backend:", moviesResponse.data);

      const seriesResponse = await axios.get("http://localhost:5005/api/series", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log("Series obtenidas del backend:", seriesResponse.data);

      setMovies(moviesResponse.data);
      setSeries(seriesResponse.data);
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

  const handleMovieAdded = (newMovie) => {
    console.log("Nueva película añadida:", newMovie);
    setMovies((prevMovies) => {
      const exists = prevMovies.some((movie) => movie._id === newMovie._id);
      if (!exists) {
        return [...prevMovies, newMovie];
      }
      return prevMovies;
    });
    setIsSearching(false); // Cerrar el buscador después de añadir
  };

  const handleSeriesAdded = (newSeries) => {
    console.log("Nueva serie añadida:", newSeries);
    setSeries((prevSeries) => {
      const exists = prevSeries.some((series) => series._id === newSeries._id);
      if (!exists) {
        return [...prevSeries, newSeries];
      }
      return prevSeries;
    });
    setIsSearching(false); // Cerrar el buscador después de añadir
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-600">
        <div className="flex flex-grow">
          <Sidebar />
          <div className="flex flex-col w-full p-6">
            {/* Header with user name and feed link */}
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl font-bold text-white text-center">
                Bienvenido, {user?.name}
              </h1>
              <Link to="/feed" className="btn btn-accent mt-4">
                Ver Feed
              </Link>
            </div>

            {/* Tabs and Add button */}
            <div className="flex flex-col items-center mb-6">
              <div className="tabs tabs-boxed">
                <button
                  className={`tab ${activeTab === 'movies' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('movies')}
                >
                  Películas
                </button>
                <button
                  className={`tab ${activeTab === 'series' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('series')}
                >
                  Series
                </button>
              </div>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setIsSearching(!isSearching)}
              >
                {isSearching ? 'Cerrar' : '+ Añadir'}
              </button>
            </div>

            {/* Overlay and Search Components */}
            {isSearching && (
              <>
                {/* Fondo con efecto glassmorphism */}
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>

                {/* Contenedor del buscador centrado */}
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div ref={searchRef} className="card w-full max-w-md bg-white/20 backdrop-blur-md rounded-xl shadow-xl">
                    <div className="card-body">
                      {activeTab === 'movies' ? (
                        <MovieSearch onMovieAdded={handleMovieAdded} />
                      ) : (
                        <SeriesSearch onSeriesAdded={handleSeriesAdded} />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Loading and Error States */}
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

            {/* Contenedor relativo para películas y series */}
            <div className="relative flex-grow">
              {/* Movies Grid with Fade */}
              <div className={`transition-opacity duration-300 ${activeTab === 'movies' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'}`}>
                <div className="grid grid-cols-3 gap-6">
                  {movies.map((movie) => (
                    <div key={movie._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105">
                      <figure className="px-4 pt-4">
                        <img src={movie.poster} alt={movie.title} className="rounded-xl h-64 w-full object-cover" />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{movie.title}</h2>
                        <p className="text-sm text-gray-500">{movie.description}</p>
                        <div className="text-sm">
                          <p>⭐ {movie.rating}</p>
                          <p>⏱️ {movie.runtime} minutos</p>
                          <p>🎬 {movie.director}</p>
                          <p>🎭 {(movie.cast || []).join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Series Grid with Fade */}
              <div className={`transition-opacity duration-300 ${activeTab === 'series' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'}`}>
                <div className="grid grid-cols-3 gap-6">
                  {series.map((series) => (
                    <div key={series._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105">
                      <figure className="px-4 pt-4">
                        <img src={series.poster} alt={series.title} className="rounded-xl h-64 w-full object-cover" />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{series.title}</h2>
                        <p className="text-sm text-gray-500">{series.description}</p>
                        <div className="text-sm">
                          <p>⭐ {series.rating}</p>
                          <p>📺 {series.seasons} temporadas</p>
                          <p>🎭 {(series.cast || []).join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
