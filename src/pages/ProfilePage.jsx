import { useEffect, useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import Footer from "../components/Footer";
import MovieSearch from '../components/MovieSearch';
import SeriesSearch from '../components/SeriesSearch';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
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
  const navigate = useNavigate();

  const handleStatusChange = async (itemId, itemType, newStatus) => {
    try {
      setStatusLoading(prev => ({ ...prev, [itemId]: true }));
      const authToken = localStorage.getItem("authToken");

      const endpoint = itemType === 'series' ? 'series' : `${itemType}s`;
      
      const response = await axios.put(
        `http://localhost:5005/api/${endpoint}/${itemId}/status`,
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
        axios.get("http://localhost:5005/api/movies", {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        axios.get("http://localhost:5005/api/series", {
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
        
        await axios.delete(`http://localhost:5005/api/${endpoint}/${itemId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        // Actualizar el estado local
        if (itemType === 'movie') {
          setMovies(prevMovies => prevMovies.filter(movie => movie._id !== itemId));
        } else {
          setSeries(prevSeries => prevSeries.filter(series => series._id !== itemId));
        }

        // Recalcular estadísticas
        calculateStats(
          itemType === 'movie' ? movies.filter(m => m._id !== itemId) : movies,
          itemType === 'series' ? series.filter(s => s._id !== itemId) : series
        );

      } catch (error) {
        console.log(`Error al eliminar el contenido:`, error);
      }
    }
  };

  // Función para obtener los elementos de la página actual
  const getCurrentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Función para cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-600">
        <div className="flex flex-grow">
          <div className="flex flex-col w-full p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="avatar">
                  <div className="w-32 rounded-full">
                    <img 
                      src={user?.profileImage || "https://picsum.photos/id/402/200/300"} 
                      alt="profile" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white text-center">
                  {user?.name}
                </h1>
              </div>
              
              {/* Estadísticas */}
              <div className="stats shadow bg-base-200">
                <div className="stat">
                  <div className="stat-title">Total Películas</div>
                  <div className="stat-value">{stats.totalMovies}</div>
                  <div className="stat-desc">
                    {stats.watchedMovies} vistas • {stats.favoriteMovies} favoritas
                  </div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Total Series</div>
                  <div className="stat-value">{stats.totalSeries}</div>
                  <div className="stat-desc">
                    {stats.watchedSeries} vistas • {stats.favoriteSeries} favoritas
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Pendientes</div>
                  <div className="stat-value">{stats.pendingMovies + stats.pendingSeries}</div>
                  <div className="stat-desc">
                    {stats.pendingMovies} películas • {stats.pendingSeries} series
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="tabs tabs-boxed bg-base-300/50 p-1 rounded-xl">
                  <button
                    className={`tab text-lg font-medium transition-all duration-300 ${
                      activeTab === 'movies' 
                        ? 'bg-primary text-primary-content rounded-lg transform -translate-y-0.5' 
                        : 'text-white hover:text-primary'
                    }`}
                    onClick={() => setActiveTab('movies')}
                  >
                    Películas
                  </button>
                  <button
                    className={`tab text-lg font-medium transition-all duration-300 ${
                      activeTab === 'series' 
                        ? 'bg-primary text-primary-content rounded-lg transform -translate-y-0.5' 
                        : 'text-white hover:text-primary'
                    }`}
                    onClick={() => setActiveTab('series')}
                  >
                    Series
                  </button>
                </div>
                
                <button
                  className="btn btn-circle btn-secondary text-xl w-10 h-10"
                  onClick={() => setIsSearching(!isSearching)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {isSearching && (
              <>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
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

            <div className="relative flex-grow">
              <div className={`transition-opacity duration-300 ${activeTab === 'movies' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'}`}>
                {movies.length === 0 ? (
                  <div className="text-center text-white">
                    <p>No has añadido ninguna película todavía.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2 max-w-7xl mx-auto">
                      {getCurrentItems(movies).map((movie) => (
                        <div 
                          key={movie._id} 
                          className={`relative group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden aspect-[2/3] w-[250px] mx-auto
                            ${movie.status === 'favorite' ? 'hover:shadow-[0_0_15px_rgba(255,0,0,0.7)]' : ''}
                            ${movie.status === 'viewed' ? 'hover:shadow-[0_0_15px_rgba(0,255,0,0.7)]' : ''}
                            ${movie.status === 'pending' ? 'hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]' : ''}
                            ${!movie.status ? 'hover:shadow-[0_0_15px_rgba(255,255,255,0.7)]' : ''}
                          `}
                          onClick={() => navigate(`/movies/${movie._id}`)}
                        >
                          <img 
                            src={movie.poster} 
                            alt={movie.title}
                            className="w-full h-full object-contain bg-black"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-poster.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-between p-4">
                            <div className="flex justify-between items-start">
                              <h2 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {movie.title}
                              </h2>
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(movie._id, 'movie');
                                }}
                              >
                                <RiDeleteBin6Line className="text-red-500 hover:text-red-700" />
                              </button>
                            </div>
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(movie._id, 'movie', movie.status === 'favorite' ? null : 'favorite');
                                }}
                              >
                                {movie.status === 'favorite' ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                              </button>
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(movie._id, 'movie', movie.status === 'viewed' ? null : 'viewed');
                                }}
                              >
                                {movie.status === 'viewed' ? <MdVisibility className="text-green-500" /> : <MdVisibilityOff />}
                              </button>
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(movie._id, 'movie', movie.status === 'pending' ? null : 'pending');
                                }}
                              >
                                {movie.status === 'pending' ? <BsBookmarkFill className="text-yellow-500" /> : <BsBookmark />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Paginación para películas */}
                    <div className="flex justify-center mt-8">
                      <div className="join">
                        {Array.from({ length: Math.ceil(movies.length / itemsPerPage) }, (_, i) => (
                          <button
                            key={i + 1}
                            className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className={`transition-opacity duration-300 ${activeTab === 'series' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'}`}>
                {series.length === 0 ? (
                  <div className="text-center text-white">
                    <p>No has añadido ninguna serie todavía.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2 max-w-7xl mx-auto">
                      {getCurrentItems(series).map((series) => (
                        <div 
                          key={series._id} 
                          className={`relative group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden aspect-[2/3] w-[250px] mx-auto
                            ${series.status === 'favorite' ? 'hover:shadow-[0_0_15px_rgba(255,0,0,0.7)]' : ''}
                            ${series.status === 'viewed' ? 'hover:shadow-[0_0_15px_rgba(0,255,0,0.7)]' : ''}
                            ${series.status === 'pending' ? 'hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]' : ''}
                            ${!series.status ? 'hover:shadow-[0_0_15px_rgba(255,255,255,0.7)]' : ''}
                          `}
                          onClick={() => navigate(`/series/${series._id}`)}
                        >
                          <img 
                            src={series.poster} 
                            alt={series.title}
                            className="w-full h-full object-contain bg-black"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-poster.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-between p-4">
                            <div className="flex justify-between items-start">
                              <h2 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {series.title}
                              </h2>
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(series._id, 'series');
                                }}
                              >
                                <RiDeleteBin6Line className="text-red-500 hover:text-red-700" />
                              </button>
                            </div>
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(series._id, 'series', series.status === 'favorite' ? null : 'favorite');
                                }}
                              >
                                {series.status === 'favorite' ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                              </button>
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(series._id, 'series', series.status === 'viewed' ? null : 'viewed');
                                }}
                              >
                                {series.status === 'viewed' ? <MdVisibility className="text-green-500" /> : <MdVisibilityOff />}
                              </button>
                              <button 
                                className="text-white text-2xl hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(series._id, 'series', series.status === 'pending' ? null : 'pending');
                                }}
                              >
                                {series.status === 'pending' ? <BsBookmarkFill className="text-yellow-500" /> : <BsBookmark />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Paginación para series */}
                    <div className="flex justify-center mt-8">
                      <div className="join">
                        {Array.from({ length: Math.ceil(series.length / itemsPerPage) }, (_, i) => (
                          <button
                            key={i + 1}
                            className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}