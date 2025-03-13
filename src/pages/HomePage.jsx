import Carousel from '../components/Carousel';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="hero min-h-screen relative">
      <div className="absolute inset-0 w-full h-full">
        <Carousel />
      </div>
      <div className="hero-overlay bg-opacity-60 z-10"></div>
      <div className="hero-content text-neutral-content text-center z-20 pt-0 mt-0">
        <div className="max-w-md flex flex-col items-center -mt-15">
          <img src="/icon-app-final.png" alt="Watchery Logo" className="h-64 w-64 mb-8"/>
          <div className="mb-2">
            <span className="text-5xl font-bold">Watch</span><span className="text-5xl font-light">ery</span>
          </div>
          <p className="mb-10">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
          <Link to="/login" className="btn btn-primary px-8">Adelante</Link>
        </div>
      </div>
    </div>
  );
}