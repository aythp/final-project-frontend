import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import Footer from "../components/Footer";
import { FaPlus } from 'react-icons/fa';
import MediaTabs from '../components/MediaTabs';
import UserProfile from '../components/UserProfile';
import StatsPanel from '../components/StatsPanel';
import AddContentButton from '../components/AddContentButton';
import SearchPanel from '../components/SearchPanel';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('movies');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [statusLoading, setStatusLoading] = useState({});
  
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    favoriteMovies: 0,
    favoriteSeries: 0,
    watchedMovies: 0,
    watchedSeries: 0,
    pendingMovies: 0,
    pendingSeries: 0
  });

  const handleStatusChange = async (itemId, itemType, newStatus) => {
    try {
      setStatusLoading(prev => ({ ...prev, [itemId]: true }));
      const authToken = localStorage.getItem("authToken");

      const endpoint = itemType === 'series' ? 'series' : `${itemType}s`;
      
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/${endpoint}/${itemId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      console.log(`Estado de ${itemType} actualizado:`, response.data);
      fetchData();
    } catch (error) {
      console.log(`Error al cambiar el estado de ${itemType}:`, error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const calculateStats = (movies, series) => {
    const newStats = {
      totalMovies: movies.length,
      totalSeries: series.length,
      favoriteMovies: movies.filter(m => m.status === 'favorite').length,
      favoriteSeries: series.filter(s => s.status === 'favorite').length,
      watchedMovies: movies.filter(m => m.status === 'viewed').length,
      watchedSeries: series.filter(s => s.status === 'viewed').length,
      pendingMovies: movies.filter(m => m.status === 'pending').length,
      pendingSeries: series.filter(s => s.status === 'pending').length
    };
    setStats(newStats);
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

      setMovies(moviesResponse.data);
      setSeries(seriesResponse.data);
      calculateStats(moviesResponse.data, seriesResponse.data);
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
    setMovies((prevMovies) => {
      const exists = prevMovies.some((movie) => movie._id === newMovie._id);
      if (!exists) {
        const updatedMovies = [...prevMovies, newMovie];
        calculateStats(updatedMovies, series);
        return updatedMovies;
      }
      return prevMovies;
    });
    setIsSearching(false);
  };

  const handleSeriesAdded = (newSeries) => {
    setSeries((prevSeries) => {
      const exists = prevSeries.some((series) => series._id === newSeries._id);
      if (!exists) {
        const updatedSeries = [...prevSeries, newSeries];
        calculateStats(movies, updatedSeries);
        return updatedSeries;
      }
      return prevSeries;
    });
    setIsSearching(false);
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
        
        calculateStats(
          itemType === 'movie' ? movies.filter(m => m._id !== itemId) : movies,
          itemType === 'series' ? series.filter(s => s._id !== itemId) : series
        );

      } catch (error) {
        console.log(`Error al eliminar el contenido:`, error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-600">
        <div className="flex flex-grow">
          <div className="flex flex-col w-full p-2 sm:p-4 md:p-6">
            <div className="flex flex-col items-center mb-4 md:mb-8">
              <UserProfile user={user} />
              
              {/* Estadísticas */}
              <StatsPanel stats={stats} />
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
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </div>

        {/* Botón de añadir */}
        <AddContentButton onClick={() => setIsSearching(true)} />

        {/* Panel de búsqueda */}
        {isSearching && (
          <SearchPanel
            activeTab={activeTab}
            onMovieAdded={handleMovieAdded}
            onSeriesAdded={handleSeriesAdded}
            searchRef={searchRef}
            onClose={() => setIsSearching(false)}
          />
        )}
      </div>
    </>
  );
}