import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import MovieSearch from '../components/MovieSearch';
import SeriesSearch from '../components/SeriesSearch';

export default function ProfilePage() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar películas y series del usuario
  const fetchData = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("No se encontró el token de autenticación");
      }

      // Obtener películas del usuario actual
      const moviesResponse = await axios.get("http://localhost:5005/api/movies", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log("Películas obtenidas del backend:", moviesResponse.data);

      // Obtener series del usuario actual
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

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Función para actualizar la lista de películas después de guardar una nueva
  const handleMovieAdded = (newMovie) => {
    console.log("Nueva película añadida:", newMovie);
    setMovies((prevMovies) => {
      const exists = prevMovies.some((movie) => movie._id === newMovie._id);
      if (!exists) {
        return [...prevMovies, newMovie];
      }
      return prevMovies;
    });
  };

  // Función para actualizar la lista de series después de guardar una nueva
  const handleSeriesAdded = (newSeries) => {
    console.log("Nueva serie añadida:", newSeries);
    setSeries((prevSeries) => {
      const exists = prevSeries.some((series) => series._id === newSeries._id);
      if (!exists) {
        return [...prevSeries, newSeries];
      }
      return prevSeries;
    });
  };

  return (
    <>
      <div className="flex justify-start min-h-screen bg-slate-600">
        <Sidebar />
        <div className="flex flex-col w-full p-6">
          {/* Componentes de búsqueda */}
          <div className="mb-8">
            <MovieSearch onMovieAdded={handleMovieAdded} />
            <SeriesSearch onSeriesAdded={handleSeriesAdded} />
          </div>

          {/* Mensajes de carga y error */}
          {loading && (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner text-primary"></span>
              <p className="ml-2">Cargando...</p>
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

          {/* Lista de películas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Mis Películas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <div key={movie._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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

          {/* Lista de series */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Mis Series</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.map((series) => (
                <div key={series._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
      <Footer />
    </>
  );
}