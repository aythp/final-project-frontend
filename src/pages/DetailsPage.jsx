import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs';

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const [comment, setComment] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const authToken = localStorage.getItem("authToken");
        
        if (!authToken) {
          throw new Error("No se encontró el token de autenticación");
        }

        try {
          const movieResponse = await axios.get(`http://localhost:5005/api/movies/${id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          console.log("Movie data:", movieResponse.data);
          setMedia(movieResponse.data);
          setMediaType('movie');
          setComment(movieResponse.data.comment || '');
        } catch (movieError) {
          console.log("Not a movie, trying series...");

          const seriesResponse = await axios.get(`http://localhost:5005/api/series/${id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          console.log("Series data:", seriesResponse.data);
          setMedia(seriesResponse.data);
          setMediaType('series');
          setComment(seriesResponse.data.comment || '');
        }

      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(err.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      const authToken = localStorage.getItem("authToken");

      const endpoint = mediaType === 'series' ? 'series' : `${mediaType}s`;
      
      const response = await axios.put(
        `http://localhost:5005/api/${endpoint}/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      setMedia(response.data);
    } catch (error) {
      console.log(`Error al cambiar el estado:`, error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("authToken");
      const endpoint = mediaType === 'series' ? 'series' : `${mediaType}s`;
      
      const response = await axios.put(
        `http://localhost:5005/api/${endpoint}/${id}/comment`,
        { comment },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      setMedia(response.data);
      setIsEditingComment(false);
    } catch (error) {
      console.log('Error al guardar el comentario:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-600">
        <Navbar />
        <div className="flex flex-grow">
          <div className="flex-1 p-6 flex justify-center items-center">
            <span className="loading loading-spinner text-primary"></span>
            <p className="ml-2 text-white">Cargando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-slate-600">
        <Navbar />
        <div className="flex flex-grow">
          <div className="flex-1 p-6">
            <div className="alert alert-error">
              <span>{error || "No se encontró el contenido"}</span>
            </div>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-600 relative">

      {media.backdrop && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url(${media.backdrop})`,
            filter: 'brightness(0.3)'
          }}
        />
      )}

      <div className="flex flex-grow relative z-10">
        <div className="flex-1 p-6">
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <img 
                  src={media.poster} 
                  alt={media.title}
                  className="w-full max-w-[400px] mx-auto rounded-lg shadow-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-poster.png';
                  }}
                />
                <div className="flex justify-center gap-4 mt-4">
                  <button 
                    className="text-4xl hover:scale-110 transition-transform disabled:opacity-50"
                    onClick={() => handleStatusChange(media.status === 'favorite' ? null : 'favorite')}
                    disabled={statusLoading}
                  >
                    {media.status === 'favorite' ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart className="text-white" />}
                  </button>
                  <button 
                    className="text-4xl hover:scale-110 transition-transform disabled:opacity-50"
                    onClick={() => handleStatusChange(media.status === 'viewed' ? null : 'viewed')}
                    disabled={statusLoading}
                  >
                    {media.status === 'viewed' ? <MdVisibility className="text-green-500" /> : <MdVisibilityOff className="text-white" />}
                  </button>
                  <button 
                    className="text-4xl hover:scale-110 transition-transform disabled:opacity-50"
                    onClick={() => handleStatusChange(media.status === 'pending' ? null : 'pending')}
                    disabled={statusLoading}
                  >
                    {media.status === 'pending' ? <BsBookmarkFill className="text-yellow-500" /> : <BsBookmark className="text-white" />}
                  </button>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <div className="bg-base-100/90 backdrop-blur-sm rounded-lg p-6 shadow-xl">
                  <h1 className="text-4xl font-bold mb-2">{media.title}</h1>
                  <p className="text-lg mb-6">{media.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Detalles</h3>
                      <div className="space-y-2">
                        <p>⭐ Valoración: {media.rating}</p>
                        {media.releaseDate && (
                          <p>📅 Fecha de estreno: {new Date(media.releaseDate).toLocaleDateString()}</p>
                        )}
                        {mediaType === 'movie' ? (
                          <p>⏱️ Duración: {media.runtime} minutos</p>
                        ) : (
                          <p>📺 Temporadas: {media.seasons}</p>
                        )}
                        {media.director && <p>🎬 Director: {media.director}</p>}
                        {media.genre && media.genre.length > 0 && (
                          <p>🎭 Género: {media.genre.join(", ")}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-2">Reparto</h3>
                      <p className="text-sm">{media.cast && media.cast.length > 0 ? media.cast.join(", ") : "No disponible"}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    
                    {isEditingComment ? (
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full h-32 p-4 rounded-lg bg-base-200"
                          placeholder="Escribe tu comentario aquí..."
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="btn btn-primary">
                            Guardar
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-ghost"
                            onClick={() => {
                              setComment(media.comment || '');
                              setIsEditingComment(false);
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div 
                        className="bg-base-200 p-4 rounded-lg min-h-[100px] cursor-pointer hover:bg-base-300 transition-colors"
                        onClick={() => setIsEditingComment(true)}
                      >
                        {media.comment ? (
                          <p>{media.comment}</p>
                        ) : (
                          <p className="text-gray-500 italic">
                            Haz clic aquí para añadir un comentario...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}