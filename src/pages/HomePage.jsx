import Carousel from '../components/Carousel';
import { Link } from 'react-router-dom';
import { FaFilm, FaTv, FaChartLine } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-base-200" style={{ height: 'calc(100vh - 136px)' }}>
      <div className="absolute inset-0 w-full h-full">
        <Carousel />
      </div>
      <div className="absolute inset-0 bg-opacity-70 backdrop-blur-sm z-10"></div>
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className={`w-[1200px] mx-auto px-4 flex flex-col items-center transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          
          <img 
            src="/icon-app-final.png" 
            alt="Watchery Logo" 
            className="h-64 w-64 mb-6 drop-shadow-2xl transition-transform duration-300 hover:scale-105"
          />
          <div className={`mb-4 transition-opacity duration-700 delay-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-6xl font-bold text-primary">Watch</span>
            <span className="text-6xl font-light text-secondary">ery</span>
          </div>
          
          
          <p className={`mb-8 text-xl font-light max-w-lg text-center leading-relaxed text-white transition-opacity duration-700 delay-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Lleva el control de todo lo que ves con Watchery, tu diario personal de películas y series.
          </p>
          
          
          <div className={`grid grid-cols-3 gap-6 mb-10 w-full transition-opacity duration-700 delay-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-base-100 bg-opacity-20 backdrop-blur-md shadow-xl rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="p-6 flex flex-col items-center text-center">
                <FaFilm className="text-4xl text-primary mb-2" />
                <h3 className="text-xl font-bold mb-2 text-white">Películas</h3>
                <p className="text-white">Registra todas las películas que has visto y descubre nuevas opciones.</p>
              </div>
            </div>
            <div className="bg-base-100 bg-opacity-20 backdrop-blur-md shadow-xl rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="p-6 flex flex-col items-center text-center">
                <FaTv className="text-4xl text-primary mb-2" />
                <h3 className="text-xl font-bold mb-2 text-white">Series</h3>
                <p className="text-white">Mantén un seguimiento de tus series favoritas y los episodios que has visto.</p>
              </div>
            </div>
            <div className="bg-base-100 bg-opacity-20 backdrop-blur-md shadow-xl rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="p-6 flex flex-col items-center text-center">
                <FaChartLine className="text-4xl text-primary mb-2" />
                <h3 className="text-xl font-bold mb-2 text-white">Estadísticas</h3>
                <p className="text-white">Visualiza tus hábitos de visualización y descubre tus géneros favoritos.</p>
              </div>
            </div>
          </div>
          
          <div className={`transition-all duration-700 delay-900 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Link 
              to="/login" 
              className="btn btn-primary btn-lg px-12 text-lg font-medium shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}